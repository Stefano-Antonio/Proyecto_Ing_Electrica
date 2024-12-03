import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AlumnoList = () => {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/alumnos')
      .then(response => {
        console.log(response.data); // Verificar los datos recibidos
        setAlumnos(response.data);
      })
      .catch(error => console.error('Error al obtener alumnos:', error));
  }, []);
  

  return (
    <div>
      <h2>Lista de Alumnos</h2>
      <ul>
        {alumnos.map(alumno => (
          <li key={alumno._id}>
            {alumno.nombre} - {alumno.matricula}
          </li>
        ))}
      </ul>
    </div>
  );
};



export default AlumnoList;