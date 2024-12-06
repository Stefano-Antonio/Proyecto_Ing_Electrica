const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TutoresMdl = new Schema({
    personal: { type: Schema.Types.ObjectId, ref: 'Personal', required: true }, // Relación con Personal
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Alumnos asignados
  });
  
module.exports = mongoose.model('Tutor', TutoresMdl);