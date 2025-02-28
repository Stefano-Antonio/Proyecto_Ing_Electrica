const express = require('express');
const router = express.Router();
const coordinadorController = require('../controllers/coordinadorController');

// Ruta para obtener los alumnos de un tutor específico
router.get('/alumnos/:id', coordinadorController.getAlumnosAsignados); 

// Ruta para obtener el estatus del horario
router.get('/estatus/:matricula', coordinadorController.getEstatusHorario);


module.exports = router;