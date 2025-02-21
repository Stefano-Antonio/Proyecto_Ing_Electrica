const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdministradorMdl = new Schema({
    id_carrera:{type: String, required: true},
    personalMatricula: { type: String, ref: 'Personal', required: true, unique: true }, // Relación con Personal por matrícula 
    });



module.exports = mongoose.model('Administrador', AdministradorMdl);