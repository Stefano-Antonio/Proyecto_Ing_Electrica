import "./AdministrarPersonal.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdministrarPersonalCoordinador = () => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalPersonal, setMostrarModalPersonal] = useState(false);
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

  const handleDownloadCSV = async () => {
  const id_carrera = localStorage.getItem("id_carrera");
  const matriculas = personalFiltrado.map((p) => p.matricula);

  if (!id_carrera || matriculas.length === 0) {
    toast.error("No hay personal filtrado o falta el id_carrera.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:5000/api/personal/exportar-csv/carrera-filtrados/${id_carrera}`,
      { matriculas },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `personal_filtrado_${id_carrera}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Error al descargar CSV filtrado de personal:", error);
    toast.error("No se pudo descargar el archivo.");
  }
};
    const handleDownloadDB = () => {
        setMostrarModalPersonal(true);
      };


  const handleDelete = async () => {
    try {
      const formData = {usuarioAEliminar, idCarreraEsperada: id_carrera}; // Incluir id_carrera en los datos del formulario
      await axios.delete("http://localhost:5000/api/personal/coordinador", formData);
      setPersonal(prevState => prevState.filter(persona => persona._id !== usuarioAEliminar));
      toast.success("Personal eliminado con éxito");
    } catch (error) {
      console.error("El docente o tutor tiene participacion en otra carrera", error.message);
      toast.error("El docente o tutor tiene participacion en otra carrera");
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

  const personalConRoles = personal.map(persona => ({
    ...persona,
    rolesTexto: getRoleText(persona.roles).toLowerCase()
  }));
  
  const personalFiltrado = personalConRoles.filter(persona => 
    persona.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.rolesTexto.includes(searchTerm.toLowerCase())
  );
  
  

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
                <th>Correo</th>
                <th>Telefono</th>
                <th>Permisos</th>
                <th>Acciones</th>
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
                  <td>{personal.correo}</td> {/* Muestra el ID del docente */}
                  <td>{personal.telefono}</td> {/* Muestra el ID del docente */}
                  <td>{getRoleText(personal.roles)}</td> {/* Muestra el rol del docente */}
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button" onClick={() => navigate("/coordinador/modificar-personal", { state: { personal } })}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button className="icon-button" onClick={() => { setUsuarioAEliminar(personal._id); setMostrarModal(true); }}>
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

        {mostrarModalPersonal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Descargar base de datos</h3>
                  <p>Haga clic para descargar la base de datos:</p>
                  <ul>
                  </ul>
                  <p>
                  </p>
                  <button onClick={handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModalPersonal(false)}>Cerrar</button>
                </div>
              </div>
            )}

        <div className="add-delete-buttons">
          <button onClick={() => navigate("/coordinador/crear-personal")}>Agregar personal</button>
          <button onClick={handleDownloadDB}>Descargar CSV de personal</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarPersonalCoordinador;