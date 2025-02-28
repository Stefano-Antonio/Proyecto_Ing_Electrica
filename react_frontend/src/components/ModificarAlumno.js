import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CrearAlumno.css";

function ModificarAlumno() {
  const navigate = useNavigate();
  const location = useLocation();
  const alumno = location.state?.alumno;
  const { matriculaTutor } = location.state || {};

  const [form, setForm] = useState({
    nombre: "",
    matricula: "",
    correo: "",
    telefono: "",
    tutor: "" // Nuevo campo para el tutor
  });

  const [tutores, setTutores] = useState([]); // Lista de tutores

  // Llenar los campos del formulario con los datos del alumno
  useEffect(() => {
    if (alumno) {
      setForm({
        nombre: alumno.nombre || "",
        matricula: alumno.matricula || "",
        correo: alumno.correo || "",
        telefono: alumno.telefono || "",
        tutor: alumno.tutor || "" // Preseleccionar el tutor si ya tiene uno
      });
    }
  }, [alumno]);

  // Obtener la lista de tutores desde la API
  useEffect(() => {
    const fetchTutores = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/coordinadores/tutores/${matriculaTutor}`);
        setTutores(response.data); // Suponiendo que la API regresa un array de objetos [{_id, nombre}]
      } catch (error) {
        console.error("Error al obtener tutores:", error);
      }
    };

    fetchTutores();
  }, []);

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
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/alumnos/${alumno._id}`,
        {
          nombre: form.nombre,
          matricula: form.matricula,
          correo: form.correo,
          telefono: form.telefono,
          tutor: form.tutor // Enviar el tutor seleccionado
        }
      );
      console.log("Alumno actualizado:", response.data);
      alert("Alumno actualizado con éxito");
      navigate(-1);
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
                <label htmlFor="telefono">Teléfono</label>
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

