const Alumno = require('../models/Alumno');
const bcrypt = require('bcryptjs');


// Crear un nuevo alumno
exports.createAlumno = async (req, res) => {
  console.log('Alumno:', req.body);
  const { matricula, nombre, telefono, correo } = req.body;
  try {
    const newAlumno = new Alumno({ matricula, nombre, telefono, correo });
    await newAlumno.save();
    res.status(201).json(newAlumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el alumno', error });
  }
};

// Obtener todos los alumnos
exports.getAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumnos', error });
  }
};

// Obtener un alumno por ID
exports.getAlumnoById = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error });
  }
};

// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
  const { matricula, nombre } = req.body;
  try {
    const alumno = await Alumno.findByIdAndUpdate(
      req.params.id,
      { matricula, nombre },
      { new: true }
    );
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el alumno', error });
  }
};

// Eliminar un alumno
exports.deleteAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(204).json({ message: 'Alumno eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el alumno', error });
  }
};
