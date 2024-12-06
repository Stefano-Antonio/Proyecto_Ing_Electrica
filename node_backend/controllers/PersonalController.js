const Personal = require('../models/Personal');
const bcrypt = require('bcryptjs');

exports.createPersonal = async (req, res) => {
    console.log('Personal:', req.body);
    const { matricula, nombre, password, roles, correo, telefono } = req.body;
    try {
      const newPersonal = new Personal({ matricula, nombre, password, roles, correo, telefono });
      await newPersonal.save();
      res.status(201).json(newPersonal);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el personal', error });
    }
};

// Obtener todos los docentes
exports.getPersonal = async (req, res) => {
    try {
      const personal = await Personal.find();
      res.status(200).json(personal);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener personal', error });
    }
};

// Obtener un docente por ID
exports.getPersonalById = async (req, res) => {
    try {
      const personal = await Personal.findById(req.params.id);
      if (!personal) {
        return res.status(404).json({ message: 'Personal no encontrado' });
      }
      res.status(200).json(personal);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el personal', error });
    }
};

// Actualizar un docente
exports.updatePersonal = async (req, res) => {
    const { roles } = req.body;
    try {
      const personal = await Personal.findByIdAndUpdate(
        req.params.id,
        { roles },
        { new: true }
      );
      if (!personal) {
        return res.status(404).json({ message: 'Personal no encontrado' });
      }
      res.status(200).json(personal);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el personal', error });
    }
};

// Eliminar un docente
exports.deletePersonal = async (req, res) => {
    try {
      const personal = await Personal.findByIdAndDelete(req.params.id);
      if (!personal) {
        return res.status(404).json({ message: 'Personal no encontrado' });
      }
      res.status(204).json({ message: 'Personal eliminado' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el personal', error });
    }
};
