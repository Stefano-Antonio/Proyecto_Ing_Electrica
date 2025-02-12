import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HorarioSeleccion.css";

function HorarioSeleccion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [materias, setMaterias] = useState([]); // Estado para almacenar las materias
  const [grupos, setGrupos] = useState([]); // Estado para almacenar los grupos
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(""); // Estado para almacenar el grupo seleccionado
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]); // Materias seleccionadas
  const [conflictos, setConflictos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreAlumno, setNombreAlumno] = useState(location.state?.nombre || "");
  const [IDAlumno, setIDAlumno] = useState(location.state?._id || "");
  const [matricula, setMatricula] = useState(localStorage.getItem("matricula")); // Obtener matrícula del localStorage
    
  // Función para obtener las materias desde el backend
  useEffect(() => {
  
    const fetchMaterias = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/materias");
        const data = await response.json();
        console.log(data); // Log para verificar los datos recibidos
        const sortedData = data.sort((a, b) => a.grupo.localeCompare(b.grupo));
        setMaterias(sortedData);

        const uniqueGroups = [...new Set(data.map((materia) => materia.grupo))];
        setGrupos(uniqueGroups);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    };

    fetchMaterias();
  }, []);

  useEffect(() => {
    const nombre = location.state?.nombre || localStorage.getItem("nombreAlumno");
    setNombreAlumno(nombre || "Alumno desconocido");
  }, [location.state]);

  useEffect(() => {
    const idAlumno = location.state?.id || localStorage.getItem("IDAlumno");
    setIDAlumno(idAlumno || "ID desconocido");
  }, [location.state]);

  const handleDesactivarTodas = () => {
    setMateriasSeleccionadas([]); // Vaciar las seleccionadas
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
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
  
    return !(fin1 <= inicio2 || fin2 <= inicio1); // Verificar si no están separados
  };

  const validarTraslapes = () => {
    const conflictos = [];
  
    materiasSeleccionadas.forEach((materiaA, index) => {
      const horariosA = Object.entries(materiaA.horarios); // Obtener horarios por días como pares [día, horario]
      materiasSeleccionadas.slice(index + 1).forEach((materiaB) => {
        const horariosB = Object.entries(materiaB.horarios);
  
        horariosA.forEach(([diaA, horarioA]) => {
          if (horarioA) {
            const horarioB = horariosB.find(([diaB, _]) => diaB === diaA)?.[1]; // Encontrar el horario del mismo día
  
            if (
              horarioB &&
              hayTraslape(horarioA.split("-"), horarioB.split("-"))
            ) {
              conflictos.push({
                materiaA: materiaA.nombre,
                materiaB: materiaB.nombre,
              });
            }
          }
        });
      });
    });
  
    return conflictos;
  };
  
  

  const handleContinuarValidacion = () => {
    const conflictosDetectados = validarTraslapes();
    if (conflictosDetectados.length > 0) {
      setConflictos(conflictosDetectados);
      setMostrarModal(true);
      return;
    }
  
    // Si no hay conflictos, navegar a la siguiente página
    navigate("/validacion", { state: { materiasSeleccionadas, nombreAlumno, matricula, IDAlumno } });
  };

  const handleGrupoChange = (e) => {
    setGrupoSeleccionado(e.target.value);
  };



  // Filtrar las materias basadas en el grupo seleccionado
  const materiasFiltradas = grupoSeleccionado
    ? materias.filter((materia) => materia.grupo === grupoSeleccionado)
    : materias;

  return (
    <div className="horario-layout">
      <div className="horario-container">
      <div className="top-right"> 
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
      </div>
        <h2>Sistema de selección de horario</h2>
        <p>Bienvenido(a): <strong>{nombreAlumno || "Cargando..."}</strong></p>
        <p>ID de alumno: <strong>{IDAlumno || "Cargando..."}</strong></p>
        <p>A continuación, seleccione las materias que va a cargar en el semestre</p>

        <div className="horario-content">
          <div className="field-group two-columns">
            <label>Grupo: </label>
            <select value={grupoSeleccionado} onChange={handleGrupoChange}>
              <option value="">Seleccionar grupo...</option>
              {grupos.map((grupo, index) => (
                <option key={index} value={grupo}>
                  {grupo}
                </option>
              ))}
            </select>
          </div>
          <table className="horario-table">
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Grupo</th>
                <th>Salón</th>
                <th>Materia</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sabado</th>
              </tr>
            </thead>
            <tbody>
              {materiasFiltradas.map((materia, index) => (
                <tr key={index}>
                  <td>
                  <input
                      type="checkbox"
                      checked={isMateriaSeleccionada(materia)} // Vincula con el estado
                      onChange={(e) => handleCheckboxChange(materia, e.target.checked)}
                    />
                  </td>
                  <td>{materia.grupo || "N/A"}</td>
                  <td>{materia.salon}</td>
                  <td>{materia.nombre}</td>
                  <td>{materia.horarios.lunes || "—"}</td>
                  <td>{materia.horarios.martes || "—"}</td>
                  <td>{materia.horarios.miercoles || "—"}</td>
                  <td>{materia.horarios.jueves || "—"}</td>
                  <td>{materia.horarios.viernes || "—"}</td>
                  <td>{materia.horarios.sabado || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mostrarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>TRASLAPE DE MATERIAS</h3>
              <p>Existe un empalme en las siguientes materias:</p>
              <ul>
                {/* Crear una lista única de materias involucradas en conflictos */}
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