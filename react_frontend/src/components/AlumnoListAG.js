import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import apiClient from '../utils/axiosConfig'; // Importar la configuración de axios
import 'react-toastify/dist/ReactToastify.css';
import "./AlumnoList.css";

const AlumnoListAG = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [tutoresNombres, setTutoresNombres] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombreAlumno] = ("");
  const [matricula, setMatriculaAlumno] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [AlumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const matriculaCord = localStorage.getItem("matricula");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; // Asegúrate de tener configurada la URL base en tu .env

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        // Obtener los alumnos asociados al coordinador
        const response = await apiClient.get(`${API_URL}/api/alumnos`);
        const alumnosData = response.data;

        // Obtener los detalles del tutor para cada alumno
        const tutoresNombresTemp = {};
        await Promise.all(alumnosData.map(async (alumno) => {
          if (alumno.tutor) {
            const tutorResponse = await apiClient.get(`${API_URL}/api/coordinadores/alumnos/${alumno.tutor}`);
            tutoresNombresTemp[alumno._id] = tutorResponse.data.nombre; // Extraer el nombre del tutor
          }
        }));

        const fetchEstatus = async (alumno) => {
          try {
            //
            const estatusResponse = await fetch(`${API_URL}/api/tutores/estatus/${alumno.matricula}`,
              {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            if (!estatusResponse.ok) {
              throw new Error("Error al obtener el estatus del horario");
            }
            const estatusData = await estatusResponse.json();
            return { ...alumno, estatus: estatusData.estatus };
          } catch (error) {
            console.error("Error al obtener el estatus del horario para", alumno.matricula, error);
            return { ...alumno, estatus: "Desconocido" };
          }
        };

        const alumnosConEstatus = await Promise.all(alumnosData.map(fetchEstatus));

        setAlumnos(alumnosConEstatus);
        setTutoresNombres(tutoresNombresTemp);
      } catch (error) {
        console.error('Error al obtener alumnos:', error);
      }
    };

    const fetchData = async () => {
      await fetchAlumnos();
      setLoading(false); // Indica que los datos han sido cargados
    };

    fetchData();
    fetchAlumnos();
  }, [matriculaCord]);


  const handleNavigate3 = (alumno) => {
    navigate(`/administrador/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaCord: matriculaCord} });
  };


    const handleDownloadCSV = async () => {
      const matriculas = alumnosFiltrados.map(a => a.matricula);
      if (matriculas.length === 0) {
        toast.error("No hay alumnos filtrados para exportar.");
        return;
      }

      try {
        const response = await apiClient.post(
          `${API_URL}/api/alumnos/exportar-csv/filtrados`,
          { matriculas },
          { responseType: "blob" }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `alumnos_filtrados.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("❌ Error al descargar CSV:", error);
        toast.error("Error al descargar la lista filtrada.");
      }
    };
  


  const getEstatusIcon = (estatus) => {
    switch (estatus) {
      case "Sin revisar":
        return <span className="status-icon yellow"></span>; 
      case "En espera":
        return <span className="status-icon gray"></span>; 
      case "Revisado":
        return <span className="status-icon green"></span>; 
      default:
        return <span className="status-icon yellow"></span>; 
    }
  };

  
  if (loading) {
    return <div className="loading">Cargando información de alumnos...</div>;
  }
  
  // Filtrar alumnos por búsqueda
  const alumnosFiltrados = alumnos.filter(alumno => 
    alumno.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.id_carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tutoresNombres[alumno._id] && tutoresNombres[alumno._id].toLowerCase().includes(searchTerm.toLowerCase())) ||
    alumno.estatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="alumno-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="alumno-container">
      <h3>Administrar alumnos</h3>
      <p>Lista de alumnos asociados al programa académico</p>
      
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por matrícula, nombre, tutor o estatus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

      {alumnosFiltrados.length > 0 ? (
      <div className="alumno-scrollable-table">
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>Programa</th>
              <th>Matricula</th>
              <th>Nombre del alumno</th>
              <th>Tutor asignado</th>
              <th>Horario</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
          {alumnosFiltrados.map((alumno) => (
              <tr key={alumno._id}>
                <td>{alumno.id_carrera}</td>
                <td>{alumno.matricula}</td>
                <td>{alumno.nombre}</td>
                <td>{tutoresNombres[alumno._id] ? tutoresNombres[alumno._id] : "Sin asignar"}</td>
                <td className="actions">
                  <button
                    className="icon-button"
                    onClick={() => handleNavigate3(alumno)}
                    disabled={alumno.estatus === "En espera"} // Deshabilitar el botón si el estatus es "En espera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>{getEstatusIcon(alumno.estatus)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : (
        <p className="no-alumnos-message">No se encontraron resultados.</p>
      )}
      <div className="add-delete-buttons">
        <button onClick={handleDownloadCSV}>Descargar CSV alumnos</button>
      </div>

      <ul>
        
      </ul>
    </div>
    </div>
    
  );
};

export default AlumnoListAG;