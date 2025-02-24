const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocentesMdl = new Schema({
    personalMatricula: { type: String, ref: 'Personal', required: true }, // Relación con Personal por matrícula
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materia', default: [] }], // Materias impartidas
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Alumnos asignados
});

module.exports = mongoose.model('Docente', DocentesMdl);