import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdministrarTutorados.css";

function AdministrarTutoradosAdmin() {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const navigate = useNavigate();
  const { matriculaAdmin } = location.state || {};
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (matriculaAdmin) {
      localStorage.setItem("matriculaTutor", matriculaAdmin);
    }
  }, [matriculaAdmin]);

  const storedMatriculaTutor = localStorage.getItem("matriculaTutor");

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

  const fetchAlumnoDetails = async (alumnoId) => {
    try {
      const alumnoResponse = await fetch(`${API_URL}/api/alumnos/${alumnoId}`);
      
      if (!alumnoResponse.ok) {
        throw new Error(`Error al obtener detalles del alumno con ID ${alumnoId}`);
      }
      
      return await alumnoResponse.json();
    } catch (error) {
      console.error("Error al obtener los detalles del alumno:", error);
      return null; // Retorna null si hay un error para evitar que el frontend falle
    }
  };

  
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const matricula = matriculaAdmin || storedMatriculaTutor;
        if (!matricula) {
          console.error("Matrícula del tutor no encontrada");
          setError("Matrícula del tutor no encontrada");
          return;
        }
  
        const response = await fetch(`${API_URL}/api/administradores/matricula/${matricula}`);
        if (!response.ok) {
          throw new Error("Error al obtener los alumnos");
        }
  
        const data = await response.json();
        if (!data.alumnos || !Array.isArray(data.alumnos)) {
          throw new Error("La respuesta de la API no contiene la lista de alumnos");
        }
  
        // Mapear y obtener los detalles de cada alumno por su ID
        const alumnosDetails = await Promise.all(
          data.alumnos.map(alumnoId => fetchAlumnoDetails(alumnoId)) // Enviar ID correctamente
        );
  
        // Filtrar alumnos que no se pudieron obtener
        const validAlumnos = alumnosDetails.filter(alumno => alumno !== null);
  
        // Obtener el estatus de cada alumno
        const fetchEstatus = async (alumno) => {
          try {
            const estatusResponse = await fetch(`${API_URL}/api/tutores/estatus/${alumno.matricula}`);
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
  
        const alumnosConEstatus = await Promise.all(validAlumnos.map(fetchEstatus));
        setAlumnos(alumnosConEstatus);
  
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        setError("Error al cargar los alumnos, no hay alumnos asignados");
      }
    };
  
    fetchAlumnos();
  }, [matriculaAdmin, storedMatriculaTutor]);
  

  const handleRevisarHorario = (alumno) => {
    navigate(`/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaAdmin: matriculaAdmin } });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor");
    navigate("/");
  };

  const handleBack = () => { 
    navigate("/administrador/alumnos", { state: { matriculaAdmin: matriculaAdmin || storedMatriculaTutor } }); // Navegar a la página anterior 
  }

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
    <div className="tutorados-layout">
      <div className="tutorados-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        </div>
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
        <div className="tutorados-content">
          <table className="tutorados-table">
            <thead>
              <tr>
                <th>Nombre del alumno</th>
                <th>Revisar horario</th>
                <th>Estatus</th>
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
                      disabled={alumno.estatus === "En espera"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdministrarTutoradosAdmin;