const express = require('express');
const router = express.Router();
const materiaSemiController = require('../controllers/MateriaSemiController');

// Rutas para importar/exportar CSV
router.post('/subir-csv', materiaSemiController.upload.single('csv'), materiaSemiController.subirMateriasCSV);
router.get('/exportar-csv', materiaSemiController.exportarMateriasCSV);

// NUEVAS RUTAS: Importar/exportar CSV POR CARRERA
router.post('/subir-csv-por-carrera', materiaSemiController.upload.single('csv'), materiaSemiController.subirMateriasCSVPorCarrera);
router.get('/exportar-csv-por-carrera', materiaSemiController.exportarMateriasCSVPorCarrera);

// Ruta para crear una nueva materia
router.post('/', materiaSemiController.createMateria);

// Ruta para obtener todas las materias pares
router.get('/par', materiaSemiController.getMateriasP);

// Ruta para obtener una materia par por su ID
router.get('/par/:id', materiaSemiController.getMateriaPById);

// Ruta para obtener materias par por id_carrera
router.get('/par/carrera/:id_carrera', materiaSemiController.getMateriasPByCarreraId);

// Ruta para obtener todas las materias impares
router.get('/impar', materiaSemiController.getMateriasI);

// Ruta para obtener una materia impar por su ID
router.get('/impar/:id', materiaSemiController.getMateriaIById);

// Ruta para obtener materias impar por id_carrera
router.get('/impar/carrera/:id_carrera', materiaSemiController.getMateriasIByCarreraId);

// Ruta para actualizar una materia
router.put('/:id', materiaSemiController.updateMateria);

// Ruta para eliminar una materia
router.delete('/:id', materiaSemiController.deleteMateria);

module.exports = router;
