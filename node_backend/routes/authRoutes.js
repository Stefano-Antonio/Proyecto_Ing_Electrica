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

    const token = jwt.sign({ id: alumno._id }, 'tu_secreto', { expiresIn: '10m' });
    
    return res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
});


router.post('/personal/login', async (req, res) => {
  const { matricula, password } = req.body; // Obtener matrícula y contraseña del cuerpo de la solicitud

  console.log("Solicitud recibida en /personal/login"); // Log inicial
  console.log("Cuerpo de la solicitud recibido:", req.body); // Mostrar los datos enviados

  // Verificar que se hayan enviado la matrícula y la contraseña
  if (!matricula || !password) {
    console.error("Faltan datos: matrícula o contraseña no proporcionados.");
    return res.status(400).json({ mensaje: 'Matrícula y contraseña son obligatorios' });
  }

  try {
    console.log('Matrícula y contraseña recibidos:', matricula, password); // Log de credenciales recibidas

    // Lista de modelos a verificar para determinar el tipo de usuario
    const models = [
      { name: "Docente", model: Docente },
      { name: "Tutor", model: Tutor },
      { name: "Coordinador", model: Coordinador },
      { name: "Administrador", model: Administrador },
    ];

    let personal = null; // Variable para almacenar al usuario encontrado
    let tipo = null;     // Variable para almacenar el tipo de usuario

    // Iterar sobre los modelos para buscar al usuario
    for (const { name, model } of models) {
      console.log(`Buscando en el modelo: ${name} con matrícula: ${matricula}`);
      personal = await model.findOne({ matricula }); // Buscar el usuario por matrícula
      if (personal) {
        console.log(`Usuario encontrado en el modelo ${name}:`, personal);
        tipo = name; // Asignar el tipo de usuario si se encuentra
        break;       // Salir del bucle si el usuario fue encontrado
      }
    }

    // Si no se encontró al usuario en ninguno de los modelos
    if (!personal) {
      console.warn("Usuario no encontrado en ninguno de los modelos.");
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log("Usuario encontrado, verificando contraseña...");
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña almacenada:", personal.password);

    // Verificar si la contraseña ingresada coincide con la almacenada (encriptada)
    const isMatch = await bcrypt.compare(password, personal.password);
    console.log("Resultado de la comparación de contraseñas:", isMatch);

    if (!isMatch) {
      console.warn("Contraseña inválida para la matrícula proporcionada.");
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar un token JWT para la sesión
    console.log("Generando token JWT...");
    const token = jwt.sign(
      { id: personal._id }, // Información del usuario para incluir en el token
      process.env.JWT_SECRET || 'clave_por_defecto', // Clave secreta para firmar el token
      { expiresIn: '1h' }   // Tiempo de expiración del token
    );
    console.log("Token generado exitosamente:", token);

    // Log para verificar que se detectó el tipo de usuario correctamente
    console.log("Tipo detectado:", tipo);

    // Enviar una respuesta exitosa con el tipo de usuario y el token
    console.log("Enviando respuesta de éxito...");
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      tipo,  // Enviar el tipo de usuario como respuesta
      token, // Token para la autenticación
    });

  } catch (error) {
    // Capturar y manejar errores
    console.error("Error al iniciar sesión:", error.message); // Log del error
    return res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message, // Enviar el mensaje de error para depuración
    });
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
