const express = require('express');
const router = express.Router();
const Materia = require('../models/Materia'); // Ajusta la ruta al modelo Materia
const Docente = require('../models/Docente');  // Ajusta la ruta al modelo Docente
const Tutor = require('../models/Tutor');      // Ajusta la ruta al modelo Tutor
const Coordinador = require('../models/Coordinador'); // Ajusta la ruta al modelo Coordinador
const Administrador = require('../models/Administrador'); // Ajusta la ruta al modelo Administrador

// Crear una nueva materia
router.post('/materias', async (req, res) => {
  try {
    const materia = new Materia(req.body);
    await materia.save();
    res.status(201).json(materia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todas las materias
router.get('/materias', async (req, res) => {
  try {
    const materias = await Materia.find().populate('docente');
    res.status(200).json(materias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una materia por su ID
router.get('/materias/:id', async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id).populate('docente');
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar una materia
router.put('/materias/:id', async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una materia
router.delete('/materias/:id', async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json({ message: 'Materia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Personal---------------------------------------------------------------------------

const Docente = require('../models/Docente');  // Ajusta la ruta al modelo Docente
const Tutor = require('../models/Tutor');      // Ajusta la ruta al modelo Tutor
const Coordinador = require('../models/Coordinador'); // Ajusta la ruta al modelo Coordinador
const Administrador = require('../models/Administrador'); // Ajusta la ruta al modelo Administrador

// Crear un docente
router.post('/docentes', async (req, res) => {
  try {
    const docente = new Docente(req.body);
    await docente.save();
    res.status(201).json(docente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Crear un tutor
router.post('/tutores', async (req, res) => {
  try {
    const tutor = new Tutor(req.body);
    await tutor.save();
    res.status(201).json(tutor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Crear un coordinador
router.post('/coordinadores', async (req, res) => {
  try {
    const coordinador = new Coordinador(req.body);
    await coordinador.save();
    res.status(201).json(coordinador);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Crear un administrador
router.post('/administradores', async (req, res) => {
  try {
    const administrador = new Administrador(req.body);
    await administrador.save();
    res.status(201).json(administrador);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los docentes
router.get('/docentes', async (req, res) => {
  try {
    const docentes = await Docente.find().populate('materias');
    res.status(200).json(docentes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los tutores
router.get('/tutores', async (req, res) => {
  try {
    const tutores = await Tutor.find();
    res.status(200).json(tutores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los coordinadores
router.get('/coordinadores', async (req, res) => {
  try {
    const coordinadores = await Coordinador.find();
    res.status(200).json(coordinadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los administradores
router.get('/administradores', async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json(administradores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todo el personal
router.get('/personal', async (req, res) => {
  try {
    console.log('Ruta /personal fue alcanzada');  // Log para verificar que la ruta se alcanzó

    // Obtener todos los docentes, tutores, coordinadores y administradores
    const docentes = await Docente.find().populate('materias').populate('alumnos');
    console.log('Docentes obtenidos:', docentes); // Log para verificar los datos de los docentes

    const tutores = await Tutor.find().populate('alumnos');
    console.log('Tutores obtenidos:', tutores); // Log para verificar los datos de los tutores

    const coordinadores = await Coordinador.find().populate('alumnos');
    console.log('Coordinadores obtenidos:', coordinadores); // Log para verificar los datos de los coordinadores

    const administradores = await Administrador.find();
    console.log('Administradores obtenidos:', administradores); // Log para verificar los datos de los administradores

    // Crear un arreglo que combine todos los tipos de personal
    const personal = [
      ...docentes.map(docente => ({
        ...docente.toObject(),
        roles: ['Docente'],
        programa: 'PR',
      })),
      ...tutores.map(tutor => ({
        ...tutor.toObject(),
        roles: ['Tutor'],
        programa: 'PR',
      })),
      ...coordinadores.map(coordinador => ({
        ...coordinador.toObject(),
        roles: ['Coordinador'],
        programa: 'PR',
      })),
      ...administradores.map(administrador => ({
        ...administrador.toObject(),
        roles: ['Administrador'],
        programa: 'PR',
      })),
    ];

    // Log para verificar los datos combinados
    console.log('Personal combinado:', personal);

    // Responder con los datos de todo el personal
    res.status(200).json(personal);
  } catch (error) {
    console.error('Error fetching personal data:', error); // Log en caso de error
    res.status(500).json({ message: 'Error fetching personal data' });
  }
});




//Alumnos--------------------------------------------------------
const Alumno = require('../models/Alumno'); // Ajusta la ruta al modelo Alumno

// Crear un nuevo alumno
router.post('/alumnos', async (req, res) => {
  try {
    const alumno = new Alumno(req.body);
    await alumno.save();
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los alumnos
router.get('/alumnos', async (req, res) => {
  try {
    const alumnos = await Alumno.find().populate('horario tutor');
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un alumno por su ID
router.get('/alumnos/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id).populate('horario tutor');
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un alumno
router.put('/alumnos/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un alumno
router.delete('/alumnos/:id', async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json({ message: 'Alumno eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;