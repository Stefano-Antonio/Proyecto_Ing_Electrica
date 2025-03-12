const Personal = require('../models/Personal');
const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');
const Administradores = require('../models/Administradores');
const Alumno = require('../models/Alumno');
const Materia = require('../models/Materia');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

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
    const { matricula, nombre, password, roles, correo, telefono, id_carrera } = req.body; // Asegúrate de que id_carrera esté en el cuerpo de la solicitud
    console.log('ID de la carrera recibido:', id_carrera); // Verificar que id_carrera se recibe correctamente
    try {
        const newPersonal = new Personal({ matricula, nombre, password, roles, correo, telefono });
        const usuarioGuardado = await newPersonal.save();
        console.log('Usuario guardado en Personal:', usuarioGuardado);
        console.log('PersonalMatricula antes de guardar:', usuarioGuardado.matricula);


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
                alumnos: []
            });
            const tutorGuardado = await nuevoTutor.save();
            console.log('Usuario guardado en Tutores:', tutorGuardado);
        } else if (roles.includes('C')) {
            console.log('Creando coordinador con id_carrera:', id_carrera, 'y personalMatricula:', usuarioGuardado.matricula); // Verificar valores antes de guardar
            const nuevoCoordinador = new Coordinadores({
                id_carrera,
                personalMatricula: usuarioGuardado.matricula, // Asegura que sea un string
                alumnos: []
            });
            const coordinadorGuardado = await nuevoCoordinador.save();
            console.log('Usuario guardado en Coordinadores:', coordinadorGuardado);
        } else if (roles.includes('A')) {
            const nuevoAdministrador = new Administradores({
                id_carrera: id_carrera, // Agregar el id_carrera aquí
                personalMatricula: usuarioGuardado.matricula,
                // Otros campos específicos de Administrador
            });
            const administradorGuardado = await nuevoAdministrador.save();
            console.log('Usuario guardado en Administradores:', administradorGuardado);
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

exports.getPersonalByCarrera = async (req, res) => {
  try {
    const { matricula } = req.params;
    console.log("Matrícula del coordinador:", matricula);

    // Buscar el coordinador y obtener el id_carrera
    const coordinador = await Coordinadores.findOne({ personalMatricula: matricula }).select("id_carrera");
    if (!coordinador) {
      return res.status(404).json({ message: "Coordinador no encontrado" });
    }

    console.log("ID de carrera del coordinador:", coordinador.id_carrera);

    // Obtener alumnos de la carrera
    const alumnos = await Alumno.find({ id_carrera: coordinador.id_carrera }).select("_id");
    const alumnosIds = alumnos.map(alumno => alumno._id);

    console.log("Alumnos en la carrera:", alumnosIds);

    // Obtener materias de la carrera
    const materias = await Materia.find({ id_carrera: coordinador.id_carrera }).select("_id");
    const materiasIds = materias.map(materia => materia._id);

    console.log("Materias en la carrera:", materiasIds);

    // Buscar docentes que tengan alumnos de la carrera o impartan materias de la carrera
    const docentesPorAlumnos = await Docentes.find({ alumnos: { $in: alumnosIds } }).select("personalMatricula");
    const docentesPorMaterias = await Docentes.find({ materias: { $in: materiasIds } }).select("personalMatricula");

    console.log("Docentes por alumnos:", docentesPorAlumnos.map(d => d.personalMatricula));
    console.log("Docentes por materias:", docentesPorMaterias.map(d => d.personalMatricula));
    console.log("Docentes por alumnos y materias:", [...docentesPorAlumnos, ...docentesPorMaterias]);
    // Combinar docentes sin duplicados
    const docentes = [...docentesPorAlumnos, ...docentesPorMaterias].reduce((acc, docente) => {
      if (!acc.some(d => d.personalMatricula === docente.personalMatricula)) {
        acc.push(docente);
      }
      return acc;
    }, []);

    console.log("Docentes encontrados:", docentes.map(d => d.personalMatricula));

    // Buscar tutores que tengan alumnos de la carrera
    const tutores = await Tutores.find({ alumnos: { $in: alumnosIds } }).select("personalMatricula");

    console.log("Tutores encontrados:", tutores.map(t => t.personalMatricula));

    // Buscar coordinadores y administradores de la carrera
    const [coordinadores, administradores] = await Promise.all([
      Coordinadores.find({ id_carrera: coordinador.id_carrera }).select("personalMatricula"),
      Administradores.find({ id_carrera: coordinador.id_carrera }).select("personalMatricula")
    ]);

    console.log("Coordinadores encontrados:", coordinadores.map(c => c.personalMatricula));
    console.log("Administradores encontrados:", administradores.map(a => a.personalMatricula));

    // Unir todas las matrículas en un Set para evitar duplicados
    const personalMatriculasSet = new Set([
      ...docentes.map(d => d.personalMatricula),
      ...tutores.map(t => t.personalMatricula),
      ...coordinadores.map(c => c.personalMatricula),
      ...administradores.map(a => a.personalMatricula)
    ]);

    // Convertir el Set a Array y buscar los datos completos del personal
    const personalMatriculas = Array.from(personalMatriculasSet);

    if (personalMatriculas.length === 0) {
      return res.status(404).json({ message: "No hay personal en esta carrera" });
    }

    console.log("Personal encontrado (sin duplicados):", personalMatriculas);

    const personal = await Personal.find({ matricula: { $in: personalMatriculas } });

    res.status(200).json(personal);
  } catch (error) {
    console.error("Error en getPersonalByCarrera:", error);
    res.status(500).json({ message: "Error al obtener personal", error: error.message });
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
  try {
      const personal = await Personal.findByIdAndUpdate(
          req.params.id,
          { $set: req.body }, // Actualiza todos los campos enviados en la solicitud
          { new: true } // Devuelve el documento actualizado
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
  