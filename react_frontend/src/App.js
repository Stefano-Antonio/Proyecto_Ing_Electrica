import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation  } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import AlumnoListCG from './components/AlumnoListCG';
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
import AdministrarMaterias from './components/AdministrarMateriasCoordinador';
import AdministrarMateriasCG from './components/AdministrarMateriasCG';
import './components/AdministrarMaterias.css';
import AdministrarPersonalAdmin from './components/AdministrarPersonalAdmin';
import './components/AdministrarPersonal.css';
import AdministrarMateriasAdmin from './components/AdministrarMateriasAdmin';
import CrearAlumno from './components/CrearAlumno';
import CrearAlumnoCG from './components/CrearAlumnoCG';
import './components/CrearAlumno.css';
import ModificarAlumno from './components/ModificarAlumno';
import ModificarAlumnoCG from './components/ModificarAlumnoCG';
import CrearPersonal from './components/CrearPersonal';
import CrearPersonalCG from './components/CrearPersonalCG';
import './components/CrearPersonal.css';
import AdministrarTutorados from './components/AdministrarTutorados';
import './components/CrearPersonal.css';
import ModificarPersonal from './components/ModificarPersonal';
import './components/ModificarPersonal.css';
import CrearMateria from './components/CrearMateria';
import CrearMateriaCG from './components/CrearMateriaCG';
import CreateMateria from './components/CreateMateria';
import './components/CrearMateria.css';
import AsignarTutor from './components/AsignarTutor';
import './components/ModificarMateria.css';
import CoordinadorTutor from './components/CoordinadorTutor';
import ModificarMateria from './components/ModificarMateria';
import './components/ModificarMateria.css';
import AlumnoListCoord from "./components/AlumnoListCoord";
import './components/AlumnoList.css';
import AdministrarPersonalCoordinador from "./components/AdministrarPersonalCoordinador";
import AdministrarPersonalCG from "./components/AdministrarPersonalCG";
import './components/InicioCoordinadorGen.css';
import InicioCoordinadorGeneral from "./components/InicioCoordinadorGeneral";
import AlumnoListAdmin from "./components/AlumnoListAdmin";
import AdministrarTutoradosCG from "./components/AdministrarTutoradosCG";
import InicioAdministradorGeneral from "./components/InicioAdministradorGeneral";
import AlumnoListAG from './components/AlumnoListAG';
import AdministrarPersonalAG from './components/AdministrarPersonalAG';
import AdministrarMateriasAG from './components/AdministrarMateriasAG';
import ModificarPersonalCG from './components/ModificarPersonalCG';
import ModificarMateriaCG from './components/ModificarMateriaCG';
import RevisionHorarioAdmin from './components/RevisionHorarioAdmin';
import './components/ModificarPersonal.css';
import RevisionComprobantePago from './components/RevisionComprobantePago';
import HistorialAcademico from './components/HistorialAcademico';

 function AppWrapper() {
  return (
      <App />
  );
}

function App() {
  const location = useLocation();
  const userType = localStorage.getItem("userType") || "alumno";
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 1300);
  const esRegistro = location.pathname === '/' || location.pathname === '/login';

useEffect(() => {
  const manejarResize = () => {
    setEsMovil(window.innerWidth <= 768);
  };
  window.addEventListener('resize', manejarResize);
  return () => window.removeEventListener('resize', manejarResize);
}, []);

  // Detectar si está en una ruta de coordinador general
  const esCoordGen = location.pathname.startsWith('/coord-gen');

  return (
      <div className="App">
        <div className="Header-wrapper"> {/* Wrapper para espacio debajo del encabezado */}
          <Encabezado />
        </div>
        <div className="Main-layout">
          <div className={`Lat_iazquierda${esCoordGen ? ' lat-barra-reducida' : ''}`}></div> {/* Barra lateral izquierda */}
          <div className="Contenido">
            <Routes>
              <Route path="/" element={<PrivateRoute><Registro /></PrivateRoute>} />
              <Route path="/login" element={<RedirectRoute userType={userType}><Registro /></RedirectRoute>} />
              {/* RUTAS DE ALUMNO */}
              <Route path="/horario-seleccion" element={<PrivateRoute><HorarioSeleccion /></PrivateRoute>} />
              <Route path="/validacion" element={<PrivateRoute><Validacion1 /></PrivateRoute>} />
              <Route path="/validacion-estatus" element={<PrivateRoute><Validacion2 /></PrivateRoute>} />
              {/* RUTAS DE TUTOR */}
              <Route path="/tutor" element={<PrivateRoute><InicioTutor /></PrivateRoute>} />
              <Route path="/tutor/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/tutor/validar-pago/:matricula" element={<PrivateRoute><RevisionComprobantePago /></PrivateRoute>} />
              {/* RUTAS DE DOCENTE */}
              <Route path="/docente/alumnos" element={<PrivateRoute><InicioDocente /></PrivateRoute>} />
              <Route path="/docente/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/docente/alumnos/validar-pago/:matricula" element={<PrivateRoute><RevisionComprobantePago /></PrivateRoute>} />
              <Route path="/docente/materias" element={<PrivateRoute><InicioDocente2 /></PrivateRoute>} />
              <Route path="/docente/materias/:materia/lista-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>
              {/* RUTAS DE COORDINADOR */}
              <Route path="/coordinador" element={<PrivateRoute><InicioCoordinador/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListCoord/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalCoordinador/>}></Route>;
                  <Route path="materias" element={<AdministrarMaterias/>}></Route>;
              </Route>
              {/* Rutas de coordinador para alumnos */}
              <Route path="/coordinador/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/coordinador/validar-pago/:matricula" element={<PrivateRoute><RevisionComprobantePago /></PrivateRoute>} />
              <Route path="/coordinador/admin-tutor" element={<PrivateRoute><AdministrarTutorados/></PrivateRoute>}></Route>
              <Route path="/coordinador/crear-alumno" element={<PrivateRoute><CrearAlumno/></PrivateRoute>}></Route>
              <Route path="/coordinador/modificar-alumno" element={<PrivateRoute><ModificarAlumno/></PrivateRoute>}></Route>
              {/* Rutas de coordinador para personal */}
              <Route path="/coordinador/crear-personal" element={<PrivateRoute><CrearPersonal/></PrivateRoute>}></Route>
              <Route path="/coordinador/modificar-personal" element={<PrivateRoute><ModificarPersonal/></PrivateRoute>}></Route>
              {/* Rutas de coordinador para materias */}
              <Route path="/coordinador/crear-materia" element={<CrearMateria />} />
              <Route path="/coordinador/modificar-materia" element={<PrivateRoute><ModificarMateria/></PrivateRoute>}></Route>
              <Route path="/coordinador/materias/:materia/lista-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>

              {/* RUTAS DE ADMINISTRADOR */}
              <Route path="/administrador" element={<PrivateRoute><InicioAdministrador/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListAdmin/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalAdmin/>}></Route>;
                  <Route path="materias" element={<AdministrarMateriasAdmin/>}></Route>;
                </Route>
              {/* Rutas de administrador para alumnos */}
              <Route path="/administrador/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioAdmin /></PrivateRoute>} />
              
              {/* RUTAS DE COORDINADOR GENERAL */}
              <Route path="/coord-gen" element={<PrivateRoute><InicioCoordinadorGeneral/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListCG/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalCG/>}></Route>;
                  <Route path="materias" element={<AdministrarMateriasCG/>}></Route>;
                  <Route path="historial-academico" element={<PrivateRoute><HistorialAcademico /></PrivateRoute>} />
                </Route>
              
              {/* Rutas del Coordinador general para alumnos*/}
              <Route path="/coord-gen/alumnos/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/coord-gen/alumnos/crear-alumno" element={<PrivateRoute><CrearAlumnoCG/></PrivateRoute>}></Route>
              <Route path="/coord-gen/alumnos/modificar-alumno" element={<PrivateRoute><ModificarAlumnoCG/></PrivateRoute>}></Route>
              <Route path="/coord-gen/alumnos/validar-pago/:matricula" element={<PrivateRoute><RevisionComprobantePago /></PrivateRoute>} />
              <Route path="/coord-gen/alumnos/admin-tutor" element={<PrivateRoute><AdministrarTutoradosCG/></PrivateRoute>}></Route>              
              {/* Rutas del Coordinador general para personal*/}
              <Route path="/coord-gen/personal/crear-personal" element={<PrivateRoute><CrearPersonalCG/></PrivateRoute>}></Route>
              <Route path="/coord-gen/personal/modificar-personal" element={<PrivateRoute><ModificarPersonalCG/></PrivateRoute>}></Route>
              {/* Rutas del Coordinador general para materias*/}
              <Route path="/coord-gen/materias/crear-materia" element={<PrivateRoute><CrearMateriaCG /></PrivateRoute>} />
              <Route path="/coord-gen/materias/modificar-materia" element={<PrivateRoute><ModificarMateriaCG/></PrivateRoute>}></Route>
              <Route path="/coord-gen/materias/:materia/lista-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>
              
              {/* RUTAS DE ADMINISTRADOR GENERAL */}
              <Route path="/admin-gen" element={<PrivateRoute><InicioAdministradorGeneral/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListAG/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalAG/>}></Route>;
                  <Route path="materias" element={<AdministrarMateriasAG/>}></Route>;
              </Route>
              <Route path="/admin-gen/alumnos/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioAdmin /></PrivateRoute>} />
              
              <Route path="/coordinador-tutor" element={<PrivateRoute><CoordinadorTutor/></PrivateRoute>}></Route>
              <Route path="/coordinador/administrar-tutorados" element={<PrivateRoute><AdministrarTutorados /></PrivateRoute>} />
              <Route path="/asignar-tutor" element={<PrivateRoute><AsignarTutor/></PrivateRoute>}></Route>
              
                
                
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <div className={`Lat_derecha${esCoordGen ? ' lat-barra-reducida' : ''}`}></div> {/* Barra lateral derecha */}
        </div>
      {(esRegistro) && <Pie_pagina />}
      </div>
  );
}

export default AppWrapper;