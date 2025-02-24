import "./AdministrarPersonal.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdministratPersonalCoordinador = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  
  const navigate = useNavigate();
  const id_carrera = localStorage.getItem("id_carrera");
  useEffect(() => {
    const fetchPersonal = async () => {
      const matricula = localStorage.getItem("matricula");
      if (!matricula) {
        console.error("Matrícula no encontrada en localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/personal/carrera/${matricula}`);
        console.log("Personal encontrado:", response.data);
        setPersonal(response.data);
      } catch (error) {
        console.error("Error al obtener datos del personal:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonal();
  }, []);


  const handleRoleChange = (matricula, nuevoRol) => {
    setPersonal(prevState =>
      prevState.map(persona =>
        persona.matricula === matricula ? { ...persona, roles: nuevoRol } : persona
      )
    );
  };

  const handleUpdateRoles = async () => {
    try {
      await Promise.all(
        personal.map(persona =>
          axios.put(`http://localhost:5000/api/personal/${persona._id}`, { roles: persona.roles })
        )
      );
      alert("Roles actualizados con éxito");
    } catch (error) {
      console.error("Error al actualizar roles:", error.message);
      alert("Hubo un error al actualizar los roles");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/personal/${usuarioAEliminar}`);
      setPersonal(prevState => prevState.filter(persona => persona._id !== usuarioAEliminar));
      alert("Personal eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar personal:", error.message);
      alert("Hubo un error al eliminar el personal");
    } finally {
      setMostrarModal(false);
    }
  };

  const getRoleText = (roles) => {
    if (!Array.isArray(roles)) {
      return 'Desconocido';
    }
  
    return roles.map(role => {
      switch (role) {
        case 'D':
          return 'Docente';
        case 'T':
          return 'Tutor';
        case 'C':
          return 'Coordinador';
        case 'A':
          return 'Administrador';
        default:
          return 'Desconocido';
      }
    }).join(', ');
  };


  if (loading) {
    return <div className="loading">Cargando información del personal...</div>;
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
          {personal.length > 0 ? (
            personal.map(personal => (
              <tr key={personal.matricula}>
                <td>{id_carrera}</td> {/* Muestra el nombre del programa */}
                <td>{personal.nombre}</td> {/* Muestra el nombre del docente */}
                <td>{personal.matricula}</td> {/* Muestra el ID del docente */}
                <td>{getRoleText(personal.roles)}</td> {/* Muestra el rol del docente */}
                <td>
                  <div className="action-buttons">
                    <button className="icon-button" onClick={() => navigate("/modificar-personal", { state: { personal } })}>
                      ✏️
                    </button>
                    <button className="icon-button" onClick={() => { setUsuarioAEliminar(personal._id); setMostrarModal(true); }}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay personal disponible.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>AVISO</h3>
            <p>¿Está seguro que desea eliminar este usuario?</p>
            <p>Esta acción no se puede revertir.</p>
            <button onClick={handleDelete}>Eliminar</button>
            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="add-delete-buttons">
        <button onClick={handleUpdateRoles}>Actualizar roles</button>
        <button onClick={() => navigate("/crear-personal")}>Agregar personal</button>
      </div>
    </div>
  );
};

export default AdministratPersonalCoordinador;

