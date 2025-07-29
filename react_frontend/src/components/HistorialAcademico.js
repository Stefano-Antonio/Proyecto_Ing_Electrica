import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './HistorialAcademico.css';

// Mueve esta función fuera de los componentes para reutilizarla
function getSemestreActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  const periodo = mes >= 1 && mes <= 6 ? '1' : '2';
  return `${año}-${periodo}`;
}

const API_URL = process.env.REACT_APP_API_URL; // Asegúrate de que esta variable esté definida en tu entorno

function HistorialAcademico() {
  const [historiales, setHistoriales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener historiales académicos del backend
    fetch(`${API_URL}/api/historial`)
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
            url = `${API_URL}/api/personal/exportar-csv`;
            nombre = 'personal.csv'; // Cambia a .csv
            break;
        case 'alumnos':
            url = `${API_URL}/api/alumnos/exportar-csv`;
            nombre = 'alumnos.csv'; // Cambia a .csv
            break;
        case 'materias':
            url = `${API_URL}/api/materias/exportar-csv`;
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
      const response = await fetch(`${API_URL}/api/historial/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          semestre: semestre,
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

  const semestre = getSemestreActual();
  const [fechaBorrado, setFechaBorrado] = React.useState('');
  const [editFecha, setEditFecha] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/historial/fecha-borrado?semestre=${semestre}`)
      .then(res => res.json())
      .then(data => {
        setFechaBorrado(data.fecha_de_borrado ? data.fecha_de_borrado.substring(0, 10) : 'No registrada');
        setEditFecha(data.fecha_de_borrado ? data.fecha_de_borrado.substring(0, 10) : '');
      })
      .catch(() => setFechaBorrado('Error al obtener fecha'))
      .finally(() => setLoading(false));
  }, [semestre]);

  const handleActualizar = async () => {
    if (!editFecha) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/historial/fecha-borrado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semestre, fecha_de_borrado: editFecha })
      });
      const data = await res.json();
      if (res.ok) {
        setFechaBorrado(new Date(editFecha).toLocaleString());
        alert('Fecha de borrado actualizada');
      } else {
        alert(data.message || 'Error al actualizar fecha');
      }
    } catch {
      alert('Error al actualizar fecha');
    } finally {
      setLoading(false);
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
              <th>Descargar todo</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(historiales) && historiales.length > 0
              ? historiales
                  .filter(h => h && h.semestre)
                  .map(h => (
                    <tr key={h._id}>
                      <td>{h.semestre}</td>
                      <td>{new Date(h.fecha_generacion).toLocaleString()}</td>
                      <td>
                        <a
                          href={`${API_URL}/descargas/${h.semestre}/personal.csv`}
                          download="personal.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                      <td>
                        <a
                          href={`${API_URL}/descargas/${h.semestre}/alumnos.csv`}
                          download="alumnos.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                      <td>
                        <a
                          href={`${API_URL}/descargas/${h.semestre}/materias.csv`}
                          download="materias.csv"
                          type="text/csv"
                        >Descargar</a>
                      </td>
                      <td>
                        <button onClick={async () => {
                          try {
                            const files = [
                              { url: `${API_URL}/descargas/${h.semestre}/personal.csv`, name: 'personal.csv' },
                              { url: `${API_URL}/descargas/${h.semestre}/alumnos.csv`, name: 'alumnos.csv' },
                              { url: `${API_URL}/descargas/${h.semestre}/materias.csv`, name: 'materias.csv' }
                            ];
                            for (const f of files) {
                              const response = await fetch(f.url);
                              if (!response.ok) throw new Error('Error al descargar ' + f.name);
                              const blob = await response.blob();
                              const link = document.createElement('a');
                              link.href = window.URL.createObjectURL(blob);
                              link.download = f.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                            alert(`Archivos descargados`);
                          } catch (error) {
                            alert('Error al descargar archivos: ' + error.message);
                          }
                        }}>Descargar todo</button>
                      </td>
                    </tr>
                  ))
              : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>No hay historiales disponibles</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button className="generar-historial-button" onClick={handleGenerarHistorialAcademico}>Generar historial académico</button>
      </div>
      {/* Paneles de vaciado y fecha de borrado */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '40px',
        flexWrap: 'wrap'
      }}>
        
        {/* Apartado para vaciar la base de datos */}
        <div style={{ textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px', padding: '20px', maxWidth: '500px', minWidth: '260px', flex: '1 1 320px' }}>
          <h3 style={{ marginBottom: '20px' }}>Vaciar base de datos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <button onClick={async () => {
              if(window.confirm('¿Seguro que deseas vaciar todas las materias?')){
                try {
                  const res = await fetch(`${API_URL}/api/historial/vaciar-materias`, { method: 'DELETE' });
                  const data = await res.json();
                  alert(data.message || 'Materias eliminadas');
                } catch (err) { alert('Error al vaciar materias'); }
              }
            }} style={{ width: '220px' }}>Vaciar materias</button>
            <button onClick={async () => {
              if(window.confirm('¿Seguro que deseas vaciar todos los alumnos?')){
                try {
                  const res = await fetch(`${API_URL}/api/historial/vaciar-alumnos`, { method: 'DELETE' });
                  const data = await res.json();
                  alert(data.message || 'Alumnos eliminados');
                } catch (err) { alert('Error al vaciar alumnos'); }
              }
            }} style={{ width: '220px' }}>Vaciar alumnos</button>
            <button onClick={async () => {
              if(window.confirm('¿Seguro que deseas vaciar todo el personal?')){
                try {
                  const res = await fetch(`${API_URL}/api/historial/vaciar-personal`, { method: 'DELETE' });
                  const data = await res.json();
                  alert(data.message || 'Personal eliminado');
                } catch (err) { alert('Error al vaciar personal'); }
              }
            }} style={{ width: '220px' }}>Vaciar personal</button>
            <button onClick={async () => {
              if(window.confirm('¿Seguro que deseas vaciar materias, alumnos y personal?')){
                try {
                  const res1 = await fetch(`${API_URL}/api/historial/vaciar-materias`, { method: 'DELETE' });
                  const data1 = await res1.json();
                  const res2 = await fetch(`${API_URL}/api/historial/vaciar-alumnos`, { method: 'DELETE' });
                  const data2 = await res2.json();
                  const res3 = await fetch(`${API_URL}/api/historial/vaciar-personal`, { method: 'DELETE' });
                  const data3 = await res3.json();
                  alert((data1.message || '') + '\n' + (data2.message || '') + '\n' + (data3.message || ''));
                } catch (err) { alert('Error al vaciar toda la base de datos'); }
              }
            }} style={{ width: '220px', background: '#c00', color: 'white', fontWeight: 'bold' }}>Vaciar TODO</button>
          </div>
        </div>
        {/* Panel de fecha de borrado */}
        <FechaBorradoPanel semestre={semestre || getSemestreActual()} historiales={historiales} />
      </div>
    </div>
  );
}

export default HistorialAcademico;

// --- Componente FechaBorradoPanel ---
function formatFechaDMY(fechaStr) {
  if (!fechaStr || fechaStr === 'No registrada' || fechaStr === 'Error al obtener fecha') return fechaStr;
  const [year, month, day] = fechaStr.split('-');
  return `${day}/${month}/${year}`;
}

function FechaBorradoPanel({ semestre, historiales }) {
  const [fechaBorrado, setFechaBorrado] = React.useState('');
  const [editFecha, setEditFecha] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Función para obtener la fecha de borrado
  const obtenerFechaBorrado = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/historial/fecha-borrado?semestre=${semestre}`);
      const data = await res.json();
      setFechaBorrado(data.fecha_de_borrado ? data.fecha_de_borrado.substring(0, 10) : 'No registrada');
      setEditFecha(data.fecha_de_borrado ? data.fecha_de_borrado.substring(0, 10) : '');
    } catch {
      setFechaBorrado('Error al obtener fecha');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    obtenerFechaBorrado();
  }, [semestre]);

  const handleActualizar = async () => {
    if (!editFecha) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/historial/fecha-borrado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semestre, fecha_de_borrado: editFecha })
      });
      const data = await res.json();
      if (res.ok) {
        setFechaBorrado(new Date(editFecha).toLocaleString());
        alert('Fecha de borrado actualizada');
        
        // Vuelve a obtener la fecha actualizada del backend
        obtenerFechaBorrado();
      } else {
        alert(data.message || 'Error al actualizar fecha');
      }
    } catch {
      alert('Error al actualizar fecha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', minWidth: '260px', maxWidth: '350px', flex: '1 1 320px', background: '#f9f9f9', textAlign: 'center' }}>
      <h3>Fecha de corte</h3>
      <p style={{ fontSize: '0.95em', color: '#555' }}>Semestre actual: <b>{semestre}</b></p>
      <p style={{ fontSize: '0.95em', color: '#555' }}>Hora de eliminación: 12:00am </p>
      {loading ? <p>Cargando...</p> : (
        <>
          <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{formatFechaDMY(fechaBorrado)}</p>
          <input
            type="date"
            value={editFecha}
            onChange={e => setEditFecha(e.target.value)}
            style={{ margin: '10px 0', padding: '5px', width: '80%' }}
          />
          <br />
          <button onClick={handleActualizar} disabled={!editFecha || loading} style={{ width: '120px' }}>
            Actualizar fecha
          </button>
        </>
      )}
    </div>
  );
}
