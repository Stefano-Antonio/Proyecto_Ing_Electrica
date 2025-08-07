import React, {useState} from "react";
import "./InicioCoordinadorGen.css";
import { Outlet, useNavigate,useLocation } from "react-router-dom";
import AlumnoListCG from './AlumnoListCG';
import AdministrarPersonalCG from './AdministrarPersonalCG';
import AdministrarMateriasCG from './AdministrarMateriasCG';

function InicioCoordinadorGen() {

    const [componenteActivo, setComponenteActivo] = useState('');
  
    // Función para cambiar el componente activo
    const mostrarComponente = (componente) => {
      setComponenteActivo(componente);
    };

  const navigate = useNavigate();

  const location = useLocation();


  const nombre = location.state?.nombre || "Coordinador";


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };


  return (
    <div className="docente-layout">
      {location.pathname !== '/coord-gen' && (
        <div className="top-hide" style={{ display: 'flex', justifyContent: 'flex-start', margin: '10px 0 0 0' }}>
          <button className="back-button hide-button-fixed" onClick={() => navigate('/coord-gen')}>Ocultar</button>
        </div>
      )}
      <div className="docente-container">

        <div className="logout-wrapper">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <h2>Coordinador General</h2>
        <h4>{`Bienvenido, ${nombre}`}</h4>
        <h4>A continuacion, seleccione la lista que desee visualizar</h4>

        <div className="buttons">
          <button onClick={() => navigate("/coord-gen/alumnos")}>Administrar alumno</button>
          <button onClick={() => navigate("/coord-gen/personal")}>Administrar personal</button>
          <button onClick={() => navigate("/coord-gen/materias")}>Administrar materias</button>
          <button onClick={() => navigate("/coord-gen/historial-academico")}>Historial académico</button>
        </div>
  
        {/* Aquí se mostrará el componente de la ruta anidada */}
        <Outlet />
      </div>
    </div>
  );
}

export default InicioCoordinadorGen;