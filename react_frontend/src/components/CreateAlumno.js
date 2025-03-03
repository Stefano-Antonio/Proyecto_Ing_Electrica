import React, { useState } from 'react';
import axios from 'axios';

const matriculaTutor = localStorage.getItem("matriculaTutor");
console.log("matriculaTutor:", matriculaTutor);

const CreateAlumno = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = { ...formData, tutor: matriculaTutor };
      const response = await axios.post('http://localhost:5000/api/alumnos', newFormData);
      alert('Alumno creado con éxito');
      setFormData({ nombre: '', matricula: '' });
    } catch (error) {
      console.error('Error al crear alumno:', error);
      alert('Hubo un error al crear el alumno');
    }
  };

  return (
    <div>
      <h2>Crear Alumno</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Matrícula:
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Crear Alumno</button>
      </form>
    </div>
  );
};

export default CreateAlumno;
