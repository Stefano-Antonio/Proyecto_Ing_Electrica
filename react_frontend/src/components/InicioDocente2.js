import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./InicioDocente2.css";

function InicioDocente2() {
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const location = useLocation();
  const navigate = useNavigate();

  const { nombre: nombreDocente, matricula: matriculaDocente } = location.state || {};

  // Guardar la matrícula y el nombre del docente en localStorage
  useEffect(() => {
    if (matriculaDocente) {
      localStorage.setItem("matriculaDocente", matriculaDocente);
    }
    if (nombreDocente) {
      localStorage.setItem("nombreDocente", nombreDocente);
    }
  }, [matriculaDocente, nombreDocente]);

  // Obtener la matrícula y el nombre del docente desde localStorage si no están en location.state
  const storedMatriculaDocente = localStorage.getItem("matriculaDocente");
  const storedNombreDocente = localStorage.getItem("nombreDocente");

  // Evitar que el usuario regrese a la pantalla anterior con el botón de retroceso
  useEffect(() => {
    const bloquearAtras = () => {
      window.history.pushState(null, null, window.location.href);
    };

    bloquearAtras();
    window.addEventListener("popstate", bloquearAtras);

    return () => {
      window.removeEventListener("popstate", bloquearAtras);
    };
  }, []);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const matricula = matriculaDocente || storedMatriculaDocente;
        if (!matricula) {
          console.error("Matrícula del docente no encontrada");
          setError("Matrícula del docente no encontrada");
          return;
        }

        //  OBTENER MATERIAS DEL DOCENTE 
        const response = await fetch(`http://localhost:5000/api/docentes/materias/${matricula}`);
        if (!response.ok) {
          throw new Error("Error al obtener las materias");
        }

        const data = await response.json();
        console.log("Materias recibidas:", data.materias);

        // 🔹 GUARDAR MATERIAS EN EL ESTADO
        setMaterias(data.materias);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
        setError("Error al cargar las materias. Por favor, inténtalo de nuevo.");
      }
    };

    fetchMaterias();
  }, [matriculaDocente, storedMatriculaDocente]);

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
        nombre: nombreDocente || storedNombreDocente,
        matricula: matriculaDocente || storedMatriculaDocente,
        materiaId: materia._id,
        materiaNombre: materia.nombre,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("matriculaDocente");
    localStorage.removeItem("nombreDocente");
    navigate("/");
  };

  const handleChangeView = () => {
    navigate('/docente/alumnos', { state: { nombre: nombreDocente || storedNombreDocente, matricula: matriculaDocente || storedMatriculaDocente } });
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
      link.setAttribute(
        "download",
        `materias_${matriculaDocente || storedMatriculaDocente}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error al descargar materias filtradas:", error);
      toast.error("No se pudo exportar el CSV.");
    }
  };

  // Filtrar materias por búsqueda
  const materiasFiltradas = materias.filter(materias => 
    materias.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materias.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materias.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="docente-layout">
      <div className="docente-container">
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <h2>Docente</h2>
        <h4>{`Bienvenido, ${nombreDocente || storedNombreDocente}`}</h4>
        <h4>A continuación, seleccione la lista que desee visualizar</h4>

        <div className="docente-buttons">
          <button className="button" onClick={handleChangeView}>Lista de alumnos</button>
          <button className="button">Lista de materias</button>
        </div>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o grupo o salon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {error && <p className="error-message">{error}</p>}
        {materiasFiltradas.length > 0 ? (
        <div className="docente-content-2">
          <table className="docente-table-2">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Grupo</th>
                <th style={{ textAlign: "center" }}>Salón</th>
                <th style={{ textAlign: "center" }}>Alumnos</th>
                <th style={{ textAlign: "center" }}>Cupo</th>
                <th style={{ textAlign: "center" }}>Materia</th>
                <th style={{ textAlign: "center" }}>Lunes</th>
                <th style={{ textAlign: "center" }}>Martes</th>
                <th style={{ textAlign: "center" }}>Miércoles</th>
                <th style={{ textAlign: "center" }}>Jueves</th>
                <th style={{ textAlign: "center" }}>Viernes</th>
                <th style={{ textAlign: "center" }}>Sábado</th>
              </tr>
            </thead>
            <tbody>
              {materiasFiltradas.map((materia) => (
                <tr key={materia._id}>
                  <td>{materia.grupo}</td>
                  <td>{materia.salon}</td>
                  <td><button className="icon-button" onClick={() => handleListaAlumnos(materia)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button></td>
                  <td>{materia.cupo}</td>
                  <td>{materia.nombre}</td>
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
        <div className="horario-buttons">
          <button className="button"
            onClick={handleDownloadCSV}
            disabled={materiasFiltradas.length === 0}>
            Descargar Lista de materias
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioDocente2;