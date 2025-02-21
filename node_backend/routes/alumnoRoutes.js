const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumnoController'); // Asegúrate de que esta ruta es válida
const upload = alumnoController.upload;

// Ruta para exportar a CSV (debe ir antes de las rutas dinámicas)
router.get('/exportar-csv', alumnoController.exportarAlumnosCSV);

router.post('/subir-csv', upload.single('csv'), alumnoController.subirAlumnosCSV);


// Rutas para las operaciones CRUD
router.post('/', alumnoController.createAlumno);
router.get('/', alumnoController.getAlumnos);
router.get('/:id', alumnoController.getAlumnoById);
router.get('/matricula/:matricula', alumnoController.getAlumnosAsignados); 
router.get('/:id', alumnoController.getAlumnoByIdWithHorario);
router.put('/:id', alumnoController.updateAlumno);
router.delete('/:id', alumnoController.deleteAlumno);

module.exports = router;
