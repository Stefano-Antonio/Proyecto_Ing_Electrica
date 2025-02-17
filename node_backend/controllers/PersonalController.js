const Personal = require('../models/Personal');
const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');
const CoordinadGen = require('../models/Coordinador_Gen');
const Administradores = require('../models/Administradores');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Coordinador_Gen = require('../models/Coordinador_Gen');

// Configurar multer para manejar el archivo CSV
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Guardar archivos en "uploads"
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nombrar el archivo con timestamp
    },
  });
  
  const upload = multer({ storage: storage });

  exports.upload = upload;

exports.createPersonal = async (req, res) => {
    console.log('Personal:', req.body);
    const { matricula, nombre, password, roles, correo, telefono } = req.body;
    try {
        const newPersonal = new Personal({ matricula, nombre, password, roles, correo, telefono });
        const usuarioGuardado = await newPersonal.save();
        console.log('Usuario guardado en Personal:', usuarioGuardado);

        if (roles.includes('D')) {
            const newDocente = new Docentes({
                personalMatricula: usuarioGuardado.matricula,
                materias: [],
                alumnos: []
            });
            const docenteGuardado = await newDocente.save();
            console.log('Usuario guardado en Docentes:', docenteGuardado);
        } else if (roles.includes('T')) {
            const nuevoTutor = new Tutores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Tutor
            });
            const tutorGuardado = await nuevoTutor.save();
            console.log('Usuario guardado en Tutores:', tutorGuardado);
        } else if (roles.includes('C')) {
            const nuevoCoordinador = new Coordinadores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Coordinador
            });
            const coordinadorGuardado = await nuevoCoordinador.save();
            console.log('Usuario guardado en Coordinadores:', coordinadorGuardado);
        } else if (roles.includes('A')) {
            const nuevoAdministrador = new Administradores({
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Administrador
            });
            const administradorGuardado = await nuevoAdministrador.save();
            console.log('Usuario guardado en Administradores:', administradorGuardado);
        } else if (roles.includes('CG')) {
          const nuevoCoordinadorGen = new Coordinador_Gen({
              personalMatricula: usuarioGuardado.matricula,
              // Otros campos específicos de Administrador
          });
          const coordinadorGenGuardado = await nuevoCoordinadorGen.save();
          console.log('Usuario guardado en Coordinador General:', coordinadorGenGuardado);
      }

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        console.error('Error al crear el personal y los documentos relacionados:', error);
        res.status(500).json({ message: 'Error al crear el personal y los documentos relacionados', error });
    }
};

exports.getPersonal = async (req, res) => {
    try {
        const personal = await Personal.find();
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error });
    }
};

exports.getPersonalById = async (req, res) => {
    try {
        const personal = await Personal.findById(req.params.id);
        if (!personal) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el personal', error });
    }
};

exports.updatePersonal = async (req, res) => {
    const { roles } = req.body;
    try {
        const personal = await Personal.findByIdAndUpdate(
            req.params.id,
            { roles },
            { new: true }
        );
        if (!personal) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el personal', error });
    }
};

exports.deletePersonal = async (req, res) => {
    try {
        const personal = await Personal.findByIdAndDelete(req.params.id);
        if (!personal) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }
        res.status(204).json({ message: 'Personal eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el personal', error });
    }
};

// Subir datos desde CSV
exports.subirPersonalCSV = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha enviado ningún archivo CSV' });
    }
  
    const results = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try {
          const matriculasCSV = results.map((personal) => personal.matricula);
  
          for (const personalData of results) {
            const { matricula, nombre, password, roles, correo, telefono } = personalData;
  
            await Personal.findOneAndUpdate(
              { matricula },
              { nombre, telefono, correo, roles, password }, 
              { upsert: true, new: true }
            );
          }
  
          // Eliminar registros que ya no estén en el CSV
          await Personal.deleteMany({ matricula: { $nin: matriculasCSV } });
  
          fs.unlinkSync(req.file.path); // Eliminar el archivo CSV tras procesarlo
          res.status(200).json({ message: 'Base de datos actualizada con éxito desde el archivo CSV' });
  
        } catch (error) {
          console.error('Error al procesar el CSV:', error);
          res.status(500).json({ message: 'Error al actualizar la base de datos desde el CSV', error });
        }
      })
      .on('error', (err) => {
        console.error('Error al leer el CSV:', err);
        res.status(500).json({ message: 'Error al procesar el archivo CSV', error: err });
      });
  };
  
  // 📤 Exportar datos a CSV
  exports.exportarPersonalCSV = async (req, res) => {
    try {
      const personal = await Personal.find(); // Obtén todos los registros
  
      // Modificar la estructura de los datos antes de convertirlos a CSV
      const formattedData = personal.map((p) => ({
        matricula: p.matricula,
        nombre: p.nombre,
        password: p.password,
        roles: p.roles.join(""), // 🔹 Convierte ["D", "T"] en "DT"
        telefono: p.telefono,
        correo: p.correo,
      }));
  
      const fields = ["matricula", "nombre", "password", "roles", "telefono", "correo"];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(formattedData);
  
      res.header("Content-Type", "text/csv");
      res.attachment("personal.csv");
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Error al exportar a CSV", error });
    }
  };
  