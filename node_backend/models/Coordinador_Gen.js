const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoordinadorGenMdl = new Schema({
  personal: { type: String, ref: 'Personal', required: true }, // Relación con Personal
  alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Array de referencias a 'Alumno'
});


module.exports = mongoose.model('CoordinadorGen', CoordinadorGenMdl);