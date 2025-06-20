const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Administradores = require('../models/Administradores');
const Personal = require('../models/Personal');
const Alumno = require('../models/Alumno');
const Materia = require('../models/Materia');

// Ruta para obtener los alumnos de un tutor específico
exports.getAlumnosAsignados = async (req, res) => {
  const { id } = req.params;
  console.log('ID de la persona:', id);
  try {
    const persona = await Personal.findOne({ _id: id });
    if (persona) {
      console.log('Persona encontrada'+ persona.nombre);
      return res.json({ nombre: persona.nombre });
    }
    console.log('ID no encontrado');
    res.status(404).json({ message: 'ID no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el ID', error: error.message });
  }
};

exports.getAlumnosAsignadosAdmin = async (req, res) => {
  const { matricula } = req.params;
  console.log("Matrícula del administrador:", matricula);
  try {
    const administrador = await Administradores.findOne({ personalMatricula: matricula });
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    const alumnos = administrador.alumnos || [];
    console.log("Alumnos encontrados:", alumnos);
    res.status(200).json({ alumnos });
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ message: "Error al obtener alumnos", error: error.message });
  }
};

exports.getAdministradores = async (req, res) => {
    try {
        const administradores = await Administradores.find();
        const administradoresConNombre = await Promise.all(administradores.map(async (administrador) => {
            const personal = await Personal.findOne({ matricula: administrador.personalMatricula });
            return {
                ...administrador.toObject(),
                nombre: personal ? personal.nombre : "Sin asignar"
            };
        }));
        res.status(200).json(administradoresConNombre);
    } catch (error) {
        console.error("Error al obtener administradores:", error);
        res.status(500).json({ message: "Error al obtener administradores", error });
    }
};

exports.getEstatusHorario = async (req, res) => {
    try {
        const { matricula } = req.params;
        console.log('Obteniendo el estatus del horario para matrícula:', matricula);
        const alumno = await Alumno.findOne({ matricula }).populate('horario');
        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }
        if (!alumno.horario) {
            return res.json({ estatus: "En espera" });
        }
        const estatusHorario = alumno.horario.estatus;
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

exports.getTutores = async (req, res) => {
  try {
    const { matricula } = req.params;
    console.log("Matrícula del administrador:", matricula);
    const administrador = await Administradores.findOne({ personalMatricula: matricula }).select("id_carrera");
    if (!administrador) {
      return res.status(404).json({ message: "Administrador no encontrado" });
    }
    console.log("ID de carrera del administrador:", administrador.id_carrera);
    const alumnos = await Alumno.find({ id_carrera: administrador.id_carrera }).select("_id");
    const alumnosIds = alumnos.map(alumno => alumno._id);
    console.log("Alumnos en la carrera:", alumnosIds);
    const materias = await Materia.find({ id_carrera: administrador.id_carrera }).select("_id");
    const materiasIds = materias.map(materia => materia._id);
    console.log("Materias en la carrera:", materiasIds);
    const docentesPorAlumnos = await Docentes.find({ alumnos: { $in: alumnosIds } }).select("personalMatricula");
    const docentesPorMaterias = await Docentes.find({ materias: { $in: materiasIds } }).select("personalMatricula");
    console.log("Docentes encontrados:", [...docentesPorAlumnos, ...docentesPorMaterias]);
    const docentes = [...docentesPorAlumnos, ...docentesPorMaterias].reduce((acc, docente) => {
      if (!acc.some(d => d.personalMatricula === docente.personalMatricula)) {
        acc.push(docente);
      }
      return acc;
    }, []);
    const tutores = await Tutores.find({ alumnos: { $in: alumnosIds } }).select("personalMatricula");
    console.log("Tutores encontrados:", tutores.map(t => t.personalMatricula));
    const personalMatriculasSet = new Set([
      ...docentes.map(d => d.personalMatricula),
      ...tutores.map(t => t.personalMatricula)
    ]);
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
