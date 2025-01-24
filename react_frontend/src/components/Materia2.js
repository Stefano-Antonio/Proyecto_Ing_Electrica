import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CrearMateria.css";

function Materia2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id.startsWith('horarios-')) {
          const day = id.split('-')[1]; // Ej: "lunes"
          setFormData({
            ...formData,
            horarios: {
              ...formData.horarios,
              [day]: value
            }
          });
        } else {
          setFormData({
            ...formData,
            [id]: value
          });
        }
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
          const response = await axios.post('http://localhost:5000/api/materias', formData);
          alert('Materia creada con éxito');
          setFormData({
            nombre: '',
            horarios: { lunes: '', martes: '', miercoles: '', jueves: '', viernes: '' },
            salon: '',
            grupo: '',
            cupo: '',
            docente: ''
          });
        } catch (error) {
          console.error('Error al crear la materia:', error);
          alert('Hubo un error al crear la materia');
        }
      };


  return (
    <div className="materia-layout">
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
                <input
                  type="text"
                  id="docente"
                  placeholder="Ingrese el docente"
                  value={formData.docente}
                  onChange={handleChange}
                />
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
            <div className="materia-buttons">
              <button type="submit" className="button">Agregar</button>
              <button type="button" className="button">Subir base de datos de materias</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Materia2;
