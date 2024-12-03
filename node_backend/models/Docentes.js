const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocentesMdl = new Schema({
    nombre: { type: String, required: true },
    matricula: { type: String, required: true, unique: true },
    password:{ type: String, required: true },
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materia', default: [] }], // Array de referencias a 'Horario'
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Array de referencias a 'Alumno'
  });
  
module.exports = mongoose.model('Docente', DocentesMdl);