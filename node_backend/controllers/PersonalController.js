const Personal = require('../models/Personal');
const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');
const Administradores = require('../models/Administradores');
const bcrypt = require('bcryptjs');

exports.createPersonal = async (req, res) => {
    console.log('Personal:', req.body);
    const { matricula, nombre, password, roles, correo, telefono } = req.body;
    try {
        const newPersonal = new Personal({ matricula, nombre, password, roles, correo, telefono });
        const usuarioGuardado = await newPersonal.save();
        console.log('Usuario guardado en Personal:', usuarioGuardado);

        if (roles.includes('D')) {
            const newDocente = new Docentes({
                personalMatricula: usuarioGuardado.matricula,
                materias: [],
                alumnos: []
            });
            const docenteGuardado = await newDocente.save();
            console.log('Usuario guardado en Docentes:', docenteGuardado);
        } else if (roles.includes('T')) {
            const nuevoTutor = new Tutores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Tutor
            });
            const tutorGuardado = await nuevoTutor.save();
            console.log('Usuario guardado en Tutores:', tutorGuardado);
        } else if (roles.includes('C')) {
            const nuevoCoordinador = new Coordinadores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Coordinador
            });
            const coordinadorGuardado = await nuevoCoordinador.save();
            console.log('Usuario guardado en Coordinadores:', coordinadorGuardado);
        } else if (roles.includes('A')) {
            const nuevoAdministrador = new Administradores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Administrador
            });
            const administradorGuardado = await nuevoAdministrador.save();
            console.log('Usuario guardado en Administradores:', administradorGuardado);
        }

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        console.error('Error al crear el personal y los documentos relacionados:', error);
        res.status(500).json({ message: 'Error al crear el personal y los documentos relacionados', error });
    }
};

exports.getPersonal = async (req, res) => {
    try {
        const personal = await Personal.find();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error });
    }
};

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
