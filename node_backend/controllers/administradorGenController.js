// Ruta para obtener el id_carrera de coordinadores, administradores y personal
const Coordinadores = require('../models/Coordinadores');
const Alumnos = require('../models/Alumno');
const Administradores = require('../models/Administradores');
const Personal = require('../models/Personal');
const Tutores = require('../models/Tutores');
const Docentes = require('../models/Docentes');


// obtener el id_carrera del personal
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


// Ruta para obtener tutores
module.exports.getTutores = async (req, res) => {
    console.log("Obteniendo tutores");
    try {
        const personal = await Personal.find({});
        
        // Filtrar los perfiles que solo tengan roles T (Tutores), D (Directores), C (Coordinadores), A (Administradores) o CG (Coordinadores Generales)
        const filteredTutors = personal.filter(p => 
            p.roles.some(role => ['T', 'D', 'C', 'A', 'CG'].includes(role))
        );
        
        console.log("Tutores encontrados:", filteredTutors);
        return res.json({ tutors: filteredTutors }); // Devolver un objeto con la propiedad 'tutors'
    } catch (error) {
        console.error("Error al obtener tutores:", error);
        return res.status(500).json({ message: "Error del servidor", error });
    }
};
