import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HistorialAcademico.css';

function HistorialAcademico() {
  const [semestres, setSemestres] = useState([
    "2025-1", "2024-2", "2024-1", "2023-2", "2023-1"
  ]); // Puedes poblar esto dinámicamente si lo deseas
  const [semestreSeleccionado, setSemestreSeleccionado] = useState(semestres[0]);
  const navigate = useNavigate();

  // Crear carpeta en Documentos si no existe
  useEffect(() => {
    async function crearCarpetaHistorial() {
      // Espacio para lógica nativa/electron/node para crear carpeta en Documentos
      // Por ejemplo: await window.api.createFolder('Historial academico');
      // Aquí solo dejamos el espacio para la función real
    }
    crearCarpetaHistorial();
  }, []);

  // Descargar archivo Excel de cada tipo usando la lógica de los archivos de crear
const descargarArchivo = async (tipo) => {
    let url = '';
    let nombre = '';
    const id_carrera = localStorage.getItem('id_carrera');
    /*if (!window.api || !window.api.createFolder || !window.api.saveFile) {
        alert('Funcionalidad no disponible en este entorno.');
        return;
    }*/
    switch (tipo) {
        case 'personal':
            if (!id_carrera) {
                alert('ID de carrera no encontrado.');
                return;
            }
            url = `http://localhost:5000/api/personal/exportar-csv`;
            nombre = 'personal.xlsx';
            break;
        case 'alumnos':
            url = 'http://localhost:5000/api/alumnos/exportar-csv';
            nombre = 'alumnos.xlsx';
            break;
        case 'materias':
            url = 'http://localhost:5000/api/materias/exportar-csv';
            nombre = 'materias.xlsx';
            break;
        default:
            alert('Tipo de descarga no válido.');
            return;
    }
    try {
        // Carpeta absoluta en Windows
        const folderPath = 'C:/Users/Stefano/Documentos/HistorialAcademico';
        // Se intenta crear la carpeta, pero si ya existe, no pasa nada (debe manejarlo la función nativa)
        await window.api.createFolder(folderPath);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al descargar ' + tipo);
        const blob = await response.blob();
        await window.api.saveFile(folderPath + '/' + nombre, blob);
        alert(`Archivo ${nombre} guardado en ${folderPath}`);
    } catch (error) {
        alert('Error al descargar archivo: ' + error.message);
    }
};

  const handleGenerarHistorialAcademico = async () => {
    try {
      if (!window.api || !window.api.createFolder || !window.api.saveFile) {
        alert('Funcionalidad no disponible en este entorno.');
        return;
      }
      const folderPath = 'C:/Users/Stefano/Documentos/HistorialAcademico';
      await window.api.createFolder(folderPath);
      const id_carrera = localStorage.getItem('id_carrera');
      const endpoints = [
        { tipo: 'personal', url: id_carrera ? `http://localhost:5000/api/personal/exportar-csv` : '', nombre: 'personal.xlsx' },
        { tipo: 'alumnos', url: 'http://localhost:5000/api/alumnos/exportar-csv', nombre: 'alumnos.xlsx' },
        { tipo: 'materias', url: 'http://localhost:5000/api/materias/exportar-csv', nombre: 'materias.xlsx' }
      ];
      for (const endpoint of endpoints) {
        if (!endpoint.url) continue;
        const response = await fetch(endpoint.url);
        if (!response.ok) throw new Error('Error al descargar ' + endpoint.tipo);
        const blob = await response.blob();
        await window.api.saveFile(folderPath + '/' + endpoint.nombre, blob);
      }
      alert('Historial académico generado y guardado en ' + folderPath);
    } catch (error) {
      alert('Error al generar historial académico: ' + error.message);
    }
  };
  
  return (
    <div className="historial-academico-container">
      <h2>Historial Académico</h2>
      <div className="panel-control">
        <label htmlFor="semestre-select">Selecciona el semestre:</label>
        <select
          id="semestre-select"
          value={semestreSeleccionado}
          onChange={e => setSemestreSeleccionado(e.target.value)}
        >
          {semestres.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>
        <div className="botones-descarga">
          <button onClick={() => descargarArchivo('personal')}>Descargar Personal</button>
          <button onClick={() => descargarArchivo('alumnos')}>Descargar Alumnos</button>
          <button onClick={() => descargarArchivo('materias')}>Descargar Materias</button>
        </div>
      </div>
      <div className="espacio-historial">
        {/* Aquí se puede mostrar la información del historial académico según el semestre seleccionado */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button className="generar-historial-button" onClick={handleGenerarHistorialAcademico}>Generar historial académico</button>
      </div>
    </div>
  );
}

export default HistorialAcademico;
