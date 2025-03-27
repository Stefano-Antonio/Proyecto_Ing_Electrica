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
const coordinadorRoutes = require('./routes/coordinadorRoutes');
const coordinadorGenRoutes = require('./routes/coordinadorGenRoutes');
const administradorRoutes = require('./routes/administradorRoutes');
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
app.use('/api/coordinadores', coordinadorRoutes);
app.use('/api/cordgen', coordinadorGenRoutes);
app.use('/api/administradores', administradorRoutes);


// Conexión a MongoDB
mongoose.connect('mongodb+srv://rogerzma500:upiiz_rzm500@dbuaie.mlhfo.mongodb.net/DBUAIE?retryWrites=true&w=majority', {

}).then(async () => {
  console.log('Conectado a MongoDB');

}).catch(error => {
  console.error('Error al conectar a MongoDB:', error);
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
