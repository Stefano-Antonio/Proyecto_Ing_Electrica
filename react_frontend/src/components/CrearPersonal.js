import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearPersonal.css";

function CrearPersonal() {
  const [mostrarModal, setMostrarModal] = useState(false); // Controlar el modal
  const [file, setFile] = useState(null); // Almacenar el archivo CSV
  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: "",
    roles: [],
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/personal", form);
      console.log("Usuario agregado:", response.data);
      toast.success("Usuario agregado con éxito");
      setForm({ nombre: "", matricula: "", correo: "", telefono: "", roles: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      toast.error("Hubo un error al agregar el usuario");
    }
  };

  const handleBack = () => { 
    navigate(-1); // Navegar a la página anterior 
    };

    const handleLogout = () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userType");
      navigate("/");
    };

    //CSV
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
          "http://localhost:5000/api/personal/subir-csv",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
    
        alert("Base de datos actualizada con éxito desde el archivo CSV");
        setMostrarModal(false);
      } catch (error) {
        console.error("Error al subir el archivo CSV:", error);
        alert("Hubo un error al actualizar la base de datos");
      }
    };

    const handleSumbitDB = async (e) => {
      setMostrarModal(true);
        return;
    };
    
    const handleDownloadCSV = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/personal/exportar-csv",
          { responseType: "blob" } // Asegurar que se reciba como blob
        );
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "personal.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error al descargar el archivo CSV:", error);
        alert("No se pudo descargar el archivo");
      }
    };
    
    

  return (
    <div className="persona1-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="persona1-container">
      <div className="top-left"> 
          <button className="back-button" onClick={handleBack}>Regresar</button> 
        </div>
      <div className="top-right"> 
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button> 
        </div>
        <h1>Agregar personal</h1>
        <div className="persona1-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del personal"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="matricula">ID del usuario</label>
                <input
                  type="text"
                  id="matricula"
                  placeholder="Ingresar el ID de usuario"
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
            <div className="form-group">
              <div className="input-wrapper short-field">
                <label htmlFor="roles">Permisos</label>
                <select id="roles" value={form.roles} onChange={handleChange} required>
                    <option value="" disabled hidden>Seleccione...</option>
                    <option value="D">Docente</option>
                    <option value="T">Tutor</option>
                    <option value="C">Coordinador</option>
                    <option value="A">Administrador</option>
                </select>
              </div>
              <div className="input-wrapper short-field2">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  value={form.password}
                  onChange={handleChange}
                />
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

            <div className="persona1-buttons">
              <button type="submit" className="button">Agregar</button>
              <button className="button" onClick={handleSumbitDB}>Subir base de datos de personal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearPersonal;
