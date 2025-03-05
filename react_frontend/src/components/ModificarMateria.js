import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearMateria.css";

function ModificarMateria() {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [file, setFile] = useState(null); // Almacenar el archivo CSV
  const [formData, setFormData] = useState({
      id_materia: '',
      nombre: '',
      horarios: {
        lunes: '',
        martes: '',
        miercoles: '',
        jueves: '',
        viernes: ''
      },
      salon: '',
      grupo: '',
      cupo: '',
      docente: '' // Aquí puedes colocar el ObjectId del docente si es necesario
    });

    const location = useLocation();
    const materia = location.state?.materia || {};

      // Llenar los campos del formulario con los datos del alumno
      useEffect(() => {
        if (materia) {
          console.log("Datos de la materia recibidos:", materia); // Agregar console.log aquí
          setFormData({
            id_materia: materia.id_materia || "",
            nombre: materia.nombre || "",
            salon: materia.salon || "",
            grupo: materia.grupo || "",
            cupo: materia.cupo || "",
            docente: materia.docente || "",
            horarios: {
                lunes: materia.horarios.lunes || "",
                martes: materia.horarios.martes || "",
                miercoles: materia.horarios.miercoles || "",
                jueves: materia.horarios.jueves || "",
                viernes: materia.horarios.viernes || ""
            }
          });
        }
      }, [materia]);

      // Dentro del componente CrearMateria
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
        alert("Por favor selecciona un archivo CSV");
        return;
      }
    
      const formData = new FormData();
      formData.append("csv", file);
    
      try {
        await axios.post(
          "http://localhost:5000/api/materias/subir-csv", // Cambiar la URL a 'materias'
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
    
        alert("Base de datos de materias actualizada con éxito desde el archivo CSV");
        setMostrarModal(false);
      } catch (error) {
        console.error("Error al subir el archivo CSV:", error);
        alert("Hubo un error al actualizar la base de datos");
      }
    };
    
    const handleDownloadCSV = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/materias/exportar-csv", // Cambiar la URL a 'materias'
          { responseType: "blob" }
        );
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "materias.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error al descargar el archivo CSV:", error);
        alert("No se pudo descargar el archivo");
      }
    };
    
      

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  }

    const getDocenteNombre = (materia) => {
    return materia && materia.docenteNombre ? materia.docenteNombre : "Sin asignar";
  };



  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
    }

    const handleChange = (e) => {
      const { id, value } = e.target;

      if (id.startsWith("horarios-")) {
    const dia = id.split("-")[1]; // Extrae el día del ID (ejemplo: horarios-lunes → lunes)
    setFormData((prevFormData) => ({
      ...prevFormData,
      horarios: {
        ...prevFormData.horarios,
        [dia]: value,
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


    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const materiaActualizada = {
          nombre: formData.nombre,
          horarios: formData.horarios,
          salon: formData.salon,
          grupo: formData.grupo,
          cupo: formData.cupo,
          docente: formData.docente 
        };
    
        const response = await axios.put(`http://localhost:5000/api/materias/${materia._id}`, materiaActualizada);
        console.log("Materia actualizada:", response.data);
        toast.success("Materia actualizada con éxito");
      } catch (error) {
        console.error("Error al actualizar la materia:", error);
        toast.error("Hubo un error al actualizar la materia");
      }
    };
    

    


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
        <h1>Modificar materia</h1>
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
                  <option value="">-</option>
                  {docentes.map(docente => (
                    <option key={docente._id} value={docente.personalMatricula}>
                      {docente.nombre}  {/* Mostramos nombre + matrícula */}
                    </option>
                  ))}
                </select>
              </div>
              
            </div>
            <div className="form-group">
                <div className="input-wrapper short-field">
                    <label htmlFor="lunes">Lunes</label>
                    <select
                        id="horarios-lunes"
                        value={formData.horarios.lunes}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Seleccione...</option>
                        <option value="">-</option>
                        <option value="7:00-8:30">7:00-8:30</option>
                        <option value="8:30-10:00">8:30-10:00</option>
                        <option value="10:00-11:30">10:00-11:30</option>
                        <option value="11:30-13:00">11:30-13:00</option>
                        <option value="13:00-14:30">13:00-14:30</option>
                        <option value="14:30-16:00">14:30-16:00</option>
                    </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="martes">Martes</label>
                    <select
                        id="horarios-martes"
                        value={formData.horarios.martes}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Seleccione...</option>
                        <option value="">-</option>
                        <option value="7:00-8:30">7:00-8:30</option>
                        <option value="8:30-10:00">8:30-10:00</option>
                        <option value="10:00-11:30">10:00-11:30</option>
                        <option value="11:30-13:00">11:30-13:00</option>
                        <option value="13:00-14:30">13:00-14:30</option>
                        <option value="14:30-16:00">14:30-16:00</option>
                    </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="miercoles">Miercoles</label>
                    <select
                        id="horarios-miercoles"
                        value={formData.horarios.miercoles}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Seleccione...</option>
                        <option value="">-</option>
                        <option value="7:00-8:30">7:00-8:30</option>
                        <option value="8:30-10:00">8:30-10:00</option>
                        <option value="10:00-11:30">10:00-11:30</option>
                        <option value="11:30-13:00">11:30-13:00</option>
                        <option value="13:00-14:30">13:00-14:30</option>
                        <option value="14:30-16:00">14:30-16:00</option>
                    </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="jueves">Jueves</label>
                    <select
                        id="horarios-jueves"
                        value={formData.horarios.jueves}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Seleccione...</option>
                        <option value="">-</option>
                        <option value="7:00-8:30">7:00-8:30</option>
                        <option value="8:30-10:00">8:30-10:00</option>
                        <option value="10:00-11:30">10:00-11:30</option>
                        <option value="11:30-13:00">11:30-13:00</option>
                        <option value="13:00-14:30">13:00-14:30</option>
                        <option value="14:30-16:00">14:30-16:00</option>
                    </select>
                </div>

                <div className="input-wrapper short-field">
                    <label htmlFor="viernes">Viernes</label>
                    <select
                        id="horarios-viernes"
                        value={formData.horarios.viernes}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Seleccione...</option>
                        <option value="">-</option>
                        <option value="7:00-8:30">7:00-8:30</option>
                        <option value="8:30-10:00">8:30-10:00</option>
                        <option value="10:00-11:30">10:00-11:30</option>
                        <option value="11:30-13:00">11:30-13:00</option>
                        <option value="13:00-14:30">13:00-14:30</option>
                        <option value="14:30-16:00">14:30-16:00</option>
                    </select>
                </div>     
            </div>
            {mostrarModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Subir base de datos</h3>
                  <p>Seleccione el archivo a subir:</p>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                  <button onClick={() => handleSubmitCSV}>Subir CSV</button>
                  <button onClick={() => handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              </div>
            )}
            <div className="materia-buttons">
                <button type="submit" className="button">Agregar</button>
                <button 
                  type="button"  // Se agrega este atributo para evitar que dispare el submit
                  className="button" 
                  onClick={() => setMostrarModal(true)}
                >
                  Subir base de datos de materias
                </button>
              </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ModificarMateria;
