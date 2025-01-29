import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./AdministrarPersonal.css";

const AdministratPersonalCoordinador = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/personal/${usuarioAEliminar}`);
      setPersonal(prevState => prevState.filter(persona => persona._id !== usuarioAEliminar));
      alert("Personal eliminado con éxito");
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al eliminar personal:', error);
      alert("Hubo un error al eliminar el personal");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNavigate = () => {
    navigate("/crear-personal");
  };

  const handleModify = (persona) => {
    navigate("/modificar-personal", { state: { persona } });
  };

  const setModal = (id) => {
    setUsuarioAEliminar(id);
    setMostrarModal(true);
  }

  return (
    <div className="personal-container">
      <h3>Administrar personal</h3>
      <p className="info">Lista de docentes asociados al programa académico:</p>
      
      <div className="personal-scrollable-1">
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
              <th>Acciones</th>
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
                <td>
                  <div className="action-buttons">
                      <button className="icon-button" onClick={() => handleModify(persona)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button className="icon-button" onClick={() => setModal(persona._id)}>
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
        <button onClick={handleUpdateRoles}>Actualizar</button>
        <button onClick={handleNavigate}>Agregar personal</button>
      </div>
    </div>
  );
};

export default AdministratPersonalCoordinador;
