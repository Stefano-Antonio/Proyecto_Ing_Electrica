import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CrearAlumno.css";

function ModificarAlumno() {
  const navigate = useNavigate();
  const location = useLocation(); // Obtén el estado pasado desde el componente anterior
  const alumno = location.state?.alumno; // Asegúrate de manejar casos donde el estado sea nulo

  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: ""
  });

  // Llenar los campos del formulario con los datos del alumno
  useEffect(() => {
    if (alumno) {
      setForm({
        nombre: alumno.nombre || "",
        matricula: alumno.matricula || "",
        correo: alumno.correo || "",
        telefono: alumno.telefono || ""
      });
    }
  }, [alumno]);

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
  };

  const handleBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar la actualización a la API
      const response = await axios.put(`http://localhost:5000/api/alumnos/${alumno._id}`, form);
      console.log("Alumno actualizado:", response.data);
      alert("Alumno actualizado con éxito");
      navigate(-1); // Navegar de regreso a la lista
    } catch (error) {
      console.error("Error al actualizar el alumno:", error);
      alert("Hubo un error al actualizar el alumno");
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
        <h1>Modificar Alumno</h1>
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
                  //readOnly // Solo lectura si no se puede modificar la matrícula
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
              <button type="submit" className="button">Actualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModificarAlumno;
