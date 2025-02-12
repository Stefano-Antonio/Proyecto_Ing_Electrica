const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HorarioSchema = new Schema({
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materia', required: false }] // Hacemos que sea un array de ObjectId de Materia
});

module.exports = mongoose.model('Horario', HorarioSchema);