const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumnoSchema = new Schema({
  id_carrera: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  horario: { type: Schema.Types.ObjectId, ref: 'Horario', default: null },
  tutor: {type: String, default: null},
  estatusComprobante: {
  type: String,
  enum: ["Pendiente", "Aceptado", "Rechazado"],
  default: "Pendiente"
},
});

module.exports = mongoose.model('Alumno', AlumnoSchema);