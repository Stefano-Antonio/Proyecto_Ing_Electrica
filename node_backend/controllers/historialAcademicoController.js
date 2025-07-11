const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Historial = require('../models/HistorialAcademico');
const Personal = require('../models/Personal');
const Alumnos = require('../models/Alumno');
const Materias = require('../models/Materia');
const Tutores = require('../models/Tutores');
const Docentes = require('../models/Docentes');
const Administrativos = require('../models/Administradores');
const Coordinadores = require('../models/Coordinadores');
const Horarios = require('../models/Horario');


async function generarHistorialCore({ semestre, matricula, fecha_generacion = new Date() }) {
  const folderPath = path.join(__dirname, '..', 'exports', semestre);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const descargarYGuardar = async (url, outputPath) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(outputPath, response.data);
  };

  const urlAlumnos = 'http://localhost:5000/api/alumnos/exportar-csv';
  const urlMaterias = 'http://localhost:5000/api/materias/exportar-csv';
  const urlPersonal = 'http://localhost:5000/api/personal/exportar-csv';

  const rutaAlumnos = path.join(folderPath, 'alumnos.csv');
  const rutaMaterias = path.join(folderPath, 'materias.csv');
  const rutaPersonal = path.join(folderPath, 'personal.csv');

  await Promise.all([
    descargarYGuardar(urlAlumnos, rutaAlumnos),
    descargarYGuardar(urlMaterias, rutaMaterias),
    descargarYGuardar(urlPersonal, rutaPersonal),
  ]);

  const personal = await Personal.findOne({ matricula });
  if (!personal) throw new Error('Usuario no encontrado en la colección personal');

  let historial = await Historial.findOne({ semestre });
  if (historial) {
    historial.fecha_generacion = fecha_generacion;
    historial.generado_por = personal._id;
    historial.archivos = {
      alumnos: `/descargas/${semestre}/alumnos.csv`,
      materias: `/descargas/${semestre}/materias.csv`,
      personal: `/descargas/${semestre}/personal.csv`,
    };
    await historial.save();
  } else {
    historial = new Historial({
      semestre,
      fecha_generacion,
      generado_por: personal._id,
      archivos: {
        alumnos: `/descargas/${semestre}/alumnos.csv`,
        materias: `/descargas/${semestre}/materias.csv`,
        personal: `/descargas/${semestre}/personal.csv`,
      },
    });
    await historial.save();
  }

  return historial;
}

const generarHistorial = async (req, res) => {
  try {
    const historial = await generarHistorialCore({
      semestre: req.body.semestre,
      matricula: req.body.matricula,
      fecha_generacion: req.body.fecha_generacion,
    });
    res.status(200).json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar historial académico', error: err.message });
  }
};

const listarHistoriales = async (req, res) => {
  try {
    const historiales = await Historial.find().populate({
      path: 'generado_por',
      model: 'Personal',
      select: 'nombre matricula'
    });
    res.status(200).json(Array.isArray(historiales) ? historiales : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar historiales académicos', error: err.message });
  }
}

// Rutas para vaciar toda la base de datos

// Borra todas las materias
const vaciarMaterias = async (req, res) => {
    try {
        await Materias.deleteMany({});
        // Vacía el arreglo materias en docentes y horarios
        await Docentes.updateMany({}, { $set: { materias: [] } });
        await Horarios.updateMany({}, { $set: { materias: [] } });
        res.status(200).json({ message: 'Materias eliminadas correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar materias', error: err.message });
    }
};

// Borra todos los alumnos
const vaciarAlumnos = async (req, res) => {
    try {
        await Alumnos.deleteMany({});
        // Vacía el arreglo alumnos en tutores, docentes, coordinadores y materias
        await Tutores.updateMany({}, { $set: { alumnos: [] } });
        await Docentes.updateMany({}, { $set: { alumnos: [] } });
        await Coordinadores.updateMany({}, { $set: { alumnos: [] } });
        await Materias.updateMany({}, { $set: { alumnos: [] } });
        await Horarios.deleteMany({});
        res.status(200).json({ message: 'Alumnos eliminados correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar alumnos', error: err.message });
    }
};

// Borra personal, docentes, tutores, coordinadores y administrativos
const vaciarPersonal = async (req, res) => {
    try {
        await Personal.deleteMany({
            matricula: { $not: { $regex: /^(CG|AC)/ } }
        });
        await Docentes.deleteMany({});
        await Tutores.deleteMany({});
        await Coordinadores.deleteMany({});
        await Administrativos.deleteMany({});

        // Vacía los arreglos docentes y tutores en alumnos, horarios y materias
        await Alumnos.updateMany({}, { $set: { docentes: [], tutores: [] } });
        await Horarios.updateMany({}, { $set: { docentes: [] } });
        await Materias.updateMany({}, { $set: { docentes: [], docente: null } });
        res.status(200).json({ message: 'Personal, docentes, tutores, coordinadores y administrativos eliminados correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar personal y relacionados', error: err.message });
    }
};

// Borra personal, docentes, tutores, coordinadores y administrativos
const vaciarPersonalAut = async () => {
    try {
        await Personal.deleteMany({
            matricula: { $not: { $regex: /^(CG|AC)/ } }
        });
        await Docentes.deleteMany({});
        await Tutores.deleteMany({});
        await Coordinadores.deleteMany({});
        await Administrativos.deleteMany({});

        // Vacía los arreglos docentes y tutores en alumnos, horarios y materias
        await Alumnos.updateMany({}, { $set: { docentes: [], tutores: [] } });
        await Horarios.updateMany({}, { $set: { docentes: [] } });
        await Materias.updateMany({}, { $set: { docentes: [], docente: null } });
    } catch (err) {
        console.error(err);
    }
};

// Obtener la fecha de borrado del historial académico
const obtenerFechaBorrado = async (req, res) => {
    const { semestre } = req.query;
    console.log(`Obteniendo fecha de borrado para el semestre: ${semestre}`);
    try {
        const historial = await Historial.findOne({ semestre });
        if (!historial) {
            return res.status(404).json({ message: 'Historial académico no encontrado para el semestre especificado' });
        }
        res.status(200).json({ fecha_de_borrado: historial.fecha_de_borrado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la fecha de borrado', error: err.message });
    }
}

//Actualizar la fecha de borrado del hisotrial académico
const actualizarFechaBorrado = async (req, res) => {
    const { semestre, fecha_de_borrado } = req.body;
    console.log(`Actualizando fecha de borrado para el semestre: ${semestre}, fecha: ${fecha_de_borrado}`);
    try {
        const historial = await Historial.findOne({ semestre });
        if (!historial) {
            return res.status(404).json({ message: 'Historial académico no encontrado para el semestre especificado' });
        }
        historial.fecha_de_borrado = fecha_de_borrado || null;
        await historial.save();
        res.status(200).json({ message: 'Fecha de borrado actualizada correctamente', historial });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la fecha de borrado', error: err.message });
    }
}

module.exports = {
  generarHistorial,
  listarHistoriales,
    vaciarMaterias,
    vaciarAlumnos,
    vaciarPersonal,
    actualizarFechaBorrado,
    obtenerFechaBorrado,
  vaciarPersonalAut
};