const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdministradorMdl = new Schema({
    personal: { type: String, ref: 'Personal', required: true }, // Relación con Personal
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }]   // Alumnos asignados
    });


module.exports = mongoose.model('Administrador', AdministradorMdl);