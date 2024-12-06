const express = require('express');
const router = express.Router();
const personalController = require('../controllers/PersonalController');

router.post('/', personalController.createPersonal);

router.get('/', personalController.getPersonal);

router.get('/:id', personalController.getPersonalById);

router.put('/:id', personalController.updatePersonal);

router.delete('/:id', personalController.deletePersonal);

module.exports = router;