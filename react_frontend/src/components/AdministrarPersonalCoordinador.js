import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./AdministrarPersonal.css";

const AdministrarPersonalCoordinador = () => {
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

  const getRoleName = (roles) => {
    if (!roles) return "Sin rol"; // Si no tiene roles asignados
  
    const roleMap = {
      D: "Docente",
      T: "Tutor",
      C: "Coordinador",
      A: "Administrador"
    };
  
    if (Array.isArray(roles)) {
      // Si `roles` es un array, mapear cada valor
      return roles.map(role => roleMap[role] || role).join(", ");
    } else if (typeof roles === "string") {
      // Si `roles` es un string, dividir y mapear
      return roles.split("").map(role => roleMap[role] || role).join(", ");
    } else {
      return "Rol desconocido"; // Si `roles` tiene otro tipo inesperado
    }
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
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((persona) => (
              <tr key={persona.matricula}>
                <td>{persona.programa}</td>
                <td>{persona.nombre}</td>
                <td>{persona.matricula}</td>
                <td>{getRoleName(persona.roles)}</td>

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

export default AdministrarPersonalCoordinador;
