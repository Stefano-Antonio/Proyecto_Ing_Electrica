import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./InicioAdministrador.css";

const InicioAdministrador = () => {
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
      <div className="administrador-container">
        <div className="logout-wrapper">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Administrador</h2>
        <p>A continuación, seleccione la lista que desee visualizar</p>
  
        <div className="buttons">
          <button onClick={() => navigate("/administrador/alumnos")}>Administrar alumno</button>
          <button onClick={() => navigate("/administrador/personal")}>Administrar personal</button>
          <button onClick={() => navigate("/administrador/materias")}>Administrar materias</button>
        </div>
  
        {/* Aquí se mostrará el componente de la ruta anidada */}
        <Outlet />
      </div>
    );
};

export default InicioAdministrador;
