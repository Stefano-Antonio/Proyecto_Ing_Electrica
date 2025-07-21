import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdministrarMaterias.css";

const AdministrarMateriasAG = () => {
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [materiaAEliminar, setMateriaAEliminar] = useState(null);

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
        `http://localhost:5000/api/materias`
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
      const response = await axios.get("http://localhost:5000/api/docentes");
      setDocentes(response.data);
    } catch (error) {
      console.error("Error al obtener datos de docentes:", error);
    }
  };

  // Obtener nombre del docente asignado
  const getDocenteNombre = (materia) => {
    return materia && materia.docenteNombre ? materia.docenteNombre : "Sin asignar";
  };

  const handleDownloadCSV = async () => {
    const ids = materiasFiltradas.map(m => m._id);
    if (ids.length === 0) {
      toast.error("No hay materias filtradas para exportar.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/materias/exportar-csv/filtrados",
        { ids },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "materias_filtradas.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error al descargar materias filtradas:", error);
      toast.error("No se pudo exportar el CSV.");
    }
  };

  // Función para formatear el nombre de la materia
  const formatUrl = (nombre) => {
    return nombre
      .normalize("NFD") // Normaliza el texto para separar los acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
      .toLowerCase() // Convierte a minúsculas
      .replace(/[^a-z0-9\s]/g, "") // Elimina caracteres especiales
      .trim() // Elimina espacios al inicio y al final
      .replace(/\s+/g, "-"); // Reemplaza espacios por guiones
  };
  

  const handleListaAlumnos = (materia) => {
    const materiaUrl = formatUrl(materia.nombre); // Formatea el nombre de la materia
    navigate(`/docente/materias/${materiaUrl}/lista-alumnos`, {
      state: {
        nombre: docentes.nombre,
        matricula: docentes.matricula,
        materiaId: materia._id,
        materiaNombre: materia.nombre,
      },
    });
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
      materia.id_carrera,
      getDocenteNombre(materia),
    ].some((campo) => campo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  

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
                  <th>Carrera</th>
                  <th>Grupo</th>
                  <th>Salón</th>
                  <th>Cupo</th>
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
                    <td>{materia.id_carrera}</td>
                    <td>{materia.grupo}</td>
                    <td>{materia.salon}</td>
                    <td>{materia.cupo}</td>
                    <td>{materia.nombre}</td>
                    <td c>{getDocenteNombre(materia)}</td>
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
          </div>
        ) : (
          <p className="no-alumnos-message">No se encontraron resultados.</p>
        )}


        <div className="add-delete-buttons">
          <button onClick={handleDownloadCSV}>Descargar CSV de materias</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarMateriasAG;
