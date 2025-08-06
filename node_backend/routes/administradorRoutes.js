const express = require('express');
const router = express.Router();
const administradorController = require('../controllers/administradorController');
const verificarToken = require('../middlewares/authMiddleware');

// Middleware para verificar el token antes de acceder a las rutas
router.use(verificarToken);

// Ruta para obtener los alumnos de un tutor específico
router.get('/alumnos/:id', administradorController.getAlumnosAsignados);

// Ruta para obtener alumnos del administrador
router.get('/matricula/:matricula', administradorController.getAlumnosAsignadosAdmin);

// Obtener administradores
router.get('/', administradorController.getAdministradores);

// Ruta para obtener el estatus del horario
router.get('/estatus/:matricula', administradorController.getEstatusHorario);

// Ruta para traer lista de tutores disponibles
router.get('/tutores/:matricula', administradorController.getTutores);

module.exports = router;
