import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./AdministrarMaterias.css";


const AdministrartMaterias = () => {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/materias')
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setMaterias(response.data);
      })
      .catch(error => console.error('Error al obtener materias:', error));
  }, []);

  return (
    <div className="admin-materias">
      

      <div className="materia-container">
        <h3>Administrar materias</h3>
        <h4>A continuación, se muestran las siguientes opciones:</h4>
        <p className="info">Lista de materias activas:</p>
        
        <div className="scrollable-table">
          <table className='materia-table'>
            <thead>
              <tr>
                <th>Inscrito</th>
                <th>Grupo</th>
                <th>Salón</th>
                <th>Materia</th>
                <th>Docente</th>
                <th>Modificar Horario</th>
                <th>Eliminar</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia._id}>
                  <td><input type="checkbox" /></td>
                  <td>{materia.grupo}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.docente || "-"}</td>
                  <td>
                    <button className="icon-button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button className="icon-button">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M15 6V4a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v2"></path>
                      </svg>
                    </button>
                  </td>
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

        <div className="add-delete-buttons">
          <button>Agregar nueva materia</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrartMaterias;