import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./InicioCoordinador.css";

const InicioCoordinadorGen = () => {
    const navigate = useNavigate();
    const id_carrera = localStorage.getItem("id_carrera");
    const nombre = localStorage.getItem("nombre");
    const matricula = localStorage.getItem("matricula");

    const handleLogout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("id_carrera");
      localStorage.removeItem("matricula");
      navigate("/");
    };

    return (
      <div className="coordinador-container">
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h2>Coordinador</h2>
        <p>A continuación, seleccione la lista que desee visualizar</p>
  
        <div className="buttons">
          <button onClick={() => navigate("/inicio-coordinador/alumnos")}>Administrar alumno</button>
          <button onClick={() => navigate("/inicio-coordinador/personal")}>Administrar personal</button>
          <button onClick={() => navigate("/inicio-coordinador/materias")}>Administrar materias</button>
        </div>
  
        {/* Aquí se mostrará el componente de la ruta anidada */}
        <Outlet />
      </div>
    );
};

export default InicioCoordinadorGen;
