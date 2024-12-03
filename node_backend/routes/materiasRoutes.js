const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const materiaController = require('../controllers/materiaController');
const upload = multer({ dest: 'uploads/' }); // Configura dónde se guardarán los archivos temporales

// Ruta para crear una nueva materia
router.post('/', materiaController.createMateria);

// Ruta para obtener todas las materias
router.get('/', materiaController.getMaterias);

// Ruta para obtener una materia por su ID
router.get('/:id', materiaController.getMateriaById);

// Ruta para actualizar una materia
router.put('/:id', materiaController.updateMateria);

// Ruta para eliminar una materia
router.delete('/:id', materiaController.deleteMateria);

// Ruta para subir archivo csv
router.post('/upload', upload.single('file'), materiaController.uploadCSV);

module.exports = router;
