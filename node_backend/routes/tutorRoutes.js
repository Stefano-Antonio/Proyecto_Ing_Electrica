const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const Alumno = require('../models/Alumno');
const Horario = require('../models/Horario');
const Materia = require('../models/Materia');
const verificarToken = require('../middlewares/authMiddleware');

// Middleware para verificar el token antes de acceder a las rutas
router.use(verificarToken);

// Nueva ruta para obtener los alumnos asignados a un tutor
router.get('/:matricula', tutorController.getAlumnosAsignados);

// Traer el horario del alumno
router.get('/horario/:matricula', tutorController.getHorarioAlumno);

// Ruta para obtener el estatus del horario
router.get('/estatus/:matricula', tutorController.getEstatusHorario);

//Ruta para actualizar el estatud de un horario
router.put('/estatus/actualizar/:matricula', tutorController.updateEstatusHorario);

//Ruta para actualizar el estatud de un horario
router.put('/estatus/actualizar-admin/:matricula', tutorController.updateEstatusHorarioAdmin);

//Ruta para eliminar horario de un alumno
router.delete('/eliminar/:matricula', tutorController.deleteHorarioAlumno);

//Ruta para enviar correo con comentario a alumno
router.post('/enviarCorreo', tutorController.enviarComentarioAlumno);

module.exports = router;