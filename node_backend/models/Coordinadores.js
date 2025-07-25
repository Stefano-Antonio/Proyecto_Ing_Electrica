const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CoordinadorMdl = new Schema({
    id_carrera:{type: String, required: true},
    personalMatricula: { type: String, ref: 'Personal', required: true }, // Relación con Personal por matrícula 
    alumnos: [{ type: Schema.Types.ObjectId, ref: 'Alumno', default: [] }],   // Array de referencias a 'Alumno'
    horas: { type: Number, default: 0 }, // Horas permitidas asignadas a la carrera
    comprobantePagoHabilitado: { type: Boolean, default: true } // Habilita comprobante de pago
    });



module.exports = mongoose.model('Coordinador', CoordinadorMdl);