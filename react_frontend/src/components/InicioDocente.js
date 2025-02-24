import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioDocente.css";

function InicioDocente() {
 
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { nombre, matricula: matriculaDocente } = location.state || {};

    // Guardar la matrícula del tutor en localStorage
    useEffect(() => {
      if (matriculaDocente) {
        localStorage.setItem("matriculaDocente", matriculaDocente);
      }
    }, [matriculaDocente]);
  
    // Obtener la matrícula del tutor desde localStorage si no está en location.state
    const storedMatriculaDocente = localStorage.getItem("matriculaDocente");
  
    // 🔒 Evitar que el usuario regrese a la pantalla anterior con el botón de retroceso
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

  console.log("Estado recibido:", location.state);

    useEffect(() => {
      const fetchAlumnos = async () => {
        try {
          const matricula = matriculaDocente || storedMatriculaDocente;
          if (!matricula) {
            console.error("Matrícula del docente no encontrada");
            setError("Matrícula del docente no encontrada");
            return;
          }
  
          const response = await fetch(`http://localhost:5000/api/docentes/${matricula}`);
          if (!response.ok) {
            throw new Error("Error al obtener los alumnos");
          }
  
          const data = await response.json();
          console.log("Alumnos recibidos:", data.alumnos);
  
          const fetchEstatus = async (alumno) => {
            try {
              const estatusResponse = await fetch(`http://localhost:5000/api/docentes/estatus/${alumno.matricula}`);
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
      };
  
      fetchAlumnos();
    }, [matriculaDocente, storedMatriculaDocente]);


  const handleRevisarHorario = (matriculaAlumno) => {
    console.log("Navegando a: ", `/revisar-horario/${matriculaAlumno}`);
    navigate(`/revisar-horario/${matriculaAlumno}`, { state: { nombre, matricula: matriculaDocente || storedMatriculaDocente } });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleChangeView = () => {
    navigate('/inicio-docente-2', { state: { nombre, matricula: matriculaDocente || storedMatriculaDocente } });
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

  return (
    <div className="docente-layout">
      <div className="docente-container">

        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>

        <h2>Docente</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <h4>A continuacion, seleccione la lista que desee visualizar</h4>

        <div className="docente-buttons">
            <button className="button">Lista de alumnos</button>
            <button className="button" onClick={handleChangeView}>Lista de materias</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="docente-content">
          <div className="docente-scrollable-table">
            <table className="docente-tabla">
              <thead>
                <tr>
                  <th>Nombre del alumno</th>
                  <th>Revisar horario</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno._id}>
                  <td>{alumno.nombre}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => handleRevisarHorario(alumno.matricula)}
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
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          
        </div>
        <div className="horario-buttons">
          <button className="button">
            Subir base de datos de materias
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioDocente;