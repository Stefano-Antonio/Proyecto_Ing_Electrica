const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdministradorMdl = new Schema({
  idcarrera:{type: String, required: true},
  nombre: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  password:{ type: String, required: true },
  });


module.exports = mongoose.model('Administrador', AdministradorMdl);