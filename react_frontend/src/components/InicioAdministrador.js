import React, { useState } from "react";
import './InicioAdministrador.css';
import { useNavigate } from "react-router-dom";
import AlumnoList from './AlumnoList';
import AdministrarPersonal from './AdministrarPersonal';
import AdministrarMateriasAdmin from "./AdministrarMateriasAdmin";


const InicioAdministrador = () => {
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
      <div className="container">
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h3>Administrador</h3>
        <p>A continuación, seleccione la lista que desee visualizar</p>
  
        <div className="buttons">
          <button onClick={() => mostrarComponente('alumno')}>Administrar alumno</button>
          <button onClick={() => mostrarComponente('personal')}>Administrar personal</button>
          <button onClick={() => mostrarComponente('materias')}>Administrar materias</button>
        </div>
  
        {/* Renderizado condicional de componentes */}
        {componenteActivo === 'alumno' && <AlumnoList />}
        {componenteActivo === 'personal' && <AdministrarPersonal />}
        {componenteActivo === 'materias' && <AdministrarMateriasAdmin />}
      </div>
    );
  };

export default InicioAdministrador;