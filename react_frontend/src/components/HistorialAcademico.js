import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HistorialAcademico.css';

function HistorialAcademico() {
  const [semestres, setSemestres] = useState([
    "2025-1", "2024-2", "2024-1", "2023-2", "2023-1"
  ]);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState(semestres[0]);
  const [historiales, setHistoriales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener historiales académicos del backend
    fetch('http://localhost:5000/api/historial')
      .then(res => res.json())
      .then(data => setHistoriales(data))
      .catch(() => setHistoriales([]));
  }, []);

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
    switch (tipo) {
        case 'personal':
            if (!id_carrera) {
                alert('ID de carrera no encontrado.');
                return;
            }
            url = `http://localhost:5000/api/personal/exportar-csv`;
            nombre = 'personal.csv'; // Cambia a .csv
            break;
        case 'alumnos':
            url = 'http://localhost:5000/api/alumnos/exportar-csv';
            nombre = 'alumnos.csv'; // Cambia a .csv
            break;
        case 'materias':
            url = 'http://localhost:5000/api/materias/exportar-csv';
            nombre = 'materias.csv'; // Cambia a .csv
            break;
        default:
            alert('Tipo de descarga no válido.');
            return;
    }
    try {
        const folderPath = 'C:/Users/Stefano/Documentos/HistorialAcademico';
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
      const response = await fetch('http://localhost:5000/api/historial/generar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          semestre: semestreSeleccionado,
          matricula: localStorage.getItem('matricula')
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Historial generado correctamente');
        setHistoriales(prev => [data.historial, ...prev]);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error al generar historial: ' + err.message);
    }
  };

  return (
    <div className="historial-academico-container">
      <h2>Historial Académico</h2>
      <div className="espacio-historial">
        <h3>Historiales generados</h3>
        <table className="historial-table">
          <thead>
            <tr>
              <th>Semestre</th>
              <th>Fecha</th>
              <th>Personal</th>
              <th>Alumnos</th>
              <th>Materias</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(historiales) && historiales.length > 0
              ? historiales
                  .filter(h => h && h.semestre) // Filtra elementos undefined o sin semestre
                  .map(h => (
                    <tr key={h._id}>
                      <td>{h.semestre}</td>
                      <td>{new Date(h.fecha_generacion).toLocaleString()}</td>
                      {/* Busca archivos .csv en el backend y descarga como .csv */}
                      <td>
                        <a
                          href={`http://localhost:5000/descargas/${h.semestre}/personal.csv`}
                          download="personal.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                      <td>
                        <a
                          href={`http://localhost:5000/descargas/${h.semestre}/alumnos.csv`}
                          download="alumnos.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                      <td>
                        <a
                          href={`http://localhost:5000/descargas/${h.semestre}/materias.csv`}
                          download="materias.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                    </tr>
                  ))
              : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No hay historiales disponibles</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button className="generar-historial-button" onClick={handleGenerarHistorialAcademico}>Generar historial académico</button>
      </div>
    </div>
  );
}

export default HistorialAcademico;
