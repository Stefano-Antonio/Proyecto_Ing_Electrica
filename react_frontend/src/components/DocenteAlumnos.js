import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioDocente.css";

function InicioDocente() {

  const navigate = useNavigate();

  const location = useLocation();

  const nombre = location.state?.nombre || "Docente";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  }

  return (
    <div className="docente-layout">
      <div className="docente-container">
        
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        
        <h2>Docente</h2>
        <div className="docente-header">
            <h3>{`${nombre}`}</h3>
            <h3>Grupo: 1A</h3>
            <h3>Materia: Álgebra Lineal</h3>
        </div>
        

        <div className="docente-content">
          <table className="docente-table">
            <thead>
              <tr>
                <th>Matricula</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              <tr>  
                <td>Juan Rodriguez Lopez</td>
                <td>33566</td>
                <td>juan@rodriguez.com</td>
                <td>492 444 5656</td>
              </tr>
              <tr>
                <td>Marisol Gutierrez</td>
                <td>15222</td>
                <td>alguien@example.com</td>
                <td>492 444 5656</td>
              </tr>
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
              
            </tbody>
          </table>
        </div>
        <div className="horario-buttons">
          <button className="button">
            Descargar base de datos de alumnos
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioDocente;
