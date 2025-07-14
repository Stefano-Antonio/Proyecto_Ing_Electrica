import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearMateria.css";

function CrearMateria() {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [file, setFile] = useState(null); // Almacenar el archivo CSV
  const id_carrera = localStorage.getItem("id_carrera");
  const [formData, setFormData] = useState({
    id_materia: '',
    nombre: '',
    horarios: {
      lunes: '',
      martes: '',
      miercoles: '',
      jueves: '',
      viernes: '',
      sabado: ''
    },
    semi: '',
    salon: '',
    grupo: '',
    cupo: '',
    laboratorio: false,
    docente: '' // Aquí puedes colocar el ObjectId del docente si es necesario
  });

  

  const carrerasPermitidasSemiescolarizadas = ['ISftwS', 'IDsrS', 'IEIndS', 'ICmpS', 'IRMcaS', 'IElecS'];

  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/docentes");
        setDocentes(response.data); // Guardamos la lista de docentes con el nombre incluido
      } catch (error) {
        console.error("Error al obtener los docentes:", error);
      }
    };

    fetchDocentes();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Guarda el archivo CSV seleccionado
  };

  const handleSubmitCSV = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warn("Por favor selecciona un archivo CSV");
      return;
    }

    console.log("📁 Archivo seleccionado:", file);

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/materias/subir-csv-por-carrera?id_carrera=${id_carrera}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message || "Base de datos actualizada con éxito desde el archivo CSV");
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al subir el archivo CSV:", error);

      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error al subir el archivo CSV";

      toast.error(`❌ ${mensaje}`);
    }
  };


  

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/materias/exportar-csv-por-carrera?id_carrera=${id_carrera}`, // Solo descarga materias de la carrera
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `materias_${id_carrera}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo CSV:", error);
      toast.error("No se pudo descargar el archivo");
    }
  };

  

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (["lunes", "martes", "miercoles", "jueves", "viernes","sabado"].includes(id)) {
      // Si el cambio es en los horarios, actualiza solo esa clave dentro de horarios
      setFormData((prevState) => ({
        ...prevState,
        horarios: {
          ...prevState.horarios,
          [id]: value, // Actualiza el día correspondiente
        },
      }));
    } else {
      // Si es otro campo, actualiza normalmente
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!id_carrera) {
        alert("Error: No se encontró el ID de la carrera.");
        return;
      }

      // Reemplaza valores vacíos en horarios con null
      const finalData = {
        ...formData,
        id_carrera, // Incluir el ID de carrera
        horarios: Object.fromEntries(
          Object.entries(formData.horarios).map(([key, value]) => [key, value === "" ? null : value])
        )
      };

      const response = await axios.post('http://localhost:5000/api/materias', finalData);
      console.log("Materia actualizada:", response.data);
      toast.success('Materia creada con éxito');
      setFormData({
        id_materia: '',
        nombre: '',
        horarios: { lunes: '', martes: '', miercoles: '', jueves: '', viernes: '', sabado: '' },
        salon: '',
        semi: '',
        grupo: '',
        cupo: '',
        laboratorio: '',
        docente: ''
      });
    } catch (error) {
      console.error('Error al crear la materia:', error);
      toast.error('Hubo un error al crear la materia');
    }
  };
    
  const isSemiescolarizada = carrerasPermitidasSemiescolarizadas.includes(id_carrera);

  return (
    <div className="materia-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="materia-container">
        <div className="top-left">
          <button className="back-button" onClick={handleBack}>Regresar</button>
        </div>
        <div className="top-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <h1>Agregar materia</h1>
        <div className="materia-content">
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="id_materia">ID de materia</label>
                <input
                  type="text"
                  id="id_materia"
                  placeholder="ID de la materia"
                  value={formData.id_materia}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-wrapper short-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre de la materia"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="salon">Salón</label>
                <input
                  type="text"
                  id="salon"
                  placeholder="Ingresar el salón"
                  value={formData.salon}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="cupo">Cupo</label>
                <input
                  type="text"
                  id="cupo"
                  placeholder="Cupo de materia"
                  value={formData.cupo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-wrapper short-field">
                <label htmlFor="grupo">Grupo</label>
                <input
                  type="text"
                  id="grupo"
                  placeholder="Grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="docente">Docente</label>
                <select id="docente" value={formData.docente} onChange={handleChange} required>
                  <option value="" disabled hidden>Seleccione un docente</option>
                  {docentes.map(docente => (
                    <option key={docente.personalMatricula} value={docente.personalMatricula}>
                      {docente.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-wrapper short-field3">
                <label htmlFor="laboratorio">Laboratorio</label>
                <select id="laboratorio" value={formData.laboratorio || "false"} onChange={handleChange} required>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="form-group">
        {!isSemiescolarizada && (
            <>
                <div className="input-wrapper short-field">
                    <label htmlFor="lunes">Lunes</label>
                    <select id="lunes" value={formData.horarios.lunes} onChange={handleChange}>
                        <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:30-9:30">7:30-9:30</option>
                       <option value="10:00-12:00">10:00-12:00</option>
                       <option value="12:00-14:00">12:00-14:00</option>
                       <option value="14:00-16:00">14:00-16:00</option>
                       <option value="16:00-18:00">16:00-18:00</option>
                       <option value="18:00-20:00">18:00-20:00</option>
               </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="martes">Martes</label>
                    <select id="martes" value={formData.horarios.martes} onChange={handleChange}>
                        <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:30-9:30">7:30-9:30</option>
                       <option value="10:00-12:00">10:00-12:00</option>
                       <option value="12:00-14:00">12:00-14:00</option>
                       <option value="14:00-16:00">14:00-16:00</option>
                       <option value="16:00-18:00">16:00-18:00</option>
                       <option value="18:00-20:00">18:00-20:00</option>
               </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="miercoles">Miércoles</label>
                    <select id="miercoles" value={formData.horarios.miercoles} onChange={handleChange}>
                        <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:30-9:30">7:30-9:30</option>
                       <option value="10:00-12:00">10:00-12:00</option>
                       <option value="12:00-14:00">12:00-14:00</option>
                       <option value="14:00-16:00">14:00-16:00</option>
                       <option value="16:00-18:00">16:00-18:00</option>
                       <option value="18:00-20:00">18:00-20:00</option>
               </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="jueves">Jueves</label>
                    <select id="jueves" value={formData.horarios.jueves} onChange={handleChange}>
                        <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:30-9:30">7:30-9:30</option>
                       <option value="10:00-12:00">10:00-12:00</option>
                       <option value="12:00-14:00">12:00-14:00</option>
                       <option value="14:00-16:00">14:00-16:00</option>
                       <option value="16:00-18:00">16:00-18:00</option>
                       <option value="18:00-20:00">18:00-20:00</option>
               </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="viernes">Viernes</label>
                    <select id="viernes" value={formData.horarios.viernes} onChange={handleChange}>
                        <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:30-9:30">7:30-9:30</option>
                       <option value="10:00-12:00">10:00-12:00</option>
                       <option value="12:00-14:00">12:00-14:00</option>
                       <option value="14:00-16:00">14:00-16:00</option>
                       <option value="16:00-18:00">16:00-18:00</option>
                       <option value="18:00-20:00">18:00-20:00</option>
               </select>
                </div>
            </>
        )}

        {isSemiescolarizada && (
           
           <>
           <div className="input-wrapper short-field">
               <label htmlFor="viernes">Viernes</label>
               <select id="viernes" value={formData.horarios.viernes} onChange={handleChange}required>
                   <option value="" disabled hidden>Seleccione...</option>
                   <option value="">-</option>
                       <option value="7:00-14:00">7:00-14:00</option>
                       <option value="7:00-15:00">7:00-15:00</option>
                       <option value="14:00-20:00">14:00-20:00</option>
                       <option value="14:00-21:00">14:00-21:00</option>
                       <option value="15:00-20:00">15:00-20:00</option>
                       <option value="15:00-21:00">15:00-21:00</option>
               </select>
           </div>
            <div className="input-wrapper short-field">
                <label htmlFor="sabado">Sábado</label>
                <select id="sabado" value={formData.horarios.sabado} onChange={handleChange}required>
                    <option value="" disabled hidden>Seleccione...</option>
                    <option value="">-</option>
                       <option value="7:00-14:00">7:00-14:00</option>
                       <option value="7:00-15:00">7:00-15:00</option>
                       <option value="14:00-20:00">14:00-20:00</option>
                       <option value="14:00-21:00">14:00-21:00</option>
                       <option value="15:00-20:00">15:00-20:00</option>
                       <option value="15:00-21:00">15:00-21:00</option>
                </select>
            </div>

            <div className="input-wrapper short-field">
            <label htmlFor="semi">Par-Impar</label>
            <select id="semi" value={formData.semi} onChange={handleChange} required>
              <option value="" disabled hidden>Seleccione paridad</option>
              <option value="par">Par</option>
              <option value="impar">Impar</option>
            </select>
          </div>
          </>

        )}


            </div>
            <div className="materia-buttons">
              <button type="submit" className="button">Agregar</button>
            </div>
          </form>
          <div className="materia-buttons">
            <button className="button" onClick={() => setMostrarModal(true)}>Subir base de datos de materias</button>
          </div>
        </div>
      </div>
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Subir base de datos</h3>
            <p>Seleccione el archivo a subir:</p>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleSubmitCSV}>Subir CSV</button>
            <button onClick={handleDownloadCSV}>Descargar CSV</button>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearMateria;