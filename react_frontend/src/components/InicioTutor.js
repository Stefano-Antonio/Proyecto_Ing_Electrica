import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Importar useLocation y useNavigate
import "./InicioTutor.css";

function InicioTutor() {
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [comprobantes, setComprobantes] = useState([]);
  const [comprobantePorCarrera, setComprobantePorCarrera] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const navigate = useNavigate();
  const { nombre, matricula, id_carrera } = location.state || {};
  const matriculaTutor = localStorage.getItem("matricula");

  // Guardar la matrícula del tutor en localStorage
  useEffect(() => {
    if (matriculaTutor) {
      localStorage.setItem("matriculaTutor", matriculaTutor);
    }
  }, [matriculaTutor]);
  // Obtener la matrícula del tutor desde localStorage si no está en location.state
  const storedMatriculaTutor = localStorage.getItem("matriculaTutor");

  // Evitar que el usuario regrese a la pantalla anterior con el botón de retroceso
  useEffect(() => {
    const bloquearAtras = () => {
      window.history.pushState(null, null, window.location.href);
    };

    bloquearAtras();
    window.addEventListener("popstate", bloquearAtras);

    return () => {
      window.removeEventListener("popstate", bloquearAtras);
    };
  }, []);

  useEffect(() => {
    const fetchComprobantes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/alumnos/comprobantes/lista");
        setComprobantes(response.data); 
      } catch (error) {
        console.error("Error al obtener la lista de comprobantes:", error);
        setComprobantes([]);
      }
    };

    fetchComprobantes();
  }, []);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const matricula = matriculaTutor || storedMatriculaTutor;
        if (!matricula) {
          console.error("Matrícula del tutor no encontrada");
          setError("Matrícula del tutor no encontrada");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/tutores/${matricula}`);
        if (!response.ok) {
          throw new Error("Error al obtener los alumnos");
        }

        const data = await response.json();

        const fetchEstatus = async (alumno) => {
          try {
            const estatusResponse = await fetch(`http://localhost:5000/api/tutores/estatus/${alumno.matricula}`);
            if (!estatusResponse.ok) {
              throw new Error("Error al obtener el estatus del horario");
            }
            const estatusData = await estatusResponse.json();
            return { ...alumno, estatus: estatusData.estatus };
          } catch (error) {
            console.error("Error al obtener el estatus del horario para", alumno.matricula, error);
            return { ...alumno, estatus: "Desconocido" };
          }
        };

        const alumnosConEstatus = await Promise.all(data.alumnos.map(fetchEstatus));
        const carrerasUnicas = [...new Set(alumnosConEstatus.map(a => a.id_carrera))];
        const comprobanteCarreraTemp = {};

        await Promise.all(carrerasUnicas.map(async (carrera) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/coordinadores/comprobante-habilitado/${carrera}`);
            comprobanteCarreraTemp[carrera] = res.data.comprobantePagoHabilitado;
          } catch (error) {
            comprobanteCarreraTemp[carrera] = true;
          }
        }));

        setComprobantePorCarrera(comprobanteCarreraTemp);
        setAlumnos(alumnosConEstatus);
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        setError("Error al cargar los alumnos. Por favor, inténtalo de nuevo.");
      }
    };

    // Si location.state.reload es true, recargar los datos
    if (location.state && location.state.reload) {
      fetchAlumnos();
      // Limpiar la bandera para evitar recargas infinitas
      navigate(location.pathname, { replace: true, state: { ...location.state, reload: false } });
    } else {
      fetchAlumnos();
    }
  }, [matriculaTutor, storedMatriculaTutor, location.state]);

  const handleRevisarHorario = (alumno) => {
    navigate(`/tutor/revisar-horario/${alumno.matricula}`, { state: { nombre: alumno.nombre, matricula: alumno.matricula, matriculaTutor , id_carrea: alumno.id_carrera } });
  };

  const carrerasPermitidas = {
    ISftw: "Ing. en Software",
    IDsr: "Ing. en Desarrollo",
    IEInd: "Ing. Electrónica Industrial",
    ICmp: "Ing. Computación",
    IRMca: "Ing. Robótica y Mecatrónica",
    IElec: "Ing. Electricista",
    ISftwS: "Ing. en Software (Semiescolarizado)",
    IDsrS: "Ing. en Desarrollo (Semiescolarizado)",
    IEIndS: "Ing. Electrónica Industrial(Semiescolarizado)",
    ICmpS: "Ing. Computación (Semiescolarizado)",
    IRMcaS: "Ing. Robótica y Mecatrónica (Semiescolarizado)",
    IElecS: "Ing. Electricista (Semiescolarizado)",
  };
  
  const handleDownloadCSV = async () => {
    const matriculas = alumnosFiltrados.map((a) => a.matricula);
    if (matriculas.length === 0) {
      alert("No hay alumnos filtrados para exportar.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/alumnos/exportar-csv/filtrados",
        { matriculas },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `alumnos_${matriculaTutor || storedMatriculaTutor}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar CSV:", error);
      alert("Error al descargar la lista filtrada.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("tutorId");
    localStorage.removeItem("matriculaTutor"); // Limpiar la matrícula del tutor al cerrar sesión
    navigate("/");
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

  const handleValidate = (alumno) => {
    navigate(`/tutor/validar-pago/${alumno.matricula}`, { 
      state: { 
        nombre: alumno.nombre, 
        matricula: alumno.matricula, 
        matriculaTutor: matriculaTutor, 
        id_carrera: alumno.id_carrera // AGREGADO
      } 
    });
  };


  // Filtrar alumnos por búsqueda
  const alumnosFiltrados = alumnos.filter(alumno => {
  const nombreCoincide = alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  const estatusCoincide = alumno.estatus.toLowerCase() === searchTerm.toLowerCase();
  
  // Si searchTerm coincide exactamente con un estatus conocido, filtramos solo por estatus
  const esFiltroPorEstatus = ["falta de revisar", "revisado", "en espera"].includes(searchTerm.toLowerCase());

  return esFiltroPorEstatus ? estatusCoincide : nombreCoincide || estatusCoincide;
});


  return (
    <div className="tutor-layout">
      <div className="tutor-container">
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h2>Tutor</h2>
        <h3>Bienvenido, {nombre || "Tutor"}</h3>
        <h4>A continuación, se muestra una lista de alumnos asignados.</h4>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o estatus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
  <button onClick={() => setSearchTerm("")} className="clear-filter-button">
    Limpiar filtro
  </button>
        {error && <p className="error-message">{error}</p>}
        {alumnosFiltrados.length > 0 ? (
        <div className="tutor-content">
          <table className="tutor-table">
            <thead>
              <tr>
                <th>Matricula</th>
                <th>Nombre del alumno</th>
                <th>Carrera</th>
                <th>Revisar horario</th>
                <th>Estatus</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((alumno) => (
                <tr key={alumno._id}>
                  <td>{alumno.matricula}</td>
                  <td>{alumno.nombre}</td>
                  <td>{carrerasPermitidas[alumno.id_carrera] || alumno.id_carrera}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => handleRevisarHorario(alumno)}
                      disabled={alumno.estatus === "En espera"} >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="blue"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
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
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 24 24">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        </button>
                        ) : alumno.estatusComprobante === "Pendiente" ? (
                          <button
                            className="icon-button"
                            onClick={() => handleValidate(alumno)}
                            title="Comprobante pendiente de revisión"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFD600" viewBox="0 0 24 24">
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 7.414l-4.828-4.828A2 2 0 0 0 12.172 2H6zm7 1.414L18.586 9H15a2 2 0 0 1-2-2V3.414z"/>
                          </svg>
                        </button>
                        ) : alumno.estatusComprobante === "Revisado" || alumno.estatusComprobante === "Aceptado" ? (
                          <button
                            className="icon-button"
                            onClick={() => handleValidate(alumno)}
                            title="Comprobante aceptado"
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <p className="no-alumnos-message">No se encontraron resultados.</p>
        )}
        <div className="horario-buttons">
          <button className="button"
            onClick={handleDownloadCSV}
            disabled={alumnosFiltrados.length === 0}>
            Descargar Lista de alumnos
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InicioTutor;