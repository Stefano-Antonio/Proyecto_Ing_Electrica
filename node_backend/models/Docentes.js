const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocentesMdl = new Schema({
    personal: { type: Schema.Types.ObjectId, ref: 'Personal', required: true }, // Relación con Personal
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materia', default: [] }], // Materias impartidas
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Alumnos asignados
});

module.exports = mongoose.model('Docente', DocentesMdl);