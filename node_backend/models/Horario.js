const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HorarioSchema = new Schema({
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: false, default: null },
    materias: { type: Schema.Types.ObjectId, ref: 'Materias', required: false, default: null }
});

module.exports = mongoose.model('Horario', HorarioSchema);