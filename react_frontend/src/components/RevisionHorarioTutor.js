import React, { useState, useEffect } from "react";
import "./RevisionHorarioTutor.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function RevisionHorarioTutor() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horario, setHorario] = useState([]);
  const [comentario, setComentario] = useState("");
  const [estatus, setEstatus] = useState(null);
  const [alumno, setAlumno] = useState(null); // Inicializar como null
  const navigate = useNavigate();

  // Recuperar el estado (nombre y matricula) desde la navegación
  const location = useLocation();
  const id_carrera = localStorage.getItem("id_carrera");
  const { nombre, matricula, matriculaTutor, matriculaDocente, origen } = location.state || {};
  const carrerasPermitidasSemiescolarizadas = ['ISftwS', 'IDsrS', 'IEIndS', 'ICmpS', 'IRMcaS', 'IElecS'];
  console.log("Nombre y matrícula del tutor:", nombre, matricula, matriculaTutor, id_carrera);
  useEffect(() => {
    fetch(`http://localhost:5000/api/tutores/horario/${matricula}`)
      .then(response => response.json())
      .then(data => {
        setAlumno(data.alumno);
        setHorario(data.horario);
      })
      .catch(error => console.error("Error al cargar el horario:", error));
  }, [matricula]);

  const eliminarHorario = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tutores/eliminar/${alumno.matricula}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el horario");
      }

      //navigate(-1); // Regresar a la página anterior
    } catch (error) {
      console.error("Error al eliminar el horario:", error);
    }
  };

  const enviarComentarioCorreo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tutores/${alumno._id}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el comentario por correo");
      }

      //navigate(-1); // Regresar a la página anterior
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const actualizarEstatus = async (nuevoEstatus) => {
    try {
      console.log("Actualizando estatus...");
      const response = await fetch(`http://localhost:5000/api/tutores/estatus/actualizar/${matricula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatus: nuevoEstatus, comentario }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el estatus");
      }
      //esperar 1 segundo antes de navegar
      navigate(-1); // Regresar a la página anterior
  
      if (nuevoEstatus === 0) { // Si está rechazado
        await eliminarHorario(); // Esperar a que se complete
  
        //await enviarComentarioCorreo(); // Esperar a que se complete
      }
    } catch (error) {
      alert("Hubo un error al actualizar el estatus.");
    }
  };

  const storedMatriculaTutor = localStorage.getItem("matriculaTutor");
  

  const handleBack = () => {
    navigate(-1, { state: { nombre, matricula: matriculaTutor || storedMatriculaTutor } });
  };

  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor"); // Limpiar la matrícula del tutor al cerrar sesión
    navigate("/");
  };

  const isSemiescolarizada = alumno && carrerasPermitidasSemiescolarizadas.includes(alumno.id_carrera);
  
  return (
    <div className="horario-layout">
      <div className="horario-container">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        <div className="logout-wrapper">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <h1>Revisión de horario</h1>
        {alumno ? (
          <>
            <div className="horario-header">
              <h3>Nombre del alumno: {alumno.nombre}</h3>
              <h3>Carrera: {alumno.id_carrera}</h3>
            </div>

            <div className="horario-content">
          {!isSemiescolarizada && (
            <>
              <table className="horario-table">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Salón</th>
                    <th>Materia</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                  </tr>
                </thead>
                <tbody>
                  {horario.map((materia, index) => (
                    <tr key={index}>
                      <td>{materia.grupo}</td>
                      <td>{materia.salon}</td>
                      <td>{materia.materia}</td>
                      <td>{materia.horarios.lunes || "-"}</td>
                      <td>{materia.horarios.martes || "-"}</td>
                      <td>{materia.horarios.miercoles || "-"}</td>
                      <td>{materia.horarios.jueves || "-"}</td>
                      <td>{materia.horarios.viernes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            
            </>
        )}

        {isSemiescolarizada && (
          <>
          
            <table className="horario-table">
            <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Salón</th>
                    <th>Materia</th>
                    <th>Paridad</th>
                    <th>Viernes</th>
                    <th>Sabado</th>
                  </tr>
                </thead>
                <tbody>
                  {horario.map((materia, index) => (
                    <tr key={index}>
                      <td>{materia.grupo}</td>
                      <td>{materia.salon}</td>
                      <td>{materia.materia}</td>
                      <td>{materia.semi}</td>
                      <td>{materia.horarios.viernes || "-"}</td>
                      <td>{materia.horarios.sabado || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            
            </>
        )}

            </div>
          </>
        ) : (
          <p>Cargando datos del alumno...</p>
        )}

        {mostrarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>AVISO</h3>
              <p>Una vez que finalice el proceso, no podrá hacer cambios.</p>
              <p>¿Desea continuar con la validación?</p>
              <button onClick={actualizarEstatus}>Continuar</button>
              <button onClick={() => setMostrarModal(false)}>Cerrar</button>
            </div>
          </div>
        )}

        <div className="comments-validation-wrapper">
          <div className="comments-section">
            <h3>Comentarios</h3>
            <textarea 
              placeholder="Ingrese comentarios en caso de tenerlos." 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} // Actualizar estado del comentario
            />
          </div>
          <div className="validation-section">
            <h3>Validación</h3>
            <div className="button-group">
            <button
              className="accept-button"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={() => {
                setEstatus(1);
                actualizarEstatus(1);
              }}
            >
              Aceptado
            </button>
            <button
              className="reject-button"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => {
                setEstatus(0);
                actualizarEstatus(0);
              }}
            >
              Rechazado
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevisionHorarioTutor;