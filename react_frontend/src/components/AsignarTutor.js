import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import "./AdministrarTutorados.css";


function AsignarTutor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [personal, setPersonal] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    // Fetch de personal desde el servidor
    fetch("http://localhost:5000/api/personal")
      .then((response) => response.json())
      .then((data) => setPersonal(data))
      .catch((error) => console.error("Error al obtener el personal:", error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/alumnos')
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setAlumnos(response.data);
      })
      .catch(error => console.error('Error al obtener alumnos:', error));
  }, []);

  const nombre = location.state?.nombre || "Docente";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
    }
    
  return (
    <div className="tutorados-layout">
      <div className="tutorados-container">
      <div className="top-left"> 
          <button className="back-button" onClick={handleBack}>Regresar</button> 
        </div>
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button> 
        </div>

        <h2>Administración de tutores</h2>
        <div className="tutorados-field-group">
          <h4>Tutor:</h4>
          <select>
            {personal.map((persona) => (
              <option key={persona._id} value={persona.nombre}>
                {persona.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="tutorados-content">
          <table className="tutorados-table">
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Matrícula</th>
                <th>Nombre del alumno</th>
                <th>Tutor actual</th>
              </tr>
            </thead>
            <tbody>
            {alumnos.map((alumno) => (
                <tr key={alumno._id}>
                <td>
                    <input type="checkbox"></input>
                </td>
                <td>{alumno.matricula}</td>
                <td>{alumno.nombre}</td>
                <td></td>
            </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="horario-buttons">
          <button className="button">
            Subir base de datos de materias
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsignarTutor;
