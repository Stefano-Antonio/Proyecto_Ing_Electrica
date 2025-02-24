const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

// Nueva ruta para obtener los alumnos asignados a un tutor
router.get('/alumnos/:matricula', docenteController.getAlumnosAsignados);

router.get('/materias/:matricula', docenteController.getMateriasAsignadas);

// Traer el horario del alumno
router.get('/horario/:matricula', docenteController.getHorarioAlumno);

// Ruta para obtener el estatus del horario
router.get('/estatus/:matricula', docenteController.getEstatusHorario);

//Ruta para actualizar el estatud de un horario
router.put('/estatus/actualizar/:matricula', docenteController.updateEstatusHorario);

//Ruta para eliminar horario de un alumno
router.delete('/eliminar/:matricula', docenteController.deleteHorarioAlumno);

//Ruta para enviar correo con comentario a alumno
router.post('/enviarCorreo', docenteController.enviarComentarioAlumno);


// Nueva ruta para obtener los alumnos inscritos en una materia específica
router.get('/materia/:materiaId/alumnos', docenteController.getAlumnosInscritosEnMateria);


module.exports = router;