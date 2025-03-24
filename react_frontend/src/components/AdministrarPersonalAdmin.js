import "./AdministrarPersonal.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdministrarPersonalAdmin = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
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

  const personalConRoles = personal.map(persona => ({
    ...persona,
    rolesTexto: getRoleText(persona.roles).toLowerCase()
  }));
  
  const personalFiltrado = personalConRoles.filter(persona => 
    persona.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.rolesTexto.includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = async () => {
    const id_carrera = localStorage.getItem("id_carrera");
    if (!id_carrera) {
      toast.error("ID de carrera no encontrado.");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/personal/exportar-csv/carrera/${id_carrera}`,
        { responseType: "blob" } // Recibir como blob para descarga
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "personal.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo CSV:", error);
      toast.error("No se pudo descargar el archivo.");
    }
  };
  
  return (
    <div className="personal-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="personal-container">
        <h3>Administrar personal</h3>
        <p className="info">Lista de personas asociados al programa académico:</p>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por matrícula, nombre o permisos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {personalFiltrado.length > 0 ? (
        <div className="personal-scrollable-1">
          <table className="personal-table">
            <thead>
              <tr>
                <th>Programa</th>
                <th>Nombre</th>
                <th>Matricula</th>
                <th>Permisos</th>
              </tr>
            </thead>
            <tbody>
            {personalFiltrado.length > 0 ? (
              personalFiltrado
              .sort((a, b) => {
                const roleOrder = { 'C': 1, 'A': 2, 'D': 3, 'T': 4 };
                const aRole = a.roles.find(role => roleOrder[role]) || 'T';
                const bRole = b.roles.find(role => roleOrder[role]) || 'T';
                return roleOrder[aRole] - roleOrder[bRole];
              })
              .map(personal => (
                <tr key={personal.matricula}>
                  <td>{['C', 'A'].some(role => personal.roles.includes(role)) ? id_carrera : '-'}</td> {/* Muestra el nombre del programa o un guion */}
                  <td>{personal.nombre}</td> {/* Muestra el nombre del docente */}
                  <td>{personal.matricula}</td> {/* Muestra el ID del docente */}
                  <td>{getRoleText(personal.roles)}</td> {/* Muestra el rol del docente */}

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
      ) : (
        <p className="no-alumnos-message">No se encontraron resultados.</p>
      )}
        <div className="add-delete-buttons">
          <button onClick={handleDownloadCSV}>Descargar base de datos de personal</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarPersonalAdmin;