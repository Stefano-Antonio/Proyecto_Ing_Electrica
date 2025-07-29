import React from "react";
import {useEffect} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./InicioCoordinador.css";

const InicioCoordinador = () => {
    const navigate = useNavigate();
    const id_carrera = localStorage.getItem("id_carrera");
    const nombre = localStorage.getItem("nombre");
    const matricula = localStorage.getItem("matricula");

    useEffect(() => {
      // Limpiar la cache de alumnos del coordinador anterior
      sessionStorage.removeItem("vistaAlumnoCoord");
    }, []);

    const handleLogout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      localStorage.removeItem("id_carrera");
      localStorage.removeItem("matricula");
      navigate("/");
    };

    return (
      <div className="coordinador-container">
        <div className="logout-wrapper">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Coordinador</h2>
        <p>A continuación, seleccione la lista que desee visualizar</p>
  
        <div className="buttons">
          <button onClick={() => navigate("/coordinador/alumnos")}>Administrar alumno</button>
          <button onClick={() => navigate("/coordinador/personal")}>Administrar personal</button>
          <button onClick={() => navigate("/coordinador/materias")}>Administrar materias</button>
        </div>
  
        {/* Aquí se mostrará el componente de la ruta anidada */}
        <Outlet />
      </div>
    );
};

export default InicioCoordinador;
