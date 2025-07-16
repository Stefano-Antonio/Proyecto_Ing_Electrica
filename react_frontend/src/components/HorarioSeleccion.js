import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HorarioSeleccion.css";
import axios from "axios";
import { toast } from "react-toastify"; // Asegúrate de tener instalada y configurada la librería react-toastify

function HorarioSeleccion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [materias, setMaterias] = useState([]); // Estado para almacenar las materias
  const [grupos, setGrupos] = useState([]); // Estado para almacenar los grupos
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(""); // Estado para almacenar el grupo seleccionado
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]); // Materias seleccionadas
  const [conflictos, setConflictos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalHoras, setMostrarModalHoras] = useState(false); // Nuevo estado para el modal de horas excedidas
  const [nombre, setNombreAlumno] = useState(localStorage.getItem("nombreAlumno") || "Alumno desconocido");
  const [id, setIDAlumno] = useState(localStorage.getItem("IDAlumno") || "ID desconocido");
  const [matricula, setMatricula] = useState(localStorage.getItem("matricula")); // Obtener matrícula del localStorage
  const [id_carrera, setIDCarrera] = useState(localStorage.getItem("id_carrera") || "ID de carrera desconocido");
  const carrerasPermitidasSemiescolarizadas = ['ISftwS', 'IDsrS', 'IEIndS', 'ICmpS', 'IRMcaS', 'IElecS'];
  const [horasMaximas, setHorasMaximas] = useState("");

// 1. Obtener y sincronizar id_carrera desde localStorage o location.state
useEffect(() => {
  const carrera = location.state?.id_carrera || localStorage.getItem("id_carrera");
  if (carrera) {
    setIDCarrera(carrera);
    localStorage.setItem("id_carrera", carrera);
  }
}, [location.state]);

// 2. Obtener materias cuando id_carrera esté listo
useEffect(() => {
  const fetchMaterias = async () => {
    if (!id_carrera) {
      console.error("ID de carrera no disponible para fetchMaterias");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/materias/carrera/${id_carrera}`);
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.grupo.localeCompare(b.grupo));
      setMaterias(sortedData);
      setGrupos([...new Set(data.map((materia) => materia.grupo))]);
    } catch (error) {
      console.error("Error al obtener materias:", error);
    }
  };

  fetchMaterias();
}, [id_carrera]); // ✅ se dispara cuando id_carrera está definido

// 3. Cargar materias seleccionadas desde localStorage cuando se tengan las materias
useEffect(() => {
  const stored = localStorage.getItem("materiasSeleccionadas");
  if (stored && materias.length > 0) {
    const seleccionadasGuardadas = JSON.parse(stored);

    const coinciden = materias.filter(m =>
      seleccionadasGuardadas.some(s =>
        s.nombre === m.nombre && s.grupo === m.grupo
      )
    );

    setMateriasSeleccionadas(coinciden);
  }
}, [materias]);

// 4. Guardar materias seleccionadas en localStorage cuando cambien
useEffect(() => {
  localStorage.setItem("materiasSeleccionadas", JSON.stringify(materiasSeleccionadas));
}, [materiasSeleccionadas]);

// 5. Guardar nombre también en localStorage (si aplica)
useEffect(() => {
  const nombre = location.state?.nombre || localStorage.getItem("nombreAlumno");
  if (nombre) {
    setNombreAlumno(nombre);
    localStorage.setItem("nombreAlumno", nombre);
  }
}, [location.state]);

// 6. Al cargar, evitar retroceso y cargar horas máximas
useEffect(() => {
  const bloquearAtras = () => {
    window.history.pushState(null, null, window.location.href);
  };

  bloquearAtras();
  window.addEventListener("popstate", bloquearAtras);

  fetchHorasCoordinador(); // No olvides que esto depende de id_carrera también

  return () => {
    window.removeEventListener("popstate", bloquearAtras);
  };
}, []);

  const handleDesactivarTodas = () => {
    setMateriasSeleccionadas([]); // Vaciar las seleccionadas
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("materiasSeleccionadas");
    navigate("/");
  }

  const handleCheckboxChange = (materia, checked) => {
    if (checked) {
      setMateriasSeleccionadas((prev) => [...prev, materia]);
    } else {
      setMateriasSeleccionadas((prev) =>
        prev.filter((selected) => selected !== materia)
      );
    }
  };

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
  }

  // Función que determina si una materia está seleccionada
  const isMateriaSeleccionada = (materia) => {
    return materiasSeleccionadas.includes(materia);
  };


  const hayTraslape = (horario1, horario2) => {
    const convertirHora = (hora) => {
      const [h, m] = hora.split(":").map(Number);
      return h * 60 + m; // Convertir a minutos
    };

    const [inicio1, fin1] = horario1.map(convertirHora);
    const [inicio2, fin2] = horario2.map(convertirHora);

    return inicio1 < fin2 && inicio2 < fin1; // Verificar si los horarios se solapan
  };

  const validarTraslapes = () => {
    const conflictos = [];

    materiasSeleccionadas.forEach((materiaA, index) => {
      const horariosA = Object.entries(materiaA.horarios);

      materiasSeleccionadas.slice(index + 1).forEach((materiaB) => {
        const horariosB = Object.entries(materiaB.horarios);

        // Validar solo si ambas materias son normales (no semiescolarizadas)
        if (!materiaA.semi && !materiaB.semi) {
          horariosA.forEach(([diaA, horarioA]) => {
            if (horarioA) {
              const horarioB = horariosB.find(([diaB]) => diaB === diaA)?.[1];

              if (horarioB && hayTraslape(horarioA.split("-"), horarioB.split("-"))) {
                conflictos.push({
                  materiaA: materiaA.nombre,
                  materiaB: materiaB.nombre,
                });
              }
            }
          });
        }
      });
    });

    return conflictos;
  };
  
  const validarTraslapesSemiescolarizadas = () => {
    const conflictos = [];

    materiasSeleccionadas.forEach((materiaA, index) => {
      const horariosA = Object.entries(materiaA.horarios);

      materiasSeleccionadas.slice(index + 1).forEach((materiaB) => {
        const horariosB = Object.entries(materiaB.horarios);

        // Validar solo si ambas materias son semiescolarizadas y del mismo tipo (par o impar)
        if (materiaA.semi && materiaB.semi && materiaA.semi === materiaB.semi) {
          horariosA.forEach(([diaA, horarioA]) => {
            if (horarioA) {
              const horarioB = horariosB.find(([diaB]) => diaB === diaA)?.[1];

              if (horarioB && hayTraslape(horarioA.split("-"), horarioB.split("-"))) {
                conflictos.push({
                  materiaA: materiaA.nombre,
                  materiaB: materiaB.nombre,
                });
              }
            }
          });
        }
      });
    });

    return conflictos;
  };
  
  const handleContinuarValidacion = () => {
    const conflictosNormales = validarTraslapes();
    const conflictosSemiescolarizadas = validarTraslapesSemiescolarizadas();

    if (conflictosNormales.length > 0 || conflictosSemiescolarizadas.length > 0) {
      setConflictos([...conflictosNormales, ...conflictosSemiescolarizadas]);
      setMostrarModal(true); // Mostrar el modal con los conflictos
      return; // Detener la ejecución si hay conflictos
    }

    // Calcular la suma de las horas de las materias seleccionadas
    const totalHoras = materiasSeleccionadas.reduce(
      (sum, materia) => sum + (materia.laboratorio ? 8 : 4),
      0
    );

    if (totalHoras > horasMaximas) {
      setMostrarModalHoras(true); // Mostrar el modal de horas excedidas
      return; // Detener la ejecución si las horas exceden el límite
    }
  
    // Si no hay conflictos y las horas son válidas, navegar a la siguiente página
    console.log("Datos", id_carrera, nombre, matricula, id);
    localStorage.removeItem("materiasSeleccionadas");
    navigate("/validacion", { state: { materiasSeleccionadas, nombre, matricula, id, id_carrera } });
  };

  const handleGrupoChange = (e) => {
    setGrupoSeleccionado(e.target.value);
  };

  const fetchHorasCoordinador = async () => {
    try {
      const id_carrera = localStorage.getItem("id_carrera");
      const response = await axios.get(`http://localhost:5000/api/coordinadores/horas/${id_carrera}`);
      setHorasMaximas(response.data.horas); // Suponiendo que el backend regresa { horas: 40 }
    } catch (error) {
      console.error("Error al obtener las horas del coordinador:", error);
    }
  };

  // Filtrar materias por búsqueda
  const materiasFiltradas = materias.filter(materias => 
    materias.grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materias.salon.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materias.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const isSemiescolarizada = carrerasPermitidasSemiescolarizadas.includes(id_carrera);

    return (
      <div className="horario-layout">
      <div className="horario-container">
        <div className="top-right">
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Sistema de selección de horario</h2>
        <p>Bienvenido(a): <strong>{nombre || "Cargando..."}</strong></p>
        <h4>Matricula <strong>{matricula || "Cargando..."}</strong></h4>
        <p>A continuación, seleccione las materias que va a cargar en el semestre</p>
        <div className="filter-container">
        {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre, salon o grupo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          {/* Recuadro para el número máximo de horas permitidas */}
          <div className="max-hours-box">
            <label>Número máximo de horas permitidas: </label>
            <span className="max-hours-value">{horasMaximas || "Cargando..."}</span>
          </div>
          </div>
          <div className="horario-content">
          {!isSemiescolarizada && (
          <>
          <table className="horario-table">
            <thead>
                <tr>
                    <th>Seleccionar</th>
                    <th>Grupo</th>
                    <th>Salón</th>
                    <th>Cupo</th>
                    <th>Materia</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Horas</th> 
              </tr>
          </thead>
          <tbody>
          {materiasFiltradas.map((materia, index) => {
            return (
              <tr key={index}>
                <td><input type="checkbox"
                  checked={isMateriaSeleccionada(materia)}
                  onChange={(e) => handleCheckboxChange(materia, e.target.checked)}
                  disabled={materia.cupo === 0}
                /></td>
                <td>{materia.grupo || "N/A"}</td>
                <td>{materia.salon}</td>
                <td>{materia.cupo}</td>
                <td>{materia.nombre}</td>
                <td>{materia.horarios.lunes || "—"}</td>
                <td>{materia.horarios.martes || "—"}</td>
                <td>{materia.horarios.miercoles || "—"}</td>
                <td>{materia.horarios.jueves || "—"}</td>
                <td>{materia.horarios.viernes || "—"}</td>
                <td>{materia.laboratorio ? 8 : 4}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        </>
      )}
      {isSemiescolarizada && (
        <table className="horario-table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Grupo</th>
              <th>Salón</th>
              <th>Cupo</th>
              <th>Materia</th>
              <th>Semana</th>
              <th>Viernes</th>
              <th>Sábado</th>
              <th>Horas</th> {/* Asegurarse de que esta columna esté definida */}
            </tr>
          </thead>
          <tbody>
            {materiasFiltradas.map((materia, index) => {
              return (
                <tr key={index}>
                  <td><input type="checkbox"
                    checked={isMateriaSeleccionada(materia)}
                    onChange={(e) => handleCheckboxChange(materia, e.target.checked)}
                    disabled={materia.cupo === 0}
                  /></td>
                  <td>{materia.grupo || "N/A"}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.cupo}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.horarios.lunes || "—"}</td>
                  <td>{materia.horarios.martes || "—"}</td>
                  <td>{materia.horarios.miercoles || "—"}</td>
                  <td>{materia.horarios.jueves || "—"}</td>
                  <td>{materia.horarios.viernes || "—"}</td>
                  <td>{materia.laboratorio ? 8 : 4}</td>
                </tr>
              );
            })}
          </tbody>
            </table>
                   )}
                  </div>
                  {mostrarModal && (
                  <div className="modal">
                    <div className="modal-content">
                    <h3>TRASLAPE DE MATERIAS</h3>
                    <p>Existe un empalme en las siguientes materias:</p>
                    <ul>
            {[...new Set(conflictos.flatMap(conflicto => [conflicto.materiaA, conflicto.materiaB]))].map((materia, index) => (
            <li key={index}>
              - <strong>{materia}</strong>
            </li>
            ))}
          </ul>
          <p>
            Deseleccione las materias que están empalmadas para poder continuar.
          </p>
          <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
        )}
        {mostrarModalHoras && (
        <div className="modal">
          <div className="modal-content">
            <h3>HORAS EXCEDIDAS</h3>
            <p>La suma de las horas seleccionadas excede el máximo permitido.</p>
            <p>Por favor, deseleccione algunas materias para continuar.</p>
            <button onClick={() => setMostrarModalHoras(false)}>Cerrar</button>
          </div>
        </div>
      )}
        <div className="horario-buttons">
        <button className="button" onClick={handleDesactivarTodas}>
          Desactivar todas
        </button>
        <button
          className="button"
          onClick={handleContinuarValidacion}
          disabled={materiasSeleccionadas.length === 0} // Deshabilitado si no hay materias seleccionadas
        >
          Continuar a validación
        </button>
        </div>
      </div>
      </div>
    );
  }

export default HorarioSeleccion;
