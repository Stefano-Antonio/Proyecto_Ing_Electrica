const express = require('express');
const router = express.Router();
const coordinadorGenController = require('../controllers/coordinadorGenController');

// Ruta para sacar el id carrera de coordinadores y administradores
router.get('/carrera/:matricula', coordinadorGenController.getIdCarrera);

module.exports = router;