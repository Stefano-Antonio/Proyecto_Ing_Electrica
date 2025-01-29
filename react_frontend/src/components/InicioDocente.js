import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioDocente.css";

function InicioDocente() {

  const navigate = useNavigate();

  const location = useLocation();

  console.log("Estado recibido:", location.state);

  const nombre = location.state?.nombre || "Docente";

  const handleRevisarHorario = () => {
    navigate(`/revisar-horario`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleChangeView = () => {
    navigate('/inicio-docente-2', { state: { nombre } })
  }

  return (
    <div className="docente-layout">
      <div className="docente-container">

        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>

        <h2>Docente</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <h4>A continuacion, seleccione la lista que desee visualizar</h4>

        <div className="docente-buttons">
            <button className="button">Lista de alumnos</button>
            <button className="button" onClick={handleChangeView}>Lista de materias</button>
        </div>

        <div className="docente-content">
          <div className="docente-scrollable-table">
            <table className="docente-tabla">
              <thead>
                <tr>
                  <th>Nombre del alumno</th>
                  <th>Revisar horario</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>
                    <button className="icon-button" onClick={handleRevisarHorario}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <span className="status-circle validated">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Alejandro Sánchez</td>
                  <td>
                    <button className="icon-button" onClick={handleRevisarHorario}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <span className="status-circle rejected">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Jesus Sánchez</td>
                  <td>
                    <button className="icon-button" onClick={handleRevisarHorario}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <span className="status-circle pending">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>María González</td>
                  <td>
                    <button className="icon-button" onClick={handleRevisarHorario}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <span className="status-circle not-uploaded">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
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