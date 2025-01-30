const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MateriaSchema = new Schema({
    id_materia: {type: Number, required: true},
    nombre: { type: String, required: true },
    horarios: {
        lunes: { type: String, default: null },    // "8:30-10:00" formato opcional
        martes: { type: String, default: null },
        miercoles: { type: String, default: null },
        jueves: { type: String, default: null },
        viernes: { type: String, default: null },
        sabado: { type: String, default: null }
    },
    salon: { type: String, required: true },
    grupo: { type: String, required: true },
    cupo: { type: Number, required: true },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: false, default: null }
});

module.exports = mongoose.model('Materia', MateriaSchema);