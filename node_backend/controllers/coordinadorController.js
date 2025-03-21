const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');

const Personal = require('../models/Personal');
const Alumno = require('../models/Alumno');
const Materia = require('../models/Materia');

// Ruta para obtener los alumnos de un tutor específico
exports.getAlumnosAsignados = async (req, res) => {
  const { id } = req.params;
  console.log('ID de la persona:', id);
  try {
    // Buscar en la colección de Coordinadores
    const persona = await Personal.findOne({ _id: id });
    if (persona) {
      console.log('Persona encontrada'+ persona.nombre);
      return res.json({ nombre: persona.nombre });
    }

    console.log('ID no encontrado');
    // Si no se encuentra en ninguna colección
    res.status(404).json({ message: 'ID no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el ID', error: error.message });
  }
};

exports.getAlumnosAsignadosCord = async (req, res) => {
  const { matricula } = req.params;
  console.log("Matrícula del coordinador:", matricula);
  try {
    // Buscar en la colección de Coordinadores
    const coordinador = await Coordinadores.findOne({ personalMatricula: matricula });

    if (!coordinador) {
      return res.status(404).json({ message: "Coordinador no encontrado" });
    }

    // Buscar alumnos de la carrera del coordinador
    const alumnos = coordinador.alumnos || []; // Evitar que sea undefined
    console.log("Alumnos encontrados:", alumnos);

    // Enviar como objeto con la clave "alumnos"
    res.status(200).json({ alumnos });
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ message: "Error al obtener alumnos", error: error.message });
  }
};


exports.getCoordinadores = async (req, res) => {
    try {
        const coordinadores = await Coordinadores.find();
        const coordinadoresConNombre = await Promise.all(coordinadores.map(async (coordinador) => {
            const personal = await Personal.findOne({ matricula: coordinador.personalMatricula });
            return {
                ...coordinador.toObject(),
                nombre: personal ? personal.nombre : "Sin asignar"
            };
        }));

        res.status(200).json(coordinadoresConNombre);
    } catch (error) {
        console.error("Error al obtener coordinadores:", error);
        res.status(500).json({ message: "Error al obtener coordinadores", error });
    }
};


// Ruta para obtener el estatus del horario
exports.getEstatusHorario = async (req, res) => {
    try {
        const { matricula } = req.params;
        console.log('Obteniendo el estatus del horario para matrícula:', matricula);

        // Buscar al alumno por su matrícula
        const alumno = await Alumno.findOne({ matricula }).populate('horario');

        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        // Si no tiene horario, el estatus es "En espera"
        if (!alumno.horario) {
            return res.json({ estatus: "En espera" });
        }

        // Obtener el estatus del horario
        const estatusHorario = alumno.horario.estatus;

        // Mapear el número del estatus a su significado
        let estatusTexto = "Desconocido";
        switch (estatusHorario) {
            case 0:
                estatusTexto = "Falta de revisar";
                break;
            case 1:
                estatusTexto = "Revisado";
                break;
        }

        res.json({ estatus: estatusTexto });

    } catch (error) {
        console.error("Error al obtener el estatus del horario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Ruta para traer lista de tutores, docentes, coordinadores y administradores disponibles
exports.getTutores = async (req, res) => {
  try {
    const { matricula } = req.params;
    console.log("Matrícula del coordinador:", matricula);

    // Buscar el coordinador y obtener el id_carrera
    const coordinador = await Coordinadores.findOne({ personalMatricula: matricula }).select("id_carrera");
    if (!coordinador) {
      return res.status(404).json({ message: "Coordinador no encontrado" });
    }

    console.log("ID de carrera del coordinador:", coordinador.id_carrera);

    // Obtener alumnos de la carrera
    const alumnos = await Alumno.find({ id_carrera: coordinador.id_carrera }).select("_id");
    const alumnosIds = alumnos.map(alumno => alumno._id);

    console.log("Alumnos en la carrera:", alumnosIds);

    // Obtener materias de la carrera
    const materias = await Materia.find({ id_carrera: coordinador.id_carrera }).select("_id");
    const materiasIds = materias.map(materia => materia._id);

    console.log("Materias en la carrera:", materiasIds);

    // Buscar todos los docentes existentes
    const docentes = await Docentes.find().select("personalMatricula");

    console.log("Docentes encontrados:", docentes.map(d => d.personalMatricula));
    // Buscar todos los tutores existentes
    const tutores = await Tutores.find().select("personalMatricula");

    console.log("Tutores encontrados:", tutores.map(t => t.personalMatricula));

    // Buscar coordinadores y administradores de la carrera
    const [coordinadores,] = await Promise.all([
      Coordinadores.find({ id_carrera: coordinador.id_carrera }).select("personalMatricula")
    ]);

    console.log("Coordinadores encontrados:", coordinadores.map(c => c.personalMatricula));

    // Unir todas las matrículas en un Set para evitar duplicados
    const personalMatriculasSet = new Set([
      ...docentes.map(d => d.personalMatricula),
      ...tutores.map(t => t.personalMatricula),
      ...coordinadores.map(c => c.personalMatricula)
    ]);

    // Convertir el Set a Array y buscar los datos completos del personal
    const personalMatriculas = Array.from(personalMatriculasSet);

    if (personalMatriculas.length === 0) {
      return res.status(404).json({ message: "No hay personal en esta carrera" });
    }

    console.log("Personal encontrado (sin duplicados):", personalMatriculas);

    const personal = await Personal.find({ matricula: { $in: personalMatriculas } });

    res.status(200).json(personal);
  } catch (error) {
    console.error("Error en getPersonalByCarrera:", error);
    res.status(500).json({ message: "Error al obtener personal", error: error.message });
  }
};

