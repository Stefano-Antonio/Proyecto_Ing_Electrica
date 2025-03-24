import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdministrarMaterias.css";

const AdministrarMateriasCG = () => {
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
    //console.log("nombre doscente:", getDocenteNombre(materia));
    return materia && materia.docenteNombre ? materia.docenteNombre : "Sin asignar";
  };

  // Confirmar y eliminar materia
  const handleDelete = async () => {
    if (!materiaAEliminar) return;
    try {
      await axios.delete(`http://localhost:5000/api/materias/${materiaAEliminar}`);
      toast.success("Materia eliminada con éxito");
      fetchMaterias(); // Recargar la lista de materias
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
      toast.error("Error al eliminar la materia");
    } finally {
      setMostrarModal(false);
    }
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
                  <th>Materia</th>
                  <th>Docente</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materiasFiltradas.map((materia) => (
                  <tr key={materia._id}>
                    <td>{materia.id_carrera}</td>
                    <td>{materia.grupo}</td>
                    <td>{materia.salon}</td>
                    <td>{materia.nombre}</td>
                    <td c>{getDocenteNombre(materia)}</td>
                    <td>{materia.horarios.lunes || "-"}</td>
                    <td>{materia.horarios.martes || "-"}</td>
                    <td>{materia.horarios.miercoles || "-"}</td>
                    <td>{materia.horarios.jueves || "-"}</td>
                    <td>{materia.horarios.viernes || "-"}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={() => navigate("/modificar-materia", { state: { materia } })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => {
                          setMateriaAEliminar(materia._id);
                          setMostrarModal(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M15 6V4a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
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
              <p>¿Está seguro que desea eliminar esta materia?</p>
              <p>Esta acción no se puede revertir.</p>
              <button onClick={handleDelete}>Eliminar</button>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="add-delete-buttons">
          <button onClick={() => navigate("/crear-materia-cg")}>Agregar nueva materia</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarMateriasCG;
