const { Parser } = require('json2csv');
const Alumno = require('../models/Alumno');

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
