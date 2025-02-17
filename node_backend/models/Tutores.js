const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutoresMdl = new Schema({
  personalMatricula: { type: String, ref: 'Personal', required: true }, // Relación con Personal por matrícula 
  alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Alumnos asignados
});
  
module.exports = mongoose.model('Tutor', TutoresMdl);