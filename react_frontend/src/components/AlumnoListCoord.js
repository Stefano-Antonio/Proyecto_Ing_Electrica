import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import "./AlumnoList.css";

const AlumnoListCoord = () => {
  const [alumnos, setAlumnos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/alumnos')
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setAlumnos(response.data);
      })
      .catch(error => console.error('Error al obtener alumnos:', error));
  }, []);

  const handleNavigate = () => {
    navigate("/crear-alumno");
  };
  

  return (
    <div className="alumno-container">
      <h3>Administrar alumnos</h3>
      <p>Lista de alumnos asociados al programa académico</p>
      <div className="scrollable-table">
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
            <td>{alumno.nombre}</td>
            <td>{alumno.matricula}</td> 
            <td></td>
            <td></td>
            <td className="actions">
                  <button className="icon-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
            <td></td>
            <td></td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>

      <div className="add-delete-buttons">
          <button onClick={handleNavigate}>Agregar alumnos</button>
          <button >Administrar tutorados</button>
        </div>

      <ul>
        
      </ul>
    </div>
  );
};



export default AlumnoListCoord;