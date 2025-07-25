import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AlumnoList.css";

const AlumnoListAdmin = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [tutoresNombres, setTutoresNombres] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalMaterias, setMostrarModalMaterias] = useState(false);
  const id_carrera = localStorage.getItem("id_carrera");
  const [nombre, setNombreAlumno] = ("");
  const [matricula, setMatriculaAlumno] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const [AlumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const matriculaAdmin = localStorage.getItem("matricula");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        // Obtener los alumnos asociados al administrador
        const response = await axios.get(`${API_URL}/api/alumnos/carrera-admin/${matriculaAdmin}`);
        const alumnosData = response.data;

        // Obtener los detalles del tutor para cada alumno
        const tutoresNombresTemp = {};
        await Promise.all(alumnosData.map(async (alumno) => {
          if (alumno.tutor) {
            const tutorResponse = await axios.get(`${API_URL}/api/administradores/alumnos/${alumno.tutor}`);
            tutoresNombresTemp[alumno._id] = tutorResponse.data.nombre; // Extraer el nombre del tutor
          }
        }));

        const fetchEstatus = async (alumno) => {
          try {
            //
            const estatusResponse = await fetch(`${API_URL}/api/tutores/estatus/${alumno.matricula}`);
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
  }, [matriculaAdmin]);


  const handleDownloadCSV = async () => {
      const ids = alumnosFiltrados.map(a => a._id);
      const response = await axios.post(
        `${API_URL}/api/alumnos/exportar-csv/carrera-filtrados/${id_carrera}`,
        { ids },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `alumnos_filtrados.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  const handleNavigate2 = () => {
    navigate("/administrador/admin-tutor", { state: { matriculaAdmin: matriculaAdmin } });
  };

  const handleNavigate3 = (alumno) => {
    navigate(`/administrador/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaAdmin: matriculaAdmin} });
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
    (tutoresNombres[alumno._id] && tutoresNombres[alumno._id].toLowerCase().includes(searchTerm.toLowerCase())) ||
    alumno.estatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadDB = async (e) => {
    setMostrarModal(true);
    return;
  }

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
                <th>Matricula</th>
                <th>Nombre del alumno</th>
                <th>Tutor asignado</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Horario</th>
                <th>Estatus de horario</th>
              </tr>
            </thead>
            <tbody>
            {alumnosFiltrados.map((alumno) => (
                <tr key={alumno._id}>
                  <td>{alumno.matricula}</td>
                  <td>{alumno.nombre}</td>
                  <td>{tutoresNombres[alumno._id] ? tutoresNombres[alumno._id] : "Sin asignar"}</td>
                  <td>{alumno.correo}</td>
                  <td>{alumno.telefono}</td>
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
          <button onClick={handleDownloadDB}>Descargar lista de alumnos</button>
        </div>

        <ul>
          
        </ul>
      </div>
      {mostrarModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Descargar base de datos base de datos</h3>
                  <p>Seleccione el archivo a subir:</p>
                  <ul>
                  </ul>
                  <p>
                  </p>
                  <button onClick={handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              </div>
            )}

            {mostrarModalMaterias && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Descargar base de datos base de datos</h3>
                  <p>Seleccione el archivo a subir:</p>
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
    
  );
};

export default AlumnoListAdmin;