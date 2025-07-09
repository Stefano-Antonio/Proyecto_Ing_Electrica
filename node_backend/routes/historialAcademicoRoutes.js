const express = require('express');
const router = express.Router();
const historialAcademicoController = require('../controllers/historialAcademicoController');

// Ruta para generar historial académico
router.post('/generar', historialAcademicoController.generarHistorial);

// Ruta para listar historiales académicos
router.get('/', historialAcademicoController.listarHistoriales);

// Rutas para vaciar toda la base de datos
router.delete('/vaciar-materias', historialAcademicoController.vaciarMaterias);
router.delete('/vaciar-alumnos', historialAcademicoController.vaciarAlumnos);
router.delete('/vaciar-personal', historialAcademicoController.vaciarPersonal);

// Actualizar la fecha de borrado de un historial académico
router.put('/fecha-borrado', historialAcademicoController.actualizarFechaBorrado);

// Obtener la fecha de borrado de un historial académico
router.get('/fecha-borrado', historialAcademicoController.obtenerFechaBorrado);

module.exports = router;