const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

router.post('/', docenteController.createDocente);

router.get('/', docenteController.getDocentes);

router.get('/:id', docenteController.getDocenteById);

router.put('/:id', docenteController.updateDocente);

router.delete('/:id', docenteController.deleteDocente);