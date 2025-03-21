// Ruta para obtener el id_carrera de coordinadores, administradores y personal
const Coordinadores = require('../models/Coordinadores');
const Administradores = require('../models/Administradores');
const Personal = require('../models/Personal');

module.exports.getIdCarrera = async (req, res) => {
    const { matricula } = req.params;
    console.log("Matrícula:", matricula);
    try {
        const coordinador = await Coordinadores.findOne({ personalMatricula: matricula });
        if (coordinador) {
            console.log("Carrera encontrada:", coordinador.id_carrera);
            return res.json({ id_carrera: coordinador.id_carrera });
        }

        const administrador = await Administradores.findOne({ personalMatricula: matricula });
        if (administrador) {
            console.log("Carrera encontrada:", administrador.id_carrera);
            return res.json({ id_carrera: administrador.id_carrera });
        }

        const personal = await Personal.findOne({ matricula });
        if (personal) {
            console.log("Carrera encontrada:", personal.id_carrera);
            return res.json({ id_carrera: personal.id_carrera });
        }

        return res.status(404).json({ message: "No se encontró el usuario" });
    } catch (error) {
        return res.status(500).json({ message: "Error del servidor", error });
    }
};
