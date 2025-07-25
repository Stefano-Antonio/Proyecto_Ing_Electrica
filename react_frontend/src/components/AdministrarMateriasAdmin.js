import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdministrarMaterias.css";

const AdministrarMateriasAdmin = () => {
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [mostrarModalMaterias, setMostrarModalMaterias] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [materiaAEliminar, setMateriaAEliminar] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const id_carrera = localStorage.getItem("id_carrera");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterias();
    fetchDocentes();
  }, []);

  // Cargar materias desde el backend
  const fetchMaterias = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/materias/carrera/${id_carrera}`
      );
      setMaterias(response.data);
    } catch (error) {
      console.error("Error al obtener datos de materias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar docentes desde el backend
  const fetchDocentes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/docentes`);
      setDocentes(response.data);
    } catch (error) {
      console.error("Error al obtener datos de docentes:", error);
    }
  };

  // Obtener nombre del docente asignado
  const getDocenteNombre = (materia) => {
    return materia && materia.docenteNombre ? materia.docenteNombre : "Sin asignar";
  };

  if (loading) {
    return <div className="loading">Cargando información de materias...</div>;
  }

  // Filtrar materias por búsqueda
  const materiasFiltradas = materias.filter((materia) =>
    [
      materia.salon,
      materia.nombre,
      materia.grupo,
      getDocenteNombre(materia),
    ].some((campo) => campo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

    const handleDownloadCSV = async () => {
      const id_carrera = localStorage.getItem("id_carrera");
      const ids = materiasFiltradas.map((m) => m._id);
  
      if (!id_carrera || ids.length === 0) {
        toast.error("No hay materias filtradas o falta el id_carrera.");
        return;
      }
  
      try {
        const response = await axios.post(
          `${API_URL}/api/materias/exportar-csv/carrera-filtrados/${id_carrera}`,
          { ids },
          { responseType: "blob" }
        );
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `materias_filtradas_${id_carrera}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("❌ Error al descargar CSV de materias filtradas:", error);
        toast.error("No se pudo descargar el archivo.");
      }
    };
  
    const handleDownloadDB = () => {
      setMostrarModalMaterias(true);
    };

  return (
    <div className="admin-materias">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="materia-container">
        <h3>Administrar materias</h3>
        <h4>A continuación, se muestran las siguientes opciones:</h4>
        <p className="info">Lista de materias activas:</p>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre, grupo, salón o docente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {materiasFiltradas.length > 0 ? (
          <div className="scrollable-table">
            <table className="materia-table">
              <thead>
                <tr>
                  <th>Grupo</th>
                  <th>Salón</th>
                  <th>Materia</th>
                  <th>Docente</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Sabado</th>
                </tr>
              </thead>
              <tbody>
                {materiasFiltradas.map((materia) => (
                  <tr key={materia._id}>
                    <td>{materia.grupo}</td>
                    <td>{materia.salon}</td>
                    <td>{materia.nombre}</td>
                    <td>{getDocenteNombre(materia)}</td>
                    <td>{materia.horarios.lunes || "-"}</td>
                    <td>{materia.horarios.martes || "-"}</td>
                    <td>{materia.horarios.miercoles || "-"}</td>
                    <td>{materia.horarios.jueves || "-"}</td>
                    <td>{materia.horarios.viernes || "-"}</td>
                    <td>{materia.horarios.sabado || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {mostrarModalMaterias && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Descargar base de datos</h3>
                  <p>Haga clic para descargar la base de datos:</p>
                  <ul>
                  </ul>
                  <p>
                  </p>
                  <button onClick={handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModalMaterias(false)}>Cerrar</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="no-alumnos-message">No se encontraron resultados.</p>
        )}

        <div className="add-delete-buttons">
           <button onClick={handleDownloadCSV}>Descargar base de datos de materias</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarMateriasAdmin;
