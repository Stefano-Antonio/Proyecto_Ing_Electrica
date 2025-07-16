import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AlumnoList.css";

const AlumnoListCG = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [tutoresNombres, setTutoresNombres] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [comprobantes, setComprobantes] = useState([]);
  const [comprobantePorCarrera, setComprobantePorCarrera] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [AlumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const matriculaCord = localStorage.getItem("matricula");
  const id_carrera = localStorage.getItem("id_carrera");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/alumnos`);
        const alumnosData = response.data;

        // Obtener los nombres de los tutores
        const tutoresNombresTemp = {};
        await Promise.all(alumnosData.map(async (alumno) => {
          if (alumno.tutor) {
            try {
              const tutorResponse = await axios.get(`http://localhost:5000/api/coordinadores/alumnos/${alumno.tutor}`);
              tutoresNombresTemp[alumno._id] = tutorResponse.data.nombre;
            } catch (error) {
              tutoresNombresTemp[alumno._id] = "Error al obtener tutor";
            }
          }
        }));

        // Obtener estatus para cada alumno
        const fetchEstatus = async (alumno) => {
          try {
            const estatusResponse = await fetch(`http://localhost:5000/api/tutores/estatus/${alumno.matricula}`);
            if (!estatusResponse.ok) throw new Error("Error al obtener el estatus del horario");
            const estatusData = await estatusResponse.json();
            return { ...alumno, estatus: estatusData.estatus };
          } catch (error) {
            return { ...alumno, estatus: "Desconocido" };
          }
        };

        const alumnosConEstatus = await Promise.all(alumnosData.map(fetchEstatus));
        setAlumnos(alumnosConEstatus);
        setTutoresNombres(tutoresNombresTemp);

        // Obtener carreras únicas
        const carrerasUnicas = [...new Set(alumnosData.map(a => a.id_carrera))];
        const comprobanteCarreraTemp = {};

        // Consultar el estado de comprobante por cada carrera
        await Promise.all(carrerasUnicas.map(async (carrera) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/coordinadores/comprobante-habilitado/${carrera}`);
            comprobanteCarreraTemp[carrera] = res.data.comprobantePagoHabilitado;
          } catch (error) {
            comprobanteCarreraTemp[carrera] = true; // Por defecto true si falla
          }
        }));
        setComprobantePorCarrera(comprobanteCarreraTemp);

      } catch (error) {
        console.error('Error al obtener alumnos:', error);
      }
    };

    const fetchComprobantes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumnos/comprobantes/lista');
        setComprobantes(response.data);
      } catch (error) {
        setComprobantes([]);
      }
    };

    const fetchData = async () => {
      await fetchAlumnos();
      await fetchComprobantes();
      setLoading(false);
    };

    fetchData();
  }, [matriculaCord, id_carrera]);

  const handleNavigate1 = () => {
    navigate("/crear-alumno-cg", { state: { matriculaCord: matriculaCord } });
  };

  const handleNavigate2 = () => {
    navigate("/admin-tutor", { state: { matriculaCord: matriculaCord } });
  };

  const handleNavigate3 = (alumno) => {
    console.log("Navegando a: ", `/revisar-horario/${alumno.matricula}`);
    navigate(`/coordinador/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaCord: matriculaCord} });
  };

  const handleModify = (alumno) => {
    navigate("/modificar-alumno-cg", { state: { alumno, matriculaCord: matriculaCord } });
  };

  // Función para validar el comprobante de pago
  const handleValidate = (alumno) => {
    console.log("Navegando a: ", `/validar-pago-cg/${alumno.matricula}`);
    navigate(`/validar-pago-cg/${alumno.matricula}`, {
      state: {
        nombre: alumno.nombre,
        matricula: alumno.matricula,
        id_carrera: alumno.id_carrera,
        matriculaCord: matriculaCord
      }
    });
  };


  const setModal = (id) => {
    setAlumnoAEliminar(id);
    setMostrarModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/alumnos/${AlumnoAEliminar}`);
      setAlumnos(prevState => prevState.filter(alumno => alumno._id !== AlumnoAEliminar));
      toast.success("Alumno eliminado con éxito");
      setMostrarModal(false);
    } catch (error) {
      toast.error("Hubo un error al eliminar el alumno");
    }
  };

  const getEstatusIcon = (estatus) => {
    switch (estatus) {
      case "Sin revisar":
        return <span className="status-icon yellow"></span>;
      case "En espera":
        return <span className="status-icon gray"></span>;
      case "Revisado":
        return <span className="status-icon green"></span>;
      default:
        return <span className="status-icon yellow"></span>;
    }
  };

  if (loading) {
    return <div className="loading">Cargando información de alumnos...</div>;
  }


    // Filtrar alumnos por búsqueda
  const alumnosFiltrados = alumnos.filter(alumno => {
    const search = searchTerm.toLowerCase();
    const nombreCoincide = alumno.nombre.toLowerCase().includes(search);
    const matriculaCoincide = alumno.matricula.toLowerCase().includes(search);
    const tutorCoincide =
      tutoresNombres[alumno._id] &&
      tutoresNombres[alumno._id].toLowerCase().includes(search);
    const estatusCoincide = alumno.estatus.toLowerCase() === search;

    // Si el término de búsqueda es un estatus exacto, solo filtrar por estatus
    const esFiltroPorEstatus = ["falta de revisar", "revisado", "en espera"].includes(search);

    return esFiltroPorEstatus
      ? estatusCoincide
      : nombreCoincide || matriculaCoincide || tutorCoincide || alumno.estatus.toLowerCase().includes(search);
  });

  return (
  <div className="alumno-layout">
  <ToastContainer position="top-right" autoClose={3000} />
  <div className="alumno-container">
    <h3>Administrar alumnos</h3>
    <p>Lista de alumnos asociados al programa académico</p>

    {/* Contenedor de la barra de búsqueda y el botón */}
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar por matrícula, nombre, tutor o estatus..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <button onClick={() => setSearchTerm("")} className="clear-filter-button">
        Limpiar filtro
      </button>
    </div>
        {alumnosFiltrados.length > 0 ? (
          <div className="alumno-scrollable-table">
            <table className="alumnos-table">
              <thead>
                <tr>
                  <th>Programa</th>
                  <th>Matricula</th>
                  <th>Nombre del alumno</th>
                  <th>Tutor asignado</th>
                  <th>Horario</th>
                  <th>Estatus de horario</th>
                  <th>Comprobante de pago</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.map((alumno) => (
                  <tr key={alumno._id}>
                    <td>{alumno.id_carrera}</td>
                    <td>{alumno.matricula}</td>
                    <td>{alumno.nombre}</td>
                    <td>{tutoresNombres[alumno._id] ? tutoresNombres[alumno._id] : "Sin asignar"}</td>
                    <td className="actions">
                      <button
                        className="icon-button"
                        onClick={() => handleNavigate3(alumno)}
                        disabled={alumno.estatus === "En espera"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </td>
                  <td
                      className="estatus"
                      onClick={() => setSearchTerm(alumno.estatus)}
                      style={{ cursor: "pointer", color: getEstatusIcon(alumno.estatus) }}
                    >{getEstatusIcon(alumno.estatus)}</td>
                    <td>
                    {!comprobantePorCarrera[alumno.id_carrera] ? (
                      <span style={{ color: "#888" }}>Deshabilitado</span>
                    ) : (
                      comprobantes.includes(`Pago_${alumno.matricula}.pdf`) ? (
                        alumno.estatusComprobante === "Rechazado" ? (
                          <button
                            className="icon-button"
                            onClick={() => handleValidate(alumno)}
                            title="Comprobante rechazado"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 24 24">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        </button>
                        ) : alumno.estatusComprobante === "Pendiente" ? (
                          <button
                            className="icon-button"
                            onClick={() => handleValidate(alumno)}
                            title="Comprobante pendiente de revisión"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFD600" viewBox="0 0 24 24">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        </button>
                        ) : alumno.estatusComprobante === "Revisado" || alumno.estatusComprobante === "Aceptado" ? (
                          <button
                            className="icon-button"
                            onClick={() => handleValidate(alumno)}
                            title="Comprobante aceptado"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" viewBox="0 0 24 24">
                              <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                            </svg>
                          </button>
                        ) : (
                          <svg width="20" height="20" fill="#BDBDBD" viewBox="0 0 24 24" title="Sin estatus">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        )
                      ) : (
                        <span title="Sin comprobante">
                          <svg width="20" height="20" fill="#BDBDBD" viewBox="0 0 24 24">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        </span>
                      )
                    )}
                  </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-button" onClick={() => handleModify(alumno)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button className="icon-button" onClick={() => setModal(alumno._id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M15 6V4a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-alumnos-message">No se encontraron resultados.</p>
        )}
        {mostrarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>AVISO</h3>
              <p>¿Está seguro que desea continuar?</p>
              <p>
                Una vez eliminado, no podrá revertirse el proceso
              </p>
              <button onClick={handleDelete}>Continuar</button>
              <button onClick={() => setMostrarModal(false)}>Cerrar</button>
            </div>
          </div>
        )}

        <div className="add-delete-buttons">
          <button onClick={handleNavigate1}>Agregar alumnos</button>
          <button onClick={handleNavigate2}>Administrar tutorados</button>
        </div>
      </div>
    </div>
  );
};

export default AlumnoListCG;