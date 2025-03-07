import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdministrarTutorados.css";

function AdministrarTutorados() {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const nombre = null;
  const { matriculaCord } = location.state || {};
  console.log("Matrícula del tutor:", matriculaCord);
  useEffect(() => {
    if (matriculaCord) {
      localStorage.setItem("matriculaTutor", matriculaCord);
    }
  }, [matriculaCord]);

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

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const matricula = matriculaCord || storedMatriculaTutor;
        if (!matricula) {
          console.error("Matrícula del tutor no encontrada");
          setError("Matrícula del tutor no encontrada");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/coordinadores/matricula/${matricula}`);
        if (!response.ok) {
          throw new Error("Error al obtener los alumnos");
        }

        const data = await response.json();
        if (!data.alumnos || !Array.isArray(data.alumnos)) {
          throw new Error("La respuesta de la API no contiene la lista de alumnos");
        }

        // Obtener los detalles de cada alumno utilizando sus IDs
        const fetchAlumnoDetails = async (alumnoId) => {
          try {
            console.log("Obteniendo detalles del alumno con ID:", alumnoId);
            const alumnoResponse = await fetch(`http://localhost:5000/api/alumnos/${alumnoId}`);
            if (!alumnoResponse.ok) {
              throw new Error("Error al obtener los detalles del alumno");
            }
            return await alumnoResponse.json();
          } catch (error) {
            console.error("Error al obtener los detalles del alumno:", error);
            return null;
          }
        };

        const alumnosDetails = await Promise.all(data.alumnos.map(alumno => fetchAlumnoDetails(alumno._id)));
        const validAlumnos = alumnosDetails.filter(alumno => alumno !== null);

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

        const alumnosConEstatus = await Promise.all(validAlumnos.map(fetchEstatus));
        setAlumnos(alumnosConEstatus);
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        setError("Error al cargar los alumnos. Por favor, inténtalo de nuevo.");
      }
    };

    fetchAlumnos();
  }, [matriculaCord, storedMatriculaTutor]);

  const handleRevisarHorario = (alumno) => {
    console.log("Revisar horario para el alumno:", alumno);
    navigate(`/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaCord: matriculaCord } });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor");
    navigate("/");
  };

  const handleBack = () => { 
    navigate("/inicio-coordinador/alumnos", { state: { matriculaCord: matriculaCord || storedMatriculaTutor } }); // Navegar a la página anterior 
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
    <div className="tutorados-layout">
      <div className="tutorados-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        </div>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Tutor</h2>
        <p>A continuación, se muestra una lista de alumnos asignados.</p>
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
              {alumnos.map((alumno) => (
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

export default AdministrarTutorados;