// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Alumno = require('../models/Alumno');
const User = require('../models/User');

// Ruta de inicio de sesión para alumnos
router.post('/alumno/login', async (req, res) => {
  const { matricula } = req.body;
  try {
    const alumno = await Alumno.findOne({ matricula });
    if (!alumno) {
      return res.status(400).json({ mensaje: 'Alumno no encontrado' });
    }

    const token = jwt.sign({ id: alumno._id }, 'tu_secreto', { expiresIn: '1h' });
    return res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});

// Ruta de inicio de sesión para personal
router.post('/usuario/login', async (req, res) => {
  const { matricula, password } = req.body;
  try {
    const usuario = await User.findOne({ matricula });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario._id }, 'tu_secreto', { expiresIn: '1h' });
    return res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});

module.exports = router;
