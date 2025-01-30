const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materiaController');

// Rutas para importar/exportar CSV
router.post('/subir-csv', materiaController.upload.single('csv'), materiaController.subirMateriasCSV);
router.get('/exportar-csv', materiaController.exportarMateriasCSV);

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

module.exports = router;
