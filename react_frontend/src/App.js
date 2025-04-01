import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import AdministrarMaterias from './components/AdministrarMaterias';
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
import AdministrarTutoradosAdmin from "./components/AdministrarTutoradosAdmin";


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
              
              <Route path="/" element={<PrivateRoute><Registro /></PrivateRoute>} />
              <Route path="/login" element={<RedirectRoute userType={userType}><Registro /></RedirectRoute>} />
              <Route path="/horario-seleccion" element={<PrivateRoute><HorarioSeleccion /></PrivateRoute>} />
              <Route path="/validacion" element={<PrivateRoute><Validacion1 /></PrivateRoute>} />
              <Route path="/validacion-estatus" element={<PrivateRoute><Validacion2 /></PrivateRoute>} />
              <Route path="/inicio-tutor" element={<PrivateRoute><InicioTutor /></PrivateRoute>} />
              <Route path="/docente/alumnos" element={<PrivateRoute><InicioDocente /></PrivateRoute>} />
              <Route path="/docente/materias" element={<PrivateRoute><InicioDocente2 /></PrivateRoute>} />
              <Route path="/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/coordinador/revisar-horario/:matricula" element={<PrivateRoute><RevisionHorarioTutor /></PrivateRoute>} />
              <Route path="/docente/materias/:materia/lista-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>
              <Route path="/coordinador" element={<PrivateRoute><InicioCoordinador/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListCoord/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalCoordinador/>}></Route>;
                  <Route path="materias" element={<AdministrarMaterias/>}></Route>;
                  </Route>
              <Route path="/administrador" element={<InicioAdministrador/>}></Route>
              <Route path="/coordinador/materias/:materia/lista-alumnos" element={<PrivateRoute><DocenteAlumnos/></PrivateRoute>}></Route>
              <Route path="/administrar-materias" element={<AdministrarMaterias/>}></Route>
              <Route path="/coordinador/crear-materia" element={<CrearMateria />} />
              <Route path="/crear-materia-cg" element={<CrearMateriaCG />} />
              <Route path="/coordinador/crear-alumno" element={<PrivateRoute><CrearAlumno/></PrivateRoute>}></Route>
              <Route path="/crear-alumno-cg" element={<PrivateRoute><CrearAlumnoCG/></PrivateRoute>}></Route>
              <Route path="/coordinador/modificar-alumno" element={<PrivateRoute><ModificarAlumno/></PrivateRoute>}></Route>
              <Route path="/modificar-alumno-cg" element={<PrivateRoute><ModificarAlumnoCG/></PrivateRoute>}></Route>
              <Route path="/coordinador/modificar-materia" element={<PrivateRoute><ModificarMateria/></PrivateRoute>}></Route>
              <Route path="/coordinador/crear-personal" element={<PrivateRoute><CrearPersonal/></PrivateRoute>}></Route>
              <Route path="/crear-personal-cg" element={<PrivateRoute><CrearPersonalCG/></PrivateRoute>}></Route>
              <Route path="/coordinador/modificar-personal" element={<PrivateRoute><ModificarPersonal/></PrivateRoute>}></Route>
              <Route path="/admin-tutor" element={<PrivateRoute><AdministrarTutorados/></PrivateRoute>}></Route>
              <Route path="/lista-tutorados-admin" element={<PrivateRoute><AdministrarTutoradosAdmin/></PrivateRoute>}></Route>
              <Route path="/administrar-materias-cg" element={<PrivateRoute><AdministrarMateriasCG/></PrivateRoute>}></Route>
              <Route path="/coordinador-tutor" element={<PrivateRoute><CoordinadorTutor/></PrivateRoute>}></Route>
              <Route path="/coordinador/administrar-tutorados" element={<PrivateRoute><AdministrarTutorados /></PrivateRoute>} />
              <Route path="/asignar-tutor" element={<PrivateRoute><AsignarTutor/></PrivateRoute>}></Route>
              <Route path="/inicio-coordinador-gen" element={<PrivateRoute><InicioCoordinadorGeneral/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListCG/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalCG/>}></Route>;
                  <Route path="materias" element={<AdministrarMateriasCG/>}></Route>;
                  </Route>
                <Route path="/inicio-administrador" element={<PrivateRoute><InicioAdministrador/></PrivateRoute>}>
                  <Route path="alumnos" element={<AlumnoListAdmin/>}></Route>
                  <Route path="personal" element={<AdministrarPersonalAdmin/>}></Route>;
                  <Route path="materias" element={<AdministrarMateriasAdmin/>}></Route>;
                </Route>
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
