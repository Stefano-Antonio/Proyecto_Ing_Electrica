import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./AlumnoList.css";

const AlumnoListCoord = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [AlumnoAEliminar, setAlumnoAEliminar] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const matricula = localStorage.getItem("matricula");
    axios.get(`http://localhost:5000/api/alumnos/matricula/${matricula}`)
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setAlumnos(response.data);
      })
      .catch(error => console.error('Error al obtener alumnos:', error));
  }, []);

  const handleNavigate1 = () => {
    navigate("/crear-alumno");
  };

  const handleNavigate2 = () => {
    navigate("/admin-tutor");
  };

  const handleNavigate3 = () => {
    navigate("/revisar-horario");
  };

  const handleModify = (alumno) => {
    navigate("/modificar-alumno", { state: { alumno } });
  };

  const setModal = (id) => {
    setAlumnoAEliminar(id);
    setMostrarModal(true);
  }
  
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

  return (
    <div className="alumno-container">
      <h3>Administrar alumnos</h3>
      <p>Lista de alumnos asociados al programa académico</p>
      <div className="alumno-scrollable-table">
      <table className = "alumnos-table">
        <thead>
          <tr>
            <th>Matricula</th>
            <th>Nombre del alumno</th>
            <th>Asignar Tutor</th>
            <th>Tutor asignado</th>
            <th>Horario</th>
            <th>Estatus de horario</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
        {alumnos.map(alumno => (
          <tr key={alumno._id}>
            <td>{alumno.matricula}</td>
            <td>{alumno.nombre}</td> 
            <td></td>
            <td></td>
            <td className="actions">
                  <button className="icon-button" onClick={handleNavigate3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
            <td></td>
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