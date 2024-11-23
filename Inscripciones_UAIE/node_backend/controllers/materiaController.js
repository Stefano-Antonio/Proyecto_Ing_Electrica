const Materia = require('../models/Materia');

// Crear una nueva materia
exports.createMateria = async (req, res) => {
  const { nombre, horarios, salon, cupo, docente } = req.body;
  console.log('Datos recibidos para crear la materia:', req.body);
  try {

    const docenteFinal = docente.trim() === "" ? null : docente;

    const newMateria = new Materia({ nombre, horarios, salon, cupo, docente: docenteFinal  });
    await newMateria.save();

    console.log('Materia creada:', newMateria);
    res.status(201).json(newMateria);  // Responde con la materia creada
  } catch (error) {
    console.error('Error al crear la materia:', error);
    res.status(500).json({ message: 'Error al crear la materia', error });
  }
};

// Obtener todas las materias
exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();  // Si necesitas mostrar información del docente
    console.log(materias);  // Agrega esto para ver la respuesta
    res.status(200).json(materias);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ message: 'Error al obtener materias', error });
  }
};


// Obtener una materia por ID
exports.getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id).populate('docente');
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la materia', error });
  }
};

// Actualizar una materia
exports.updateMateria = async (req, res) => {
  const { nombre, horarios, salon, cupo, docente } = req.body;
  try {
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { nombre, horarios, salon, cupo, docente },
      { new: true }
    );
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la materia', error });
  }
};

// Eliminar una materia
exports.deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(204).json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la materia', error });
  }
};
