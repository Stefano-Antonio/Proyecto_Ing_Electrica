import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./AdministrarMaterias.css";


const AdministrarMaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [loading, setLoading] = useState(true);
  const id_carrera = localStorage.getItem("id_carrera");
  const navigate = useNavigate();

  useEffect(() => {
    // Realiza la solicitud para obtener las materias desde la base de datos
    const fetchMaterias = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/materias/carrera/${id_carrera}`); //Falta que se muestre el docente en el ID de carrera
        setMaterias(response.data); // Establece los datos de materias en el estado
      } catch (error) {
        console.error('Error al obtener datos de materias:', error);
      }
    };

    // Realiza la solicitud para obtener los docentes desde la base de datos

    const fetchDocentes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/docentes');
        setDocentes(response.data);
      } catch (error) {
        console.error('Error al obtener datos de docentes:', error);
      }
    };


    const fetchData = async () => {
      await fetchMaterias();
      await fetchDocentes();
      setLoading(false); // Indica que los datos han sido cargados
    };

    fetchData();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  
  if (loading) {
    return <div className="loading">Cargando información de materias...</div>;
  }

  const handleNavigate = () => {
    navigate("/crear-materia");
  };

  const handleModify = (materia) => {
    navigate("/modificar-materia", { state: { materia } });
  };

  const getDocenteNombre = (materia) => {
    return materia && materia.docenteNombre ? materia.docenteNombre : "Sin asignar";
  };
  
  
  // Filtrar materias por búsqueda
  const materiasFiltradas = materias.filter(materia => 
    materia.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDocenteNombre(materia).toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="admin-materias">
      <div className="materia-container">
        <h3>Administrar materias</h3>
        <h4>A continuación, se muestran las siguientes opciones:</h4>
        <p className="info">Lista de materias activas:</p>
        
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por  nombre, grupo, salon o doscente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <div className="scrollable-table">
          <table className='materia-table'>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiasFiltradas.map((materia) => (
                <tr key={materia._id}>
                  <td>{materia.grupo}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.nombre}</td>
                  <td>{getDocenteNombre(materia)}</td> {/* Muestra el nombre del docente o "Sin asignar" */}

                  <td>{materia.horarios.lunes || "-"}</td>
                  <td>{materia.horarios.martes || "-"}</td>
                  <td>{materia.horarios.miercoles || "-"}</td>
                  <td>{materia.horarios.jueves || "-"}</td>
                  <td>{materia.horarios.viernes || "-"}</td>
                  <td>
                    <button className="icon-button" onClick={() => handleModify(materia)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button className="icon-button">
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

        <div className="add-delete-buttons">
          <button onClick={handleNavigate}>Agregar nueva materia</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarMaterias;
