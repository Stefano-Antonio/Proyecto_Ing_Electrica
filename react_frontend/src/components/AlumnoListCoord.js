import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./AlumnoList.css";

const AlumnoListCoord = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [tutoresNombres, setTutoresNombres] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombreAlumno] = ("");
  const [matricula, setMatriculaAlumno] = useState("");
  const [AlumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const matriculaTutor = localStorage.getItem("matricula");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/alumnos/carrera/${matriculaTutor}`);
        const alumnosData = response.data;
        console.log("Alumnos:", response.data);

        // Obtener los detalles del tutor para cada alumno
        const tutoresNombresTemp = {};
        await Promise.all(alumnosData.map(async (alumno) => {
          if (alumno.tutor) {
            const tutorResponse = await axios.get(`http://localhost:5000/api/coordinadores/alumnos/${alumno.tutor}`);
            console.log("Tutor response:", tutorResponse);
            tutoresNombresTemp[alumno._id] = tutorResponse.data.nombre; // Extraer el nombre del tutor
          }
        }));


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

        const alumnosConEstatus = await Promise.all(alumnosData.map(fetchEstatus));

        setAlumnos(alumnosConEstatus);
        setTutoresNombres(tutoresNombresTemp);
      } catch (error) {
        console.error('Error al obtener alumnos:', error);
      }
    };

    fetchAlumnos();
  }, [matriculaTutor]);

  console.log("matriculaTutor:", matriculaTutor);

  const handleNavigate1 = () => {
    navigate("/crear-alumno", { state: { matriculaTutor: matriculaTutor } });
  };

  const handleNavigate2 = () => {
    navigate("/admin-tutor");
  };

  const handleNavigate3 = (alumno) => {
    console.log("Navegando a: ", `/revisar-horario/${alumno.matricula}`);
    navigate(`/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaTutor: matriculaTutor} });
  };

  const handleModify = (alumno) => {
    navigate("/modificar-alumno", { state: { alumno, matriculaTutor: matriculaTutor } });
  };

  const setModal = (id) => {
    setAlumnoAEliminar(id);
    setMostrarModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/alumnos/${AlumnoAEliminar}`);
      setAlumnos(prevState => prevState.filter(alumno => alumno._id !== AlumnoAEliminar));
      alert("Alumno eliminado con éxito");
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      alert("Hubo un error al eliminar el alumno");
    }
  };

  const getEstatusIcon = (estatus) => {
    console.log("Estatus:", estatus);
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
    <div className="alumno-container">
      <h3>Administrar alumnos</h3>
      <p>Lista de alumnos asociados al programa académico</p>
      <div className="alumno-scrollable-table">
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>Matricula</th>
              <th>Nombre del alumno</th>
              <th>Tutor asignado</th>
              <th>Horario</th>
              <th>Estatus de horario</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno._id}>
                <td>{alumno.matricula}</td>
                <td>{alumno.nombre}</td>
                <td>{tutoresNombres[alumno._id] ? tutoresNombres[alumno._id] : "Sin asignar"}</td>
                <td className="actions">
                  <button className="icon-button" onClick={() => handleNavigate3(alumno)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>{getEstatusIcon(alumno.estatus)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button" onClick={() => handleModify(alumno)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button className="icon-button" onClick={() => setModal(alumno._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M15 6V4a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>AVISO</h3>
            <p>¿Está seguro que desea continuar?</p>
            <p>
              Una vez eliminado, no podrá revertirse el proceso
            </p>
            <button onClick={handleDelete}>Continuar</button>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="add-delete-buttons">
        <button onClick={handleNavigate1}>Agregar alumnos</button>
        <button onClick={handleNavigate2}>Administrar tutorados</button>
      </div>

      <ul>
        
      </ul>
    </div>
  );
};

export default AlumnoListCoord;