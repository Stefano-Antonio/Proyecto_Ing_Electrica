const Alumno = require('../models/Alumno');
const Horario = require('../models/Horario');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Configurar multer para manejar el archivo CSV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // El archivo se guardará en la carpeta "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombrar el archivo con el timestamp
  },
});

const upload = multer({ storage: storage });

exports.upload = upload;


// Crear un nuevo alumno
exports.createAlumno = async (req, res) => {
  console.log('Alumno:', req.body);
  const { matricula, nombre, telefono, correo } = req.body;
  try {
    const newAlumno = new Alumno({ matricula, nombre, telefono, correo });
    await newAlumno.save();
    res.status(201).json(newAlumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el alumno', error });
  }
};

// Obtener todos los alumnos
exports.getAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumnos', error });
  }
};

// Obtener un alumno por ID
exports.getAlumnoById = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error });
  }
};

// Obtener los datos de un alumno, incluyendo su horario
exports.getAlumnoByIdWithHorario = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id).populate('horario');
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno con horario', error });
  }
};



// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
  const { matricula, nombre, correo, telefono, materiasSeleccionadas } = req.body;

  try {
    let horarioGuardado = null;

    // Solo se actualizan las materias si están en req.body
    if (materiasSeleccionadas && Array.isArray(materiasSeleccionadas) && materiasSeleccionadas.length > 0) {
      // Crear un nuevo documento de Horario con los IDs de las materias seleccionadas
      const nuevoHorario = new Horario({
        materias: materiasSeleccionadas.map(materia => materia._id), // Guardamos solo los IDs de las materias
      });

      // Guardar el horario en la base de datos
      horarioGuardado = await nuevoHorario.save();
    }

    // Actualizar el alumno con los nuevos datos y el ID del horario (si se generó)
    const alumno = await Alumno.findByIdAndUpdate(
      req.params.id,
      {
        matricula,
        nombre,
        correo,
        telefono,
        ...(horarioGuardado ? { horario: horarioGuardado._id } : {}) // Solo incluye el horario si se guardó uno
      },
      { new: true }
    );

    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    res.status(200).json(alumno);
  } catch (error) {
    console.error('Error al actualizar el alumno:', error);
    res.status(500).json({ message: 'Error al actualizar el alumno', error });
  }
};



// Eliminar un alumno
exports.deleteAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(204).json({ message: 'Alumno eliminado' });
  } catch (error) {
    
    res.status(500).json({ message: 'Error al eliminar el alumno', error });
  }
};


// Subir datos desde CSV a la base de datos
exports.subirAlumnosCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha enviado ningún archivo CSV' });
  }

  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        const matriculasCSV = results.map((alumno) => alumno.matricula); // Guardamos solo las matrículas del CSV

        for (const alumnoData of results) {
          const { matricula, nombre, telefono, correo } = alumnoData;

          // Busca y actualiza, si no existe lo crea
          await Alumno.findOneAndUpdate(
            { matricula }, // Busca por matrícula
            { nombre, telefono, correo }, // Actualiza estos campos
            { upsert: true, new: true } // upsert: true -> crea si no existe
          );
        }

        // Eliminar registros de la BD que ya no estén en el CSV
        await Alumno.deleteMany({ matricula: { $nin: matriculasCSV } });

        fs.unlinkSync(req.file.path); // Eliminar el archivo una vez procesado
        res.status(200).json({ message: 'Base de datos actualizada con éxito desde el archivo CSV' });

      } catch (error) {
        console.error('Error al procesar el CSV:', error);
        res.status(500).json({ message: 'Error al actualizar la base de datos desde el CSV', error });
      }
    })
    .on('error', (err) => {
      console.error('Error al leer el CSV:', err);
      res.status(500).json({ message: 'Error al procesar el archivo CSV', error: err });
    });
};

exports.exportarAlumnosCSV = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); // Obtén todos los alumnos
    const fields = ['matricula', 'nombre', 'telefono', 'correo']; // Campos del CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(alumnos);

    res.header('Content-Type', 'text/csv');
    res.attachment('alumnos.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error al exportar a CSV', error });
  }
};
