import "./AdministrarPersonal.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdministrarPersonalAG = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda

  const navigate = useNavigate();
  useEffect(() => {
    const fetchPersonal = async () => {
      const matricula = localStorage.getItem("matricula");
      if (!matricula) {
        console.error("Matrícula no encontrada en localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/personal`);
        const personalConCarrera = await Promise.all(response.data.map(async (persona) => {
          try {
        const carreraResponse = await axios.get(`http://localhost:5000/api/admingen/carrera/${persona.matricula}`);
        return { ...persona, id_carrera: carreraResponse.data.id_carrera };
          } catch (error) {
        console.error(`Error al obtener id_carrera para ${matricula}:`, error.message);
        return persona;
          }
        }));
        setPersonal(personalConCarrera);
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
    persona.id_carrera?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.rolesTexto.includes(searchTerm.toLowerCase())
  );
  
    const handleDownloadCSV = async () => {
      const matriculas = personalFiltrado.map(p => p.matricula); // Asumiendo que el estado se llama personalFiltrado

      if (matriculas.length === 0) {
        toast.error("No hay registros filtrados de personal para exportar.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/personal/exportar-csv/filtrados",
          { matriculas },
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "personal_filtrado.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error al descargar CSV de personal:", error);
        toast.error("No se pudo generar el archivo.");
      }
    };

  return (
    <div className="personal-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="personal-container">
        <h3>Administrar personal</h3>
        <p className="info">Lista de personas asociados al programa académico:</p>

 
          <input
            type="text"
            placeholder="Buscar por carrera, matrícula, nombre o permisos..."
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
                <td>{['C', 'A'].some(role => personal.roles.includes(role)) ? personal.id_carrera : '-'}</td> {/* Muestra el nombre del programa o un guion */}
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
          <button onClick={handleDownloadCSV}>Descargar CSV personal</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarPersonalAG;