const Docente = require('../models/Docentes');
const Personal = require('../models/Personal');

// Crear un docente
exports.createDocente = async (req, res) => {
    const { matricula, nombre, password, materias, alumnos } = req.body;

    try {
        // Crear entrada en el modelo Personal con el rol 'Docente'
        const personal = new Personal({
            matricula,
            nombre,
            password,
            roles: ['D'] // Rol de Docente
        });
        await personal.save();

        // Crear entrada en el modelo Docente
        const docente = new Docente({
            personal: personal._id, // Relación con Personal
            materias: materias || [],
            alumnos: alumnos || []
        });
        await docente.save();

        res.status(201).json({ message: 'Docente creado exitosamente', docente });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el docente', error });
    }
};

// Obtener todos los docentes
exports.getDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find().populate('personal').populate('materias').populate('alumnos');
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los docentes', error });
    }
};

// Actualizar un docente
exports.updateDocente = async (req, res) => {
    const { materias, alumnos } = req.body;

    try {
        const docente = await Docente.findById(req.params.id);

        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }

        // Actualizar materias y alumnos si se proporcionan
        if (materias) docente.materias = materias;
        if (alumnos) docente.alumnos = alumnos;

        await docente.save();

        res.status(200).json({ message: 'Docente actualizado exitosamente', docente });
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

        // Eliminar también su registro en Personal
        await Personal.findByIdAndDelete(docente.personal);

        res.status(200).json({ message: 'Docente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el docente', error });
    }
};