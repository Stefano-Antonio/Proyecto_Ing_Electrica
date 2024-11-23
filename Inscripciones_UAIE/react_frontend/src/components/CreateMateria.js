import React, { useState } from 'react';
import axios from 'axios';

const CreateMateria = () => {
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
    cupo: '',
    docente: '' // Aquí puedes colocar el ObjectId del docente si es necesario
  });

  const handleChange = (e) => {
    if (e.target.name.startsWith('horarios.')) {
      // Si el campo es parte de "horarios" (lunes, martes, etc.)
      const day = e.target.name.split('.')[1]; // Ej: "lunes"
      setFormData({
        ...formData,
        horarios: {
          ...formData.horarios,
          [day]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/materias', formData);
      alert('Materia creada con éxito');
      setFormData({
        nombre: '',
        horarios: { lunes: '', martes: '', miercoles: '', jueves: '', viernes: '' },
        salon: '',
        cupo: '',
        docente: ''
      });
    } catch (error) {
      console.error('Error al crear la materia:', error);
      alert('Hubo un error al crear la materia');
    }
  };

  return (
    <div>
      <h2>Crear Materia</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de la materia:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Salón:
          <input type="text" name="salon" value={formData.salon} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Cupo:
          <input type="number" name="cupo" value={formData.cupo} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Docente (ObjectId):
          <input type="text" name="docente" value={formData.docente} onChange={handleChange} />
        </label>
        <br />
        <h3>Horarios</h3>
        <label>
          Lunes:
          <input type="text" name="horarios.lunes" value={formData.horarios.lunes} onChange={handleChange} />
        </label>
        <br />
        <label>
          Martes:
          <input type="text" name="horarios.martes" value={formData.horarios.martes} onChange={handleChange} />
        </label>
        <br />
        <label>
          Miércoles:
          <input type="text" name="horarios.miercoles" value={formData.horarios.miercoles} onChange={handleChange} />
        </label>
        <br />
        <label>
          Jueves:
          <input type="text" name="horarios.jueves" value={formData.horarios.jueves} onChange={handleChange} />
        </label>
        <br />
        <label>
          Viernes:
          <input type="text" name="horarios.viernes" value={formData.horarios.viernes} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Crear Materia</button>
      </form>
    </div>
  );
};

export default CreateMateria;
