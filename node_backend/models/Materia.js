const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MateriaSchema = new Schema({
    id_materia: { type: Number, required: false },
    id_carrera: { type: String, required: true },
    nombre: { type: String, required: true },
    horarios: {
        lunes: { type: String, default: null },
        martes: { type: String, default: null },
        miercoles: { type: String, default: null },
        jueves: { type: String, default: null },
        viernes: { type: String, default: null },
        sabado: { type: String, default: null }
    },
    semi: { type: String, required: false, default: null },
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }],
    salon: { type: String, required: true },
    grupo: { type: String, required: true },
    cupo: { type: Number, required: true },
    laboratorio: { type: Boolean, default: false },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: false, default: null }
});
module.exports = mongoose.model('Materia', MateriaSchema);
