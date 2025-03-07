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
  const { nombre , matricula, matriculaTutor } = location.state || {};
  console.log("Nombre y matrícula del tutor:", nombre,matricula, matriculaTutor, id_carrera);
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

      console.log("Horario eliminado correctamente.");
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

      console.log("Comentario enviado por correo correctamente.");
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const actualizarEstatus = async () => {
    if (estatus === null) {
      alert("Por favor, seleccione una opción antes de guardar.");
      return;
    }

    try {
      console.log("Actualizando estatus...");
      const response = await fetch(`http://localhost:5000/api/tutores/estatus/actualizar/${matricula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatus, comentario }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estatus");
      }

      console.log("Estatus actualizado correctamente.");

      if (estatus === 0) { // Si está rechazado
        console.log("Eliminando horario...");
        await eliminarHorario(); // Esperar a que se complete
        console.log("Horario eliminado.");

        console.log("Enviando comentario por correo...");
        await enviarComentarioCorreo(); // Esperar a que se complete
        console.log("Comentario enviado.");
      }

      
    setMostrarModal(false);    } catch (error) {
      console.error("Error al actualizar el estatus:", error);
      alert("Hubo un error al actualizar el estatus.");
    }
  };

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor"); // Limpiar la matrícula del tutor al cerrar sesión
    navigate("/");
  };

  return (
    <div className="horario-layout">
      <div className="horario-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        </div>
        <div className="top-right">
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
            <div className="checkbox-group">
              <input
                type="radio"
                id="accepted"
                name="validation"
                value="1"
                onChange={() => setEstatus(1)}
              />
              <label htmlFor="accepted">Aceptado</label>
            </div>
            <div className="checkbox-group">
              <input
                type="radio"
                id="rejected"
                name="validation"
                value="0"
                onChange={() => setEstatus(0)}
              />
              <label htmlFor="rejected">Rechazado</label>
            </div>
            <button className="submit-btn" onClick={() => setMostrarModal(true)} 
                    disabled={estatus === null}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevisionHorarioTutor;