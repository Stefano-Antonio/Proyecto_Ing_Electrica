const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumnoSchema = new Schema({
  matricula: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  horario: { type: Schema.Types.ObjectId, ref: 'Horario', default: null }
});

module.exports = mongoose.model('Alumno', AlumnoSchema);