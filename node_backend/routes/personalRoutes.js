const express = require('express');
const router = express.Router();
const personalController = require('../controllers/PersonalController');

// Rutas para importar/exportar CSV
router.post('/subir-csv', personalController.upload.single('csv'), personalController.subirPersonalCSV);
router.get('/exportar-csv', personalController.exportarPersonalCSV);
router.post('/', createPersonal);
router.get('/', getPersonal);
router.get('/:id', getPersonalById);
router.put('/:id', updatePersonal);
router.get('/carrera/:matricula', getPersonalByCarrera);
router.delete('/:id', deletePersonal);


export default router;
