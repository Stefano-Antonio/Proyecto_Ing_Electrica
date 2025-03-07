import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CrearAlumno.css";

function CrearAlumno() {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tutores, setTutores] = useState([]); // Lista de tutores
  const location = useLocation();
  const { matriculaCord } = location.state || {};
  const [file, setFile] = useState(null); // Estado para el archivo
  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: "",
    tutor: "", // Nuevo campo para el tutor
    matriculaCord: matriculaCord
  });

  console.log("Matricula del tutor:", matriculaCord);

  // Obtener la lista de tutores desde la API
  useEffect(() => {
    const fetchTutores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/coordinadores/tutores/${(matriculaCord)}`);
        setTutores(response.data); // Suponiendo que la API regresa un array de objetos [{_id, nombre}]
      } catch (error) {
        console.error("Error al obtener tutores:", error);
      }
    };

    fetchTutores();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Guarda el archivo CSV
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
      const response = await axios.post(
        "http://localhost:5000/api/alumnos/subir-csv",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Base de datos actualizada con éxito desde el archivo CSV");

      setMostrarModal(false); // Cierra el modal después de subir el archivo
    } catch (error) {
      console.error("Error al subir el archivo CSV:", error);
      alert("Hubo un error al actualizar la base de datos");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    navigate("/");
  }

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/alumnos", form);
      console.log("Alumno agregado:", response.data);
      alert("Alumno agregado con éxito");
      setForm({ nombre: "", matricula: "", correo: "", telefono: "", tutor: "" }); // Reset form
      navigate(-1); // Regresar a la página anterior
    } catch (error) {
      console.error("Error al agregar el alumno:", error);
      alert("Hubo un error al agregar el alumno");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/alumnos/exportar-csv",
        {
          responseType: "blob", // Asegúrate de recibir el archivo como blob
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "alumnos.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo CSV:", error);
      alert("No se pudo descargar el archivo");
    }
  };

  const handleSumbitDB = async (e) => {
    setMostrarModal(true);
    return;
  }

  return (
    <div className="alumno-layout">
      <div className="alumno-container">
        <div className="top-left"> 
          <button className="back-button" onClick={handleBack}>Regresar</button> 
        </div>
        <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h1>Agregar alumno</h1>
        <div className="alumno-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del alumno"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="matricula">Matricula</label>
                <input
                  type="text"
                  id="matricula"
                  placeholder="Ingresar la matricula"
                  value={form.matricula}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  placeholder="alguien@example.com"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="telefono">Telefono</label>
                <input
                  type="text"
                  id="telefono"
                  placeholder="000-000-0000"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Nuevo campo para seleccionar el tutor */}
            <div className="form-group">
              <div className="input-wrapper">
                <label htmlFor="tutor">Tutor</label>
                <select id="tutor" value={form.tutor} onChange={handleChange}>
                  <option value="">Selecciona un tutor</option>
                  {tutores.map((tutor) => (
                    <option key={tutor._id} value={tutor._id}>
                      {tutor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {mostrarModal && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Subir base de datos</h3>
                  <p>Seleccione el archivo a subir:</p>
                  <ul>
                  </ul>
                  <p>
                  </p>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                  <button onClick={handleSubmitCSV}>Subir CSV</button>
                  <button onClick={handleDownloadCSV}>Descargar CSV</button>
                  <button onClick={() => setMostrarModal(false)}>Cerrar</button>
                </div>
              </div>
            )}
            <div className="alumno-buttons">
              <button type="submit" className="button">Agregar</button>
              <button type="button" className="button" onClick={handleSumbitDB}>Subir base de datos de alumnos</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearAlumno;