import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ModificarMateria.css";

function ModificarMateriaCG() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_materia: "",
    nombre: "",
    cupo: "",
    docente: ""
  });

  const location = useLocation();
  const materia = location.state?.materia || {};

  useEffect(() => {
    if (materia) {
      setFormData({
        id_materia: materia.id_materia || "",
        nombre: materia.nombre || "",
        cupo: materia.cupo || "",
        docente: materia.docente || ""
      });
    }
  }, [materia]);

  const [docentes, setDocentes] = useState([]);
  

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/docentes");
        setDocentes(response.data);
      } catch (error) {
        console.error("Error al obtener los docentes:", error);
      }
    };
    fetchDocentes();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/materias/${materia._id}`, formData);
      toast.success("Materia actualizada con éxito");
      navigate(-1);
    } catch (error) {
      console.error("Error al actualizar la materia:", error);
      toast.error("Hubo un error al actualizar la materia");
    }
  };

  return (
    <div className="materia-cg-layout">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="materia-cg-container">
        <button className="back-button" onClick={() => navigate(-1)}>Regresar</button>
        <h1>Modificar Materia de Cultura General</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id_materia">ID de Materia</label>
            <input type="text" id="id_materia" value={formData.id_materia} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cupo">Cupo</label>
            <input type="number" id="cupo" value={formData.cupo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="docente">Docente</label>
            <select id="docente" value={formData.docente} onChange={handleChange} required>
              <option value="" disabled hidden>Seleccione un docente</option>
              {docentes.map((docente) => (
                <option key={docente._id} value={docente._id}>{docente.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="button">Actualizar</button>
        </form>
      </div>
    </div>
  );
}

export default ModificarMateriaCG;
