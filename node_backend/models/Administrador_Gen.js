const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdministradorGenMdl = new Schema({
  nombre: { type: String, required: true },
  personalMatricula: { type: String, required: true, unique: true },
  password:{ type: String, required: true }
  });
  


module.exports = mongoose.model('AdministradorGen', AdministradorGenMdl);