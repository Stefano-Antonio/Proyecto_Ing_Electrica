import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdministrarPersonal.css";

const AdministratPersonalCoordinador = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/personal')
      .then(response => {
        console.log(response.data);
        setPersonal(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener datos del personal:', error);
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (matricula, role) => {
    setPersonal(prevState => 
      prevState.map(persona => 
        persona.matricula === matricula
          ? {
              ...persona,
              roles: persona.roles.includes(role)
                ? persona.roles.filter(r => r !== role)
                : [...persona.roles, role]
            }
          : persona
      )
    );
  };

  const handleUpdateRoles = async () => {
    try {
      for (const persona of personal) {
        await axios.put(`http://localhost:5000/api/personal/${persona._id}`, { roles: persona.roles });
        console.log("Roles actualizados para", persona.matricula);
      }
      alert("Roles actualizados con éxito");
    } catch (error) {
      console.error('Error al actualizar roles:', error);
      alert("Hubo un error al actualizar los roles");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-container">
      <h3>Administrar personal</h3>
      <p className="info">Lista de docentes asociados al programa académico:</p>
      
      <div className="personal-scrollable">
        <table className="personal-table">
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
                    onChange={() => handleCheckboxChange(persona.matricula, "D")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={persona.roles.includes("A")}
                    onChange={() => handleCheckboxChange(persona.matricula, "A")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={persona.roles.includes("C")}
                    onChange={() => handleCheckboxChange(persona.matricula, "C")}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={persona.roles.includes("T")}
                    onChange={() => handleCheckboxChange(persona.matricula, "T")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-delete-buttons">
        <button onClick={handleUpdateRoles}>Actualizar</button>
        <button>Agregar personal</button>
      </div>
    </div>
  );
};

export default AdministratPersonalCoordinador;
