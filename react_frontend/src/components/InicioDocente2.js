import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioDocente.css";

function InicioDocente() {

  const navigate = useNavigate();

  const location = useLocation();

  const nombre = location.state?.nombre || "Docente";

  const handleListaAlumnos = () => {
    navigate(`/docente-alumnos`, {state: {nombre}});
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  }

  const handleChangeView = () => {
    navigate('/inicio-docente', {state: {nombre}});
  }

  return (
    <div className="docente-layout">
      <div className="docente-container">
        
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>

        <h2>Docente</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <p>A continuacion, seleccione la lista que desee visualizar</p>

        <div className="docente-buttons">
            <button className="button" onClick={handleChangeView}>Lista de alumnos</button>
            <button className="button">Lista de materias</button>
        </div>

        <div className="docente-content">
          <table className="docente-table">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Salón</th>
                <th>Alumnos</th>
                <th>Materia</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sábado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1A</td>
                <td>B1</td>
                <td>
                  <button className="icon-button" onClick={handleListaAlumnos}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>Algebra Lineal</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>1A</td>
                <td>B1</td>
                <td>
                  <button className="icon-button" onClick={handleListaAlumnos}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>Algebra Superior</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>1A</td>
                <td>B1</td>
                <td>
                  <button className="icon-button" onClick={handleListaAlumnos}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>Estadística</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                
              </tr>
              <tr>
                <td>2A</td>
                <td>B2</td>
                <td>
                  <button className="icon-button" onClick={handleListaAlumnos}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </td>
                <td>Estadística aplicada</td>
                <td>-</td>
                <td>-</td>
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
            Subir base de datos de materias
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioDocente;
