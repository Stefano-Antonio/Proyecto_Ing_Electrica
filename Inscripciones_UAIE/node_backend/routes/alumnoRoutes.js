const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController');

// Ruta para crear un nuevo alumno
router.post('/', alumnoController.createAlumno);

// Ruta para obtener todos los alumnos
router.get('/', alumnoController.getAlumnos);

// Ruta para obtener un alumno por su ID
router.get('/:id', alumnoController.getAlumnoById);

// Ruta para actualizar un alumno por su ID
router.put('/:id', alumnoController.updateAlumno);

// Ruta para eliminar un alumno por su ID
router.delete('/:id', alumnoController.deleteAlumno);

module.exports = router;