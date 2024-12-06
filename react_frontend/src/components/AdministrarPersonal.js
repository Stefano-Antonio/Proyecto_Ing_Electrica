import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdministrarPersonal.css";

const AdministratPersonal = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realiza la solicitud para obtener el personal desde la base de datos
    axios.get('http://localhost:5000/api/personal')
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setPersonal(response.data); // Establece los datos del personal en el estado
        setLoading(false); // Indica que los datos han sido cargados
      })
      .catch(error => {
        console.error('Error al obtener datos del personal:', error); // Imprimir error en consola
        setLoading(false); // Asegurarse de cambiar el estado a 'false' en caso de error
      });
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  if (loading) {
    return <div>Loading...</div>; // Mostrar mensaje de carga
  }

  return (
    <div className="personal-container">
        <h3>Administrar personal</h3>
        <p className="info">Lista de docentes asociados al programa académico:</p>
        
        <div className="personal-scrollable">
          <table className='personal-table'>
            <thead>
              <tr>
                  <th>Programa</th>
                  <th>Nombre del docente</th>
                  <th>ID Docente</th>
                  <th>Docente</th>
                  <th>Administrador</th>
                  <th>Coordinador</th>
                  <th>Tutor</th>
              </tr>
            </thead>
            <tbody>
            {personal.map((persona) => (
            <tr key={persona.matricula}>
              <td>{persona.programa}</td>
              <td>{persona.nombre}</td>
              <td>{persona.matricula}</td>
              <td>
                <input
                  type="checkbox"
                  checked={persona.roles.includes("D")}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={persona.roles.includes("A")}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={persona.roles.includes("C")}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={persona.roles.includes("T")}
                  readOnly
                />
              </td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>

        <div className="add-delete-buttons">
          <button>Agregar personal</button>
        </div>
      </div>
  );
};

export default AdministratPersonal;