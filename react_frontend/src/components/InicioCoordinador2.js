import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioCoordinador2.css";
import AlumnoList from './AlumnoList';
import AdministrarPersonal from './AdministrarPersonal';
import AdministrarMaterias from './AdministrarMaterias';

function InicioCoordinador2() {

    const [componenteActivo, setComponenteActivo] = useState('');
  
    // Función para cambiar el componente activo
    const mostrarComponente = (componente) => {
      setComponenteActivo(componente);
    };

  const navigate = useNavigate();

  const location = useLocation();

  console.log("Estado recibido:", location.state);

  const nombre = location.state?.nombre || "Coordinador";


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

        <h2>Coordinador</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <h4>A continuacion, seleccione la lista que desee visualizar</h4>

        <div className="docente-buttons">
            <button className="button" onClick={() => mostrarComponente('alumno')}>Administrar alumnos</button>
            <button className="button" onClick={() => mostrarComponente('personal')}>Administrar personal</button>
            <button className="button" onClick={() => mostrarComponente('materias')}>Administrar materias</button>
        </div>

        {/* Renderizado condicional de componentes */}
        {componenteActivo === 'alumno' && <AlumnoList />}
        {componenteActivo === 'personal' && <AdministrarPersonal />}
        {componenteActivo === 'materias' && <AdministrarMaterias />}
      </div>
    </div>
  );
}

export default InicioCoordinador2;