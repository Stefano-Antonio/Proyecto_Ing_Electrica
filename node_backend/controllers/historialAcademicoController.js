const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Historial = require('../models/HistorialAcademico');
const Personal = require('../models/Personal');

const generarHistorial = async (req, res) => {
    const { semestre, matricula, fecha_generacion } = req.body;

    try {
        const folderPath = path.join(__dirname, '..', 'exports', semestre);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Descargar archivos desde las rutas existentes (usando axios)
        const descargarYGuardar = async (url, outputPath) => {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            fs.writeFileSync(outputPath, response.data);
        };

        // URLs para descarga
        const urlAlumnos = 'http://localhost:5000/api/alumnos/exportar-csv';
        const urlMaterias = 'http://localhost:5000/api/materias/exportar-csv';
        const urlPersonal = `http://localhost:5000/api/personal/exportar-csv`;

        // Rutas de salida (ahora .csv)
        const rutaAlumnos = path.join(folderPath, 'alumnos.csv');
        const rutaMaterias = path.join(folderPath, 'materias.csv');
        const rutaPersonal = path.join(folderPath, 'personal.csv');

        // Descargar y guardar archivos
        await Promise.all([
            descargarYGuardar(urlAlumnos, rutaAlumnos),
            descargarYGuardar(urlMaterias, rutaMaterias),
            descargarYGuardar(urlPersonal, rutaPersonal),
        ]);

        const personal = await Personal.findOne({ matricula });
        if (!personal) {
            return res.status(404).json({ message: 'Usuario no encontrado en la colección personal' });
        }

        // Buscar historial existente y actualizarlo, o crear uno nuevo si no existe
        let historial = await Historial.findOne({ semestre });
        if (historial) {
            historial.fecha_generacion = fecha_generacion || new Date();
            historial.generado_por = personal._id;
            historial.archivos = {
                alumnos: `/descargas/${semestre}/alumnos.csv`,
                materias: `/descargas/${semestre}/materias.csv`,
                personal: `/descargas/${semestre}/personal.csv`
            };
            await historial.save();
        } else {
            historial = new Historial({
                semestre,
                fecha_generacion: fecha_generacion || new Date(),
                generado_por: personal._id,
                archivos: {
                    alumnos: `/descargas/${semestre}/alumnos.csv`,
                    materias: `/descargas/${semestre}/materias.csv`,
                    personal: `/descargas/${semestre}/personal.csv`
                }
            });
            await historial.save();
        }

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

module.exports = {
  generarHistorial,
  listarHistoriales
};