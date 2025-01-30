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
import InicioCoordinador from './components/InicioCoordinador';
import './components/InicioCoordinador.css';
import InicioAdministrador from './components/InicioAdministrador';
import './components/InicioAdministrador.css';
import AdministrarMaterias from './components/AdministrarMaterias';
import './components/AdministrarMaterias.css';
import AdministrarPersonal from './components/AdministrarPersonal';
import './components/AdministrarPersonal.css';
import CrearAlumno from './components/CrearAlumno';
import './components/CrearAlumno.css';
import ModificarAlumno from './components/ModificarAlumno';
import CrearPersonal from './components/CrearPersonal';
import CrearPersonal2 from './components/CrearPersonal2';
import './components/CrearPersonal.css';
import AdministrarTutorados from './components/AdministrarTutorados';
import './components/CrearPersonal.css';
import ModificarPersonal from './components/ModificarPersonal';
import './components/ModificarPersonal.css';
import CrearMateria from './components/CrearMateria';
import './components/CrearMateria.css';
import AsignarTutor from './components/AsignarTutor';
import ModificarMateria from './components/ModificarMateria';

function App() {
  const userType = localStorage.getItem("userType") || "alumno"; // Puede ser "alumno" o "personal"

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
              <Route path="/inicio-tutor" element={<PrivateRoute><InicioTutor /></PrivateRoute>} />
              <Route path="/inicio-docente" element={<PrivateRoute><InicioDocente /></PrivateRoute>} />
              <Route path="/inicio-docente-2" element={<PrivateRoute><InicioDocente2 /></PrivateRoute>} />
              <Route path="/revisar-horario" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/docente-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>
              <Route path="/inicio-coordinador" element={<PrivateRoute><InicioCoordinador/></PrivateRoute>}></Route>
              <Route path="/inicio-administrador" element={<InicioAdministrador/>}></Route>
              <Route path="/administrar-materias" element={<AdministrarMaterias/>}></Route>
              <Route path="/administrar-personal" element={<PrivateRoute><AdministrarPersonal/></PrivateRoute>}></Route>
              <Route path="/crear-alumno" element={<PrivateRoute><CrearAlumno/></PrivateRoute>}></Route>
              <Route path="/modificar-alumno" element={<PrivateRoute><ModificarAlumno/></PrivateRoute>}></Route>
              <Route path="/crear-materia" element={<PrivateRoute><CrearMateria/></PrivateRoute>}></Route>
              <Route path="/modificar-materia" element={<PrivateRoute><ModificarMateria/></PrivateRoute>}></Route>
              <Route path="/crear-personal" element={<PrivateRoute><CrearPersonal/></PrivateRoute>}></Route>
              <Route path="/modificar-personal" element={<PrivateRoute><ModificarPersonal/></PrivateRoute>}></Route>
              <Route path="/admin-tutor" element={<PrivateRoute><AdministrarTutorados/></PrivateRoute>}></Route>
              <Route path="/asignar-tutor" element={<PrivateRoute><AsignarTutor/></PrivateRoute>}></Route>
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
