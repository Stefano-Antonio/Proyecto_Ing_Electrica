const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoordinadorGenMdl = new Schema({
  nombre: { type: String, required: true },
  personalMatricula: { type: String, required: true, unique: true },
  alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Array de referencias a 'Alumno'
});


module.exports = mongoose.model('CoordinadorGen', CoordinadorGenMdl);