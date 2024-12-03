const Docente = require('../models/Docentes');
const bcrypt = require('bcryptjs');

exports.createDocente = async (req, res) => {
    console.log('Docente:', req.body);
    const { nombre, matricula, password } = req.body;
    try {
      const newDocente = new Docente({ nombre, matricula, password });
      await newDocente.save();
      res.status(201).json(newDocente);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el docente', error });
    }
  };
  
  // Obtener todos los docentes
  exports.getDocentes = async (req, res) => {
    try {
      const docentes = await Docente.find();
      res.status(200).json(docentes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener docentes', error });
    }
  };
  
  // Obtener un docente por ID
  exports.getDocenteById = async (req, res) => {
    try {
      const docente = await Docente.findById(req.params.id);
      if (!docente) {
        return res.status(404).json({ message: 'Docente no encontrado' });
      }
      res.status(200).json(docente);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el docente', error });
    }
  };
  
  // Actualizar un docente
  exports.updateDocente = async (req, res) => {
    const { nombre, matricula, password } = req.body;
    try {
      const docente = await Docente.findByIdAndUpdate(
        req.params.id,
        { nombre, matricula, password },
        { new: true }
      );
      if (!docente) {
        return res.status(404).json({ message: 'Docente no encontrado' });
      }
      res.status(200).json(docente);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el docente', error });
    }
  };
  
  // Eliminar un docente
  exports.deleteDocente = async (req, res) => {
    try {
      const docente = await Docente.findByIdAndDelete(req.params.id);
      if (!docente) {
        return res.status(404).json({ message: 'Docente no encontrado' });
      }
      res.status(204).json({ message: 'Docente eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el docente', error });
    }
  };