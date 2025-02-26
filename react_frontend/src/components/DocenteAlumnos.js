import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./InicioDocente.css";

function DocenteAlumnos() {
  const [alumnos, setAlumnos] = useState([]); // Definir el estado alumnos
  const navigate = useNavigate();
  const location = useLocation();

  const { nombre, matricula: matriculaDocente, materiaId, materiaNombre } = location.state || {};

  // Guardar la matrícula del tutor en localStorage
  useEffect(() => {
    if (matriculaDocente) {
      localStorage.setItem("matriculaTutor", matriculaDocente);
    }
  }, [matriculaDocente]);

  // Obtener la matrícula del tutor desde localStorage si no está en location.state
  const storedMatriculaDocente = localStorage.getItem("matriculaDocente");

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        if (!materiaId) {
          console.error("ID de la materia no encontrado");
          return;
        }
  
        const response = await fetch(`http://localhost:5000/api/docentes/materia/${materiaId}/alumnos`);
        if (!response.ok) {
          throw new Error("Error al obtener los alumnos");
        }
  
        const data = await response.json();
        // Ordenar los alumnos alfabéticamente por nombre
        const alumnosOrdenados = data.alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setAlumnos(alumnosOrdenados);
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
      }
    };
  
    fetchAlumnos();
  }, [materiaId]);
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleDownloadCSV = (materiaNombre) => {
    if (alumnos.length === 0) return;
  
    const headers = ["Matrícula", "Nombre", "Teléfono"];
    // Asegurar que los datos estén ordenados antes de generar el CSV
    const alumnosOrdenados = [...alumnos].sort((a, b) => a.nombre.localeCompare(b.nombre));
  
    const csvRows = [
      headers.join(","), 
      ...alumnosOrdenados.map(alumno => [alumno.matricula, alumno.nombre, alumno.telefono].join(","))
    ];
  
    const csvString = "\uFEFF" + csvRows.join("\n"); // Agregar BOM para compatibilidad con Excel
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const nombreArchivo = `${materiaNombre.replace(/\s+/g, "_")}.csv`; // Reemplaza espacios con guiones bajos
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  
  const handleBack = () => {
    navigate(-1, { state: { nombre, matricula: matriculaDocente || storedMatriculaDocente } });
  };

  return (
    <div className="docente-layout">
      <div className="docente-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        </div>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <h2>Docente</h2>
        <div className="docente-header">
          <h3>{`${nombre}`}</h3>
          <h3>Grupo: 1A</h3>
          <h3>Materia: {materiaNombre}</h3>
        </div>

        <div className="docente-content">
          <table className="docente-table">
            <thead>
              <tr>
                <th>Matricula</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno._id}>
                  <td>{alumno.matricula}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.correo}</td>
                  <td>{alumno.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="horario-buttons">
          <button className="button" onClick={() => handleDownloadCSV(materiaNombre)} disabled={alumnos.length === 0}>
            Descargar lista de alumnos
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocenteAlumnos;