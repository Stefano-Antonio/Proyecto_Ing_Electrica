const fs = require('fs');
const csv = require('csv-parser');
const Materia = require('../models/Materia');

// Crear una nueva materia
exports.createMateria = async (req, res) => {
  const { id_materia, nombre, horarios, salon, grupo, cupo, docente } = req.body;
  console.log('Datos recibidos para crear la materia:', req.body);
  try {

    const docenteFinal = docente.trim() === "" ? null : docente;

    const newMateria = new Materia({ id_materia, nombre, horarios, salon, grupo, cupo, docente: docenteFinal  });
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
  const { nombre, horarios, salon, grupo, cupo, docente } = req.body;
  try {
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { nombre, horarios, salon, grupo, cupo, docente },
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

exports.uploadCSV = async (req, res) => {
  try {
    const filePath = req.file.path; // Ruta del archivo subido
    const materias = [];

    // Leer y procesar el archivo CSV
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          // Buscar el docente si es necesario
          const docenteEncontrado = row['ID_DOCENTE']
            ? await Docente.findOne({ nombre: row['ID_DOCENTE'] })
            : null;

          // Crear un objeto Materia para cada fila del CSV
          const materia = {
            nombre: row['MATERIA'],
            grupo: row['GRUPO'],
            salon: row['SALON'],
            cupo: parseInt(row['CUPO'], 10),
            docente: docenteEncontrado ? docenteEncontrado._id : null,
            horarios: {
              lunes: row['LUNES'] || null,
              martes: row['MARTES'] || null,
              miercoles: row['MIERCOLES'] || null,
              jueves: row['JUEVES'] || null,
              viernes: row['VIERNES'] || null,
              sabado: row['SABADO'] || null,
            },
          };

          materias.push(materia);
        } catch (error) {
          console.error(`Error al procesar la fila: ${JSON.stringify(row)}. Error: ${error.message}`);
        }
      })
      .on('end', async () => {
        try {
          // Guardar todas las materias en MongoDB
          await Materia.insertMany(materias);
          res.status(201).json({ message: 'Materias subidas exitosamente' });
        } catch (err) {
          console.error('Error al guardar las materias:', err);
          res.status(500).json({ message: 'Error al guardar las materias', error: err });
        } finally {
          // Eliminar el archivo temporal
          fs.unlinkSync(filePath);
        }
      });
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar el archivo', error: err });
  }
};