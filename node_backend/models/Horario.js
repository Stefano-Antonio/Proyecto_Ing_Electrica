const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HorarioSchema = new Schema({
    materias: [{ type: Schema.Types.ObjectId, ref: 'Materia', default: [] }],
    estatus: { type: Number, default: 0 },
    comentario: { type: String, default: '' }
});
module.exports = mongoose.model('Horario', HorarioSchema);