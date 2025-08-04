const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Alumno = require('../models/Alumno');
const Personal = require('../models/Personal');
const Coordinador = require('../models/Coordinadores');
const Docente = require('../models/Docentes');
const Tutor = require('../models/Tutores');
const Administrador = require('../models/Administradores');

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

    // 🔐 Generar token JWT real
    const token = jwt.sign(
      {
        id: alumno._id,
        matricula: alumno.matricula,
        rol: 'alumno'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    return res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      id_carrera: alumno.id_carrera,
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
    // const passwordValido = await bcrypt.compare(password, personal.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Buscar en los diferentes modelos para obtener el id_carrera
    let id_carrera = null;

    const coordinador = await Coordinador.findOne({ personalMatricula: matricula });
    if (coordinador) {
      id_carrera = coordinador.id_carrera;
    } else {
      const docente = await Docente.findOne({ personalMatricula: matricula });
      if (docente) {
        id_carrera = docente.id_carrera;
      } else {
        const tutor = await Tutor.findOne({ personalMatricula: matricula });
        if (tutor) {
          id_carrera = tutor.id_carrera;
        } else {
          const administrador = await Administrador.findOne({ personalMatricula: matricula });
          if (administrador) {
            id_carrera = administrador.id_carrera;
          }
        }
      }
    }

    // 🔐 Generar token JWT
    const token = jwt.sign(
      {
        id: personal._id,
        matricula: personal.matricula,
        roles: personal.roles,
        id_carrera: id_carrera
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Respuesta exitosa
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      nombre: personal.nombre,
      matricula: personal.matricula,
      roles: personal.roles,
      id_carrera: id_carrera,
      token: 'mock-token' // Genera un token real si usas JWT
    });
  } catch (error) {
    console.error('Error en loginPersonal:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;