import React, {useState} from "react";
import "./InicioCoordinadorGen.css";
import { Outlet, useNavigate,useLocation } from "react-router-dom";

function InicioAdministradorGen() {

  const navigate = useNavigate();

  const location = useLocation();

  console.log("Estado recibido:", location.state);

  const nombre = location.state?.nombre || "Administrador";


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };


  return (
    <div className="docente-layout">
      <div className="docente-container">

        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>

        <h2>Administrador General</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <h4>A continuacion, seleccione la lista que desee visualizar</h4>

        <div className="buttons">
          <button onClick={() => navigate("/inicio-administrador-gen/alumnos")}>Administrar alumno</button>
          <button onClick={() => navigate("/inicio-administrador-gen/personal")}>Administrar personal</button>
          <button onClick={() => navigate("/inicio-administrador-gen/materias")}>Administrar materias</button>
        </div>
  
        {/* Aquí se mostrará el componente de la ruta anidada */}
        <Outlet />
      </div>
    </div>
  );
}

export default InicioAdministradorGen;