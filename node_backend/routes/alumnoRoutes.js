const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController'); // Asegúrate de que esta ruta es válida
const upload = alumnoController.upload;

// Ruta para exportar a CSV (debe ir antes de las rutas dinámicas)
router.get('/exportar-csv', alumnoController.exportarAlumnosCSV);

router.post('/subir-csv', upload.single('csv'), alumnoController.subirAlumnosCSV);

// Ruta para exportar alumnos por carrera a CSV
router.get('/exportar-csv/carrera/:id_carrera', alumnoController.exportarAlumnosCSVPorCarrera);

// Ruta para subir alumnos por carrera desde CSV
router.post('/subir-csv/carrera/:id_carrera', upload.single('csv'), alumnoController.subirAlumnosCSVPorCarrera);

// Ruta para exportar alumnos por carrera filtrados a CSV
router.post('/exportar-csv/carrera-filtrados/:id_carrera', alumnoController.exportarAlumnosCSVPorCarreraFiltrados);


// Rutas para las operaciones CRUD
router.post('/', alumnoController.createAlumno);
router.get('/', alumnoController.getAlumnos);
router.get('/:id', alumnoController.getAlumnoById);
router.get('/matricula/:matricula', alumnoController.getAlumnosAsignados); 
router.get('/carrera/:matricula', alumnoController.getAlumnosCarrera);
router.get('/carrera-admin/:matricula', alumnoController.getAlumnosCarreraAdmin);
router.get('/horario/:id', alumnoController.getAlumnoByIdWithHorario);
router.put('/:id', alumnoController.updateAlumno);
router.put('/horario/:id', alumnoController.updateAlumnoHorario);
router.delete('/:id', alumnoController.deleteAlumno);
router.get('/estatus/:matricula', alumnoController.getEstatusHorario);

module.exports = router;
