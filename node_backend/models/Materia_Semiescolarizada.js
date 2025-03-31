const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MateriaSemiSchema = new Schema({
    id_materia: {type: Number, required: false},
    id_carrera: {  type: String, required: true },
    nombre: { type: String, required: true },
    horarios: {
        sabado: { type: String, default: null }
    },
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }] ,
    salon: { type: String, required: true },
    grupo: { type: String, required: true },
    cupo: { type: Number, required: true },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: false, default: null }
});

module.exports = mongoose.model('MateriaSemi', MateriaSemiSchema);
