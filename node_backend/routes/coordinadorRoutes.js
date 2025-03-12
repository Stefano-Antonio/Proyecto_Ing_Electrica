const express = require('express');
const router = express.Router();
const coordinadorController = require('../controllers/coordinadorController');

// Ruta para obtener los alumnos de un tutor específico
router.get('/alumnos/:id', coordinadorController.getAlumnosAsignados); 

//Ruta para obtener alumnos del coordinador
router.get('/matricula/:matricula', coordinadorController.getAlumnosAsignadosCord);

//obtener coordinadores
router.get('/', coordinadorController.getCoordinadores);

// Ruta para obtener el estatus del horario
router.get('/estatus/:matricula', coordinadorController.getEstatusHorario);

//Ruta para traer lista de tutores disponibles
router.get('/tutores/:matricula', coordinadorController.getTutores);


module.exports = router;