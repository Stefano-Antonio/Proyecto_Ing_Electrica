const express = require('express');
const router = express.Router();
const historialAcademicoController = require('../controllers/historialAcademicoController');

// Ruta para generar historial académico
router.post('/generar', historialAcademicoController.generarHistorial);

// Ruta para listar historiales académicos
router.get('/', historialAcademicoController.listarHistoriales);

module.exports = router;