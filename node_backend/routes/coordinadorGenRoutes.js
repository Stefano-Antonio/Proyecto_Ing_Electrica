const express = require('express');
const router = express.Router();
const coordinadorGenController = require('../controllers/coordinadorGenController');

// Ruta para sacar el id carrera de coordinadores y administradores
router.get('/carrera/:matricula', coordinadorGenController.getIdCarrera);

// Ruta para crear alumnos
router.post('/alumnos', coordinadorGenController.createAlumno);

// Ruta para crear actualizar alumnos
router.put('/alumnos/:id', coordinadorGenController.updateAlumno);

// Ruta para obtener tutores
router.get('/tutores', coordinadorGenController.getTutores);

module.exports = router;