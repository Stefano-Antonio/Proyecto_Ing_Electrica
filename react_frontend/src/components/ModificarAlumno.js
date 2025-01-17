import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CrearAlumno.css";

function ModificarAlumno() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: ""
  });

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
      setForm({ nombre: "", matricula: "", correo: "", telefono: "" }); // Reset form
    } catch (error) {
      console.error("Error al agregar el alumno:", error);
      alert("Hubo un error al agregar el alumno");
    }
  };

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
            <div className="alumno-buttons">
              <button type="submit" className="button">Agregar</button>
              <button type="button" className="button">Subir base de datos de alumnos</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModificarAlumno;
