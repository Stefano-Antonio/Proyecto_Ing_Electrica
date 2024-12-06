const Docente = require('../models/Docente');
const Personal = require('../models/Personal');

// Crear un docente
exports.createDocente = async (req, res) => {
    const { matricula, nombre, password, materias } = req.body;
    try {
        // Crear primero el registro en Personal
        const personal = new Personal({
            matricula,
            nombre,
            password,
            roles: ['D'] // Docente
        });
        await personal.save();

        // Crear el registro específico de Docente
        const docente = new Docente({
            personal: personal._id,
            materias
        });
        await docente.save();

        res.status(201).json({ personal, docente });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el docente', error });
    }
};

// Obtener todos los docentes
exports.getDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find().populate('personal');
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los docentes', error });
    }
};