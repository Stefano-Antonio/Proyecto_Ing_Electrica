import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Importar useLocation y useNavigate
import "./InicioTutor.css";

function InicioTutor() {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [comprobantes, setComprobantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const navigate = useNavigate();
  const { nombre, matricula, id_carrea } = location.state || {};
  const matriculaTutor = localStorage.getItem("matricula");

  // Guardar la matrícula del tutor en localStorage
  useEffect(() => {
    if (matriculaTutor) {
      localStorage.setItem("matriculaTutor", matriculaTutor);
    }
  }, [matriculaTutor]);
  console.log("Matrícula del tutor:", nombre, matriculaTutor);
  // Obtener la matrícula del tutor desde localStorage si no está en location.state
  const storedMatriculaTutor = localStorage.getItem("matriculaTutor");

  // Evitar que el usuario regrese a la pantalla anterior con el botón de retroceso
  useEffect(() => {
    const bloquearAtras = () => {
      window.history.pushState(null, null, window.location.href);
    };

    bloquearAtras();
    window.addEventListener("popstate", bloquearAtras);

    return () => {
      window.removeEventListener("popstate", bloquearAtras);
    };
  }, []);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const matricula = matriculaTutor || storedMatriculaTutor;
        if (!matricula) {
          console.error("Matrícula del tutor no encontrada");
          setError("Matrícula del tutor no encontrada");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/tutores/${matricula}`);
        if (!response.ok) {
          throw new Error("Error al obtener los alumnos");
        }

        const data = await response.json();
        console.log("Alumnos recibidos:", data.alumnos);

        const fetchEstatus = async (alumno) => {
          try {
            const estatusResponse = await fetch(`http://localhost:5000/api/tutores/estatus/${alumno.matricula}`);
            if (!estatusResponse.ok) {
              throw new Error("Error al obtener el estatus del horario");
            }
            const estatusData = await estatusResponse.json();
            return { ...alumno, estatus: estatusData.estatus };
          } catch (error) {
            console.error("Error al obtener el estatus del horario para", alumno.matricula, error);
            return { ...alumno, estatus: "Desconocido" };
          }
        };

        const alumnosConEstatus = await Promise.all(data.alumnos.map(fetchEstatus));
        setAlumnos(alumnosConEstatus);
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        setError("Error al cargar los alumnos. Por favor, inténtalo de nuevo.");
      }

      const fetchComprobantes = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/alumnos/comprobantes/lista');
          setComprobantes(response.data);
        } catch (error) {
          console.error('Error al obtener la lista de comprobantes:', error);
        }
      };
      fetchComprobantes();
    };

    fetchAlumnos();
  }, [matriculaTutor, storedMatriculaTutor]);

  const handleRevisarHorario = (alumno) => {
    console.log("alumno:", alumno);
    navigate(`/tutor/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaTutor , id_carrea: alumno.id_carrera } });
  };

  const handleValidate = (alumno) => {
    console.log("Navegando a: ", `/validar-pago/${alumno.matricula}`);
    navigate(`/tutor/validar-pago/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaTutor: matriculaTutor} });
  };
  

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor"); // Limpiar la matrícula del tutor al cerrar sesión
    navigate("/");
  };

  const getEstatusIcon = (estatus) => {
    switch (estatus) {
      case "Sin revisar":
        return <span className="status-icon yellow"></span>; 
      case "En espera":
        return <span className="status-icon gray"></span>; 
      case "Revisado":
        return <span className="status-icon green"></span>; 
      default:
        return <span className="status-icon yellow"></span>; 
    }
  };

  // Filtrar alumnos por búsqueda
  const alumnosFiltrados = alumnos.filter(alumno => 
    alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.estatus.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="tutor-layout">
      <div className="tutor-container">
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Tutor</h2>
        <h4>A continuación, se muestra una lista de alumnos asignados.</h4>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o estatus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {error && <p className="error-message">{error}</p>}
        {alumnosFiltrados.length > 0 ? (
        <div className="tutor-content">
          <table className="tutor-table">
            <thead>
              <tr>
                <th>Nombre del alumno</th>
                <th>Revisar horario</th>
                <th>Estatus</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((alumno) => (
                <tr key={alumno._id}>
                  <td>{alumno.nombre}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => handleRevisarHorario(alumno)}
                      disabled={alumno.estatus === "En espera"} // Deshabilitar botón si el estatus es "En espera"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="blue"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>{getEstatusIcon(alumno.estatus)}</td>
                  <td>
                {comprobantes.includes(`Pago_${alumno.matricula}.pdf`) ? (
                  alumno.estatusComprobante === "Rechazado" ? (
                    // Rojo: Rechazado
                    <button
                      className="icon-button"
                      onClick={() => handleValidate(alumno)}
                      title="Comprobante rechazado"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 24 24">
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                      </svg>
                    </button>
                  ) : alumno.estatusComprobante === "Pendiente" ? (
                    // Amarillo: Pendiente
                    <button
                      className="icon-button"
                      onClick={() => handleValidate(alumno)}
                      title="Comprobante pendiente de revisión"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFD600" viewBox="0 0 24 24">
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                      </svg>
                    </button>
                  ) : alumno.estatusComprobante === "Revisado" || alumno.estatusComprobante === "Aceptado" ? (
                    // Verde: Revisado/Aceptado
                    <button
                      className="icon-button"
                      onClick={() => handleValidate(alumno)}
                      title="Comprobante aceptado"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" viewBox="0 0 24 24">
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                      </svg>
                    </button>
                  ) : (
                    // Gris: Subido pero sin estatus válido
                    <button
                      className="icon-button"
                      onClick={() => handleValidate(alumno)}
                      title="Comprobante sin estatus"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#BDBDBD" viewBox="0 0 24 24">
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                      </svg>
                    </button>
                  )
                ) : (
                  // Gris: No subido
                  <span title="Sin comprobante">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#BDBDBD" viewBox="0 0 24 24">
                      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                    </svg>
                  </span>
                )}
              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <p className="no-alumnos-message">No se encontraron resultados.</p>
        )}
        <div className="horario-buttons">
          <button className="button">
            Descargar Lista de alumnos
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioTutor;