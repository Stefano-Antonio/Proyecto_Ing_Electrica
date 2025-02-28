const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');
const Personal = require('../models/Personal');
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

