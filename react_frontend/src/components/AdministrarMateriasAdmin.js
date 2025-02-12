import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./AdministrarMaterias.css";


const AdministrarMateriasAdmin = () => {
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    

  useEffect(() => {
    // Realiza la solicitud para obtener las materias desde la base de datos
    const fetchMaterias = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/materias');
        setMaterias(response.data); // Establece los datos de materias en el estado
      } catch (error) {
        console.error('Error al obtener datos de materias:', error);
      }
    };

    // Realiza la solicitud para obtener los docentes desde la base de datos
    const fetchDocentes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/personal');
        const docentesData = response.data.filter(personal => personal.roles.includes('D'));
        setDocentes(docentesData); // Establece los datos de docentes en el estado
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
    return <div>Loading...</div>; // Mostrar mensaje de carga
  }

  const handleNavigate = () => {
    navigate("/crear-materia");
  };

  // Mapea la matrícula del docente al nombre del docente
  const getDocenteNombre = (matricula) => {
    const docente = docentes.find(docente => docente.matricula === matricula);
    return docente ? docente.nombre : "Sin asignar";
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/materias/exportar-csv", // Cambiar la URL a 'materias'
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "materias.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo CSV:", error);
      alert("No se pudo descargar el archivo");
    }
  };

  return (
    <div className="admin-materias">
      <div className="materia-container">
        <h3>Administrar materias</h3>
        <h4>A continuación, se muestran las siguientes opciones:</h4>
        <p className="info">Lista de materias activas:</p>
        
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
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia._id}>
                  <td>{materia.grupo}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.nombre}</td>
                  <td>{getDocenteNombre(materia.docente)}</td> {/* Muestra el nombre del docente */}

                  <td>{materia.horarios.lunes || "-"}</td>
                  <td>{materia.horarios.martes || "-"}</td>
                  <td>{materia.horarios.miercoles || "-"}</td>
                  <td>{materia.horarios.jueves || "-"}</td>
                  <td>{materia.horarios.viernes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="add-delete-buttons">
          <button onClick={handleDownloadCSV}>Descargar CSV</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarMateriasAdmin;
