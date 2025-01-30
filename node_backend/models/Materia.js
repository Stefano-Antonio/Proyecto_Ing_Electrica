const MateriaSchema = new Schema({
    id_materia: { type: Number, required: true },
    nombre: { type: String, required: true },
    horarios: {
        lunes: { type: String, default: null },
        martes: { type: String, default: null },
        miercoles: { type: String, default: null },
        jueves: { type: String, default: null },
        viernes: { type: String, default: null },
        sabado: { type: String, default: null }
    },
    salon: { type: String, required: true },
    grupo: { type: String, required: true },
    cupo: { type: Number, required: true },
    docente: { type: String, ref: 'Personal', required: false, default: null } // Cambiado a String y referencia a Personal
});

module.exports = mongoose.model('Materia', MateriaSchema);
