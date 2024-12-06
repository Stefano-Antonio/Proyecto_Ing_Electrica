import React, { useState } from "react";
import './InicioAdministrador.css';
import AlumnoList from './AlumnoList';
import AdministrarPersonal from './AdministrarPersonal';
import AdministrarMaterias from './AdministrarMaterias';



const InicioAdministrador = () => {
    // Estado para controlar qué componente se debe mostrar
    const [componenteActivo, setComponenteActivo] = useState('');
  
    // Función para cambiar el componente activo
    const mostrarComponente = (componente) => {
      setComponenteActivo(componente);
    };
  
    return (
      <div className="container">
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
        {componenteActivo === 'materias' && <AdministrarMaterias />}
      </div>
    );
  };

export default InicioAdministrador;