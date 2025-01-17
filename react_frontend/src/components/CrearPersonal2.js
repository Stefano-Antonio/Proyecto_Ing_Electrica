import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "./CrearPersonal.css";

function CrearPersonal2() {
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
      alert("Usuario agregado con éxito");
      setForm({ nombre: "", matricula: "", correo: "", telefono: "", roles: "", password: "" }); // Reset form
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      alert("Hubo un error al agregar el usuario");
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

  return (
    <div className="persona1-layout">
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
            <div className="persona1-buttons">
              <button type="submit" className="button">Agregar</button>
              <button type="button" className="button">Subir base de datos de personal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearPersonal2;
