const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Alumno = require('../models/Alumno');
const Personal = require('../models/Personal');

// Ruta de inicio de sesión para alumnos
router.post('/alumno/login', async (req, res) => {
  const { matricula } = req.body;
  try {
    const alumno = await Alumno.findOne({ matricula }).populate('horario');  // Asegúrate de hacer el populate;
    if (!alumno) {
      return res.status(400).json({ mensaje: 'Alumno no encontrado' });
    }

    // Verifica si tiene un horario
    const tieneHorario = alumno.horario !== null;
    const validacionCompleta = alumno.horario?.validacionCompleta || false;

    const token = jwt.sign({ id: alumno._id }, 'tu_secreto', { expiresIn: '10m' });
    
    return res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      nombre: alumno.nombre,
      id: alumno._id,
      token,
      horario: alumno.horario, // Incluye el horario en la respuesta
      //tieneHorario,
      validacionCompleta // Se envía al frontend para tomar decisiones de redirección
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});

// Ruta de inicio de sesión para personal
router.post('/personal/login', async (req, res) => {
  const { matricula, password } = req.body;

  if (!matricula || !password) {
    return res.status(400).json({ mensaje: 'Matrícula y contraseña son obligatorias' });
  }

  try {
    // Busca el usuario en la base de datos
    const personal = await Personal.findOne({ matricula });
    if (!personal) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    const passwordValido = password === personal.password; // Comparación directa
    // Si usas hashing, utiliza:
     //const passwordValido = await bcrypt.compare(password, personal.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      nombre: personal.nombre,
      roles: personal.roles,
      token: 'mock-token', // Genera un token real si usas JWT
    });
  } catch (error) {
    console.error('Error en loginPersonal:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;