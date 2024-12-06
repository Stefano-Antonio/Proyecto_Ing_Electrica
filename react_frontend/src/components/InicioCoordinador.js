import React, { useState } from "react";
import './InicioCoordinador.css';
import AlumnoListCoord from './AlumnoListCoord';
import { useNavigate, useLocation } from "react-router-dom";
import AdministrarPersonalCoordinador from './AdministrarPersonalCoordinador';
import AdministrarMaterias from './AdministrarMaterias';


const InicioCoordinador = () => {
    const navigate = useNavigate();
    // Estado para controlar qué componente se debe mostrar
    const [componenteActivo, setComponenteActivo] = useState('');
  
    // Función para cambiar el componente activo
    const mostrarComponente = (componente) => {
      setComponenteActivo(componente);
    };

    const handleLogout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      navigate("/");
    }
  
    return (

      <div className="coordinador-container">
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h2>Coordinador</h2>
        <p>A continuación, seleccione la lista que desee visualizar</p>
  
        <div className="buttons">
          <button onClick={() => mostrarComponente('alumno')}>Administrar alumno</button>
          <button onClick={() => mostrarComponente('personal')}>Administrar personal</button>
          <button onClick={() => mostrarComponente('materias')}>Administrar materias</button>
        </div>
  
        {/* Renderizado condicional de componentes */}
        {componenteActivo === 'alumno' && <AlumnoListCoord />}
        {componenteActivo === 'personal' && <AdministrarPersonalCoordinador />}
        {componenteActivo === 'materias' && <AdministrarMaterias />}
      </div>
    );
  };

export default InicioCoordinador;