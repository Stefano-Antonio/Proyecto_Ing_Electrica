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

