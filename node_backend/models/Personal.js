const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonalMdl = new Schema({
    matricula: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    password:{ type: String, required: true },
    roles: [{ type: String, enum: ['D', 'A', 'C', 'T','CG'], required: true }], // Roles asociados
    correo:{ type: String, required: true },
    telefono: { type: String, required: true},
    activo: { type: Boolean, default: true }
  });
  
module.exports = mongoose.model('Personal', PersonalMdl);