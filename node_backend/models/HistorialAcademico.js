const mongoose = require('mongoose');

const HistorialAcademicoSchema = new mongoose.Schema({
  semestre: { type: String, required: true },
  fecha_generacion: { type: Date, default: Date.now },
  archivos: {
    personal: String,
    alumnos: String,
    materias: String
  },
  generado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' } // Admin o coordinador
});

module.exports = mongoose.model('HistorialAcademico', HistorialAcademicoSchema);