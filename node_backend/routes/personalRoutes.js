const express = require('express');
const router = express.Router();
const personalController = require('../controllers/PersonalController');

// Rutas para importar/exportar CSV
router.post('/subir-csv', personalController.upload.single('csv'), personalController.subirPersonalCSV);
router.get('/exportar-csv', personalController.exportarPersonalCSV);

//Rutas para importar/exportar CSV por carrera
router.get("/exportar-csv/carrera/:id_carrera", personalController.exportarPersonalCSVPorCarrera);
router.post("/subir-csv/carrera/:id_carrera", personalController.upload.single("csv"), personalController.subirPersonalCSVPorCarrera);
router.post("/exportar-csv/filtrados", personalController.exportarCSVPersonalFiltrado);
router.post('/exportar-csv/carrera-filtrados/:id_carrera', personalController.exportarCSVPorCarreraFiltrado);



router.post('/', personalController.createPersonal);
router.get('/', personalController.getPersonal);
router.get('/:id', personalController.getPersonalById);
router.put('/:id', personalController.updatePersonal);
router.get('/carrera/:matricula', personalController.getPersonalByCarrera);
router.delete('/:id', personalController.deletePersonal);
router.delete('/coordinador', personalController.deletePersonalCord);
router.get('/password/:matricula', personalController.getPassword);




module.exports = router;
