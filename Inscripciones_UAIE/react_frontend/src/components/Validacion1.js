import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./Validacion1.css";

function Validacion1() {

  const location = useLocation();
  const navigate = useNavigate();

  const { materiasSeleccionadas = [] } = location.state || {};

  const handleContinuarValidacion = () => {
    // Si no hay conflictos, navegar a la siguiente página
    navigate("/validacion-estatus");
  };

  const generarCSV = () => {
    if (materiasSeleccionadas.length === 0) {
      alert("No hay materias seleccionadas para descargar.");
      return;
    }
  
    // Encabezados del archivo CSV
    const encabezados = [
      "Nombre",
      "Grupo",
      "Salon",
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
    ];
  
    // Convertir materias a formato CSV
    const filas = materiasSeleccionadas.map((materia) => [
      materia.nombre,
      materia.grupo,
      materia.salon,
      materia.horarios.lunes || "—",
      materia.horarios.martes || "—",
      materia.horarios.miercoles || "—",
      materia.horarios.jueves || "—",
      materia.horarios.viernes || "—",
    ]);
  
    // Crear contenido CSV
    const contenidoCSV = [
      encabezados.join(","), // Agregar encabezados
      ...filas.map((fila) => fila.join(",")), // Agregar cada fila
    ].join("\n");
  
    // Crear un archivo Blob con el contenido
    const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
  
    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "materias_seleccionadas.csv";
  
    // Simular clic en el enlace para descargar
    link.click();
  
    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  };


  return (
    <div className="horario-layout">
    
    <div className="horario-container">
      <h2>Verificación de horario</h2>
      <p>Verifique que las materias seleccionadas estén correctas.</p>
      <p>Una vez finalizado el proceso, no se podrán agregar ni quitar materias.</p>


      <div className="horario-content">
        <table className="horario-table">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Salón</th>
              <th>Materia</th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
            </tr>
          </thead>
          <tbody>
            {materiasSeleccionadas.map((materia, index) => (
                  <tr key={index}>
                    <td>{materia.grupo}</td>
                    <td>{materia.salon}</td>
                    <td>{materia.nombre}</td>
                    <td>{materia.horarios.lunes || "—"}</td>
                    <td>{materia.horarios.martes || "—"}</td>
                    <td>{materia.horarios.miercoles || "—"}</td>
                    <td>{materia.horarios.jueves || "—"}</td>
                    <td>{materia.horarios.viernes || "—"}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div class="form-group">
        <label for="email">Correo electrónico: </label>
        <input type="email" id="email" placeholder="alguien@example.com"></input>
        <label for="phone"> Teléfono: </label>
        <input type="tel" id="phone" placeholder="000-000-0000"></input>
      </div>
      <div className="horario-buttons">
        <button className="button" onClick={() => navigate(-1)}>Regresar</button>
        <button
            className="button"
            onClick={handleContinuarValidacion}
          >Inscribir materias</button>
        <button className="button" onClick={generarCSV}>Descargar CSV</button>
      </div>
    </div>
    </div>
  );
}

export default Validacion1;