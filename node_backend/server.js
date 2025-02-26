// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const authRoutes = require('./routes/authRoutes');  // Importa las rutas de autenticación
const materiasRoutes = require('./routes/materiasRoutes');
const personalRoutes = require('./routes/personalRoutes');
const Materia = require('./models/Materia');
const Docente = require('./models/Docentes');
const tutorRoutes = require('./routes/tutorRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/auth', authRoutes);  // Usa las rutas de autenticación
app.use('/api/materias', materiasRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/tutores', tutorRoutes);
app.use('/api/docentes', docenteRoutes);



// Conexión a MongoDB
mongoose.connect('mongodb+srv://Stefano117:Mixbox360@cluster0.qgw2j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

}).then(() => {
  console.log('Conectado a MongoDB');

}).catch(error => {
  console.error('Error al conectar a MongoDB:', error);
});

const docenteId = "67914b7585658c9b623d1551"; // ID del docente
    const materiasIds = [
      "67995ba13ee2b6cfa6cd07ce", // ID de Matemáticas I
      "67995ba13ee2b6cfa6cd07d0", // ID de Programación
      "67995ba13ee2b6cfa6cd07d4"  // Otro ID de materia
    ];
    const matriculaDocente = "P001"; // Matrícula del docente

    asignarMateriasADocente(docenteId, materiasIds, matriculaDocente);
    console.log("Materias asignadas correctamente al docente:", docenteId);
  


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});



// Función para asignar materias a un docente
async function asignarMateriasADocente(docenteId, materiasIds, matriculaDocente) {
  try {
    // Verificar si el docente existe
    const docente = await Docente.findById(docenteId);
    if (!docente) {
      throw new Error("Docente no encontrado");
    }

    // Verificar si las materias existen
    const materias = await Materia.find({ _id: { $in: materiasIds } });
    if (materias.length !== materiasIds.length) {
      throw new Error("Una o más materias no existen");
    }

    // Buscar el ObjectId del docente utilizando la matrícula
    const docenteObj = await Docente.findOne({ personalMatricula: matriculaDocente });
    if (!docenteObj) {
      throw new Error("Docente no encontrado con la matrícula proporcionada");
    }

    // Actualizar el campo "docente" en cada materia
    await Materia.updateMany(
      { _id: { $in: materiasIds } },
      { $set: { "docente": docenteObj._id } }
    );

    console.log("Materias asignadas correctamente al docente:", docente);
    return docente; // Devolver el docente actualizado
  } catch (error) {
    console.error("Error al asignar materias:", error.message);
    throw error; // Relanzar el error para manejarlo en el código que llama a esta función
  }
}
