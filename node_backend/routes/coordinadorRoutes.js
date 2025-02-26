const express = require('express');
const router = express.Router();
const coordinadorController = require('../controllers/coordinadorController');

// Ruta para obtener los alumnos de un tutor específico
router.get('/alumnos/:id', coordinadorController.getAlumnosAsignados); 

module.exports = router;