const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdministradorMdl = new Schema({
    id_carrera:{type: String, required: true},
    personalMatricula: { type: String, ref: 'Personal', required: true }, // Relación con Personal por matrícula 
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Array de referencias a 'Alumno'
    });



module.exports = mongoose.model('Administrador', AdministradorMdl);