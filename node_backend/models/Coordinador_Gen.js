const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoordinadorGenMdl = new Schema({
  nombre: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  password:{ type: String, required: true },
  alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Array de referencias a 'Alumno'
});


module.exports = mongoose.model('CoordinadorGen', CoordinadorGenMdl);