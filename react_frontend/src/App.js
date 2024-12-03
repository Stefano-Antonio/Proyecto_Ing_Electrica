import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Encabezado from './components/Encabezado';
import './components/Encabezado.css';
import HorarioSeleccion from './components/HorarioSeleccion';
import './components/HorarioSeleccion.css';
import Registro from './components/Registro';
import './components/Registro.css';
import Pie_pagina from './components/Pie_pagina';
import './components/Pie_pagina.css';
import Validacion1 from './components/Validacion1';
import './components/Validacion1.css';
import Validacion2 from './components/Validacion2';
import './components/Validacion2.css';
import InicioTutor from './components/InicioTutor';
import './components/InicioTutor.css';
import RevisionHorarioTutor from './components/RevisionHorarioTutor';
import "./components/RevisionHorarioTutor.css";
import PrivateRoute from './components/PrivateRoute';
import RedirectRoute from './components/RedirectRoute';
import InicioDocente from './components/InicioDocente';
import './components/InicioDocente.css';
import InicioDocente2 from './components/InicioDocente2';
import './components/InicioDocente2.css';
import DocenteAlumnos from './components/DocenteAlumnos';
import './components/DocenteAlumnos.css';



function App() {
  // Simula el tipo de usuario para esta lógica (esto puede venir del back-end o de localStorage)
  const userType = localStorage.getItem("userType") || "alumno"; // Puede ser "alumno" o "usuario"
  return (
    <Router>
      <div className="App">
        <Encabezado />
        <div className="Main-layout">
          <div className="Lat_iazquierda"></div> {/* Barra lateral izquierda */}
          <div className="Contenido">
            <Routes>
              <Route path="/" element={<RedirectRoute userType={userType}><Registro /></RedirectRoute>} />
              <Route path="/login" element={<RedirectRoute userType={userType}><Registro /></RedirectRoute>} />
              <Route path="/horario-seleccion" element={<PrivateRoute><HorarioSeleccion /></PrivateRoute>} />
              <Route path="/validacion" element={<PrivateRoute><Validacion1 /></PrivateRoute>} />
              <Route path="/validacion-estatus" element={<PrivateRoute><Validacion2 /></PrivateRoute>} />
              <Route path="/inicio-tutor" element={<InicioTutor />} />
              
              <Route path="/inicio-docente" element={<InicioDocente />} />
              <Route path="/inicio-docente-2" element={<InicioDocente2 />} />
              <Route path="/revisar-horario" element={<RevisionHorarioTutor />} />
              <Route path="/docente-alumnos" element={<DocenteAlumnos/>}></Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <div className="Lat_derecha"></div> {/* Barra lateral derecha */}
        </div>
        <Pie_pagina />
      </div>
    </Router>
  );
}

export default App;
