const express = require('express');
const router = express.Router();
const administradorGenController = require('../controllers/coordinadorGenController');
const verificarToken = require('../middlewares/authMiddleware');

// Middleware para verificar el token antes de acceder a las rutas
router.use(verificarToken);

// Ruta para sacar el id carrera de coordinadores y administradores
router.get('/carrera/:matricula', administradorGenController.getIdCarrera);

// Ruta para obtener tutores
router.get('/tutores', administradorGenController.getTutores);

module.exports = router;