const Personal = require('../models/Personal');
const Docentes = require('../models/Docentes');
const Tutores = require('../models/Tutores');
const Coordinadores = require('../models/Coordinadores');
const Administradores = require('../models/Administradores');
const CoordinadorGenMdl = require('../models/Coordinador_Gen');
const AdministradorGenMdl = require('../models/Administrador_Gen');
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
    const { matricula, nombre, password, roles, correo, telefono, id_carrera } = req.body;
    console.log('ID de la carrera recibido:', id_carrera);

    try {
        const newPersonal = new Personal({ matricula, nombre, password, roles, correo, telefono });
        const usuarioGuardado = await newPersonal.save();
        console.log('Usuario guardado en Personal:', usuarioGuardado);

        if (roles === 'D') {
            const newDocente = new Docentes({
                personalMatricula: usuarioGuardado.matricula,
                materias: [],
                alumnos: []
            });
            await newDocente.save();
            console.log('Usuario guardado en Docentes');
        } else if (roles === 'T') {
            const nuevoTutor = new Tutores({
                personalMatricula: usuarioGuardado.matricula,
                alumnos: []
            });
            await nuevoTutor.save();
            console.log('Usuario guardado en Tutores');
        } else if (roles === 'C' && matricula.match(/^C\d{4}$/)) {
            const nuevoCoordinador = new Coordinadores({
                id_carrera,
                personalMatricula: usuarioGuardado.matricula,
                alumnos: []
            });
            await nuevoCoordinador.save();
            console.log('Usuario guardado en Coordinadores');
        } else if (roles.includes('A') && usuarioGuardado.matricula.match(/^A\d{4}$/)) {
          console.log("Creando Administrador con matrícula:", usuarioGuardado.matricula);
          const nuevoAdministrador = new Administradores({
              id_carrera,
              personalMatricula: usuarioGuardado.matricula
          });
          await nuevoAdministrador.save();
          console.log('Usuario guardado en Administradores');
      } else if (roles === 'CG' && matricula.match(/^CG\d{4}$/)) {
            const nuevoCoordinadorGen = new CoordinadorGenMdl({
                nombre,
                personalMatricula: usuarioGuardado.matricula,
                alumnos: []
            });
            await nuevoCoordinadorGen.save();
            console.log('Usuario guardado en Coordinador General');
        } else if (roles === 'AG' && matricula.match(/^AG\d{4}$/)) {
            const nuevoAdministradorGen = new AdministradorGenMdl({
                nombre,
                personalMatricula: usuarioGuardado.matricula,
                password
            });
            await nuevoAdministradorGen.save();
            console.log('Usuario guardado en Administrador General');
        } else {
            return res.status(400).json({ message: 'Rol o matrícula inválidos' });
        }

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        console.error('Error al crear el personal y los documentos relacionados:', error);
        res.status(500).json({ message: 'Error al crear el personal y los documentos relacionados', error });
    }
};

exports.getPersonal = async (req, res) => {
    try {
        const personal = await Personal.find({ roles: { $nin: ['CG', 'AG'] } });
        res.status(200).json(personal);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener personal', error });
    }
};

exports.getPersonalByCarrera = async (req, res) => {
  try {
    const { matricula } = req.params;
    console.log("Matrícula del coordinador/administrador:", matricula);

    // Buscar el coordinador o administrador y obtener el id_carrera
    const coordinador = await Coordinadores.findOne({ personalMatricula: matricula }).select("id_carrera");
    const administrador = await Administradores.findOne({ personalMatricula: matricula }).select("id_carrera");

    if (!coordinador && !administrador) {
      return res.status(404).json({ message: "Coordinador o Administrador no encontrado" });
    }

    const id_carrera = coordinador ? coordinador.id_carrera : administrador.id_carrera;
    console.log("ID de carrera:", id_carrera);

    // Obtener alumnos de la carrera
    const alumnos = await Alumno.find({ id_carrera }).select("_id");
    const alumnosIds = alumnos.map(alumno => alumno._id);

    console.log("Alumnos en la carrera:", alumnosIds);

    // Obtener materias de la carrera
    const materias = await Materia.find({ id_carrera }).select("_id");
    const materiasIds = materias.map(materia => materia._id);

    console.log("Materias en la carrera:", materiasIds);

    // Buscar todos los docentes
    const docentes = await Docentes.find().select("personalMatricula");
    console.log("Docentes encontrados:", docentes.map(d => d.personalMatricula));

    // Buscar todos los tutores
    const tutores = await Tutores.find().select("personalMatricula");
    console.log("Tutores encontrados:", tutores.map(t => t.personalMatricula));

    // Buscar coordinadores y administradores de la carrera
    const [coordinadores, administradores] = await Promise.all([
      Coordinadores.find({ id_carrera }).select("personalMatricula"),
      Administradores.find({ id_carrera }).select("personalMatricula")
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
        const personal = await Personal.findById(req.params.id);
        if (!personal) {
            return res.status(404).json({ message: 'Personal no encontrado' });
        }

        // Eliminar el personal de los alumnos que lo tienen como tutor
    await Alumno.updateMany(
      { tutor: personal._id },
      { $unset: { tutor: "" } }
    );
    console.log('Personal eliminado de los alumnos que lo tienen como tutor');

    // Eliminar el personal de las colecciones específicas (Docentes, Tutores, Coordinadores, Administradores)
    if (personal.roles.includes('D')) {
      await Docentes.findOneAndDelete({ personalMatricula: personal.matricula });
      console.log('Personal eliminado de Docentes');
    }
    if (personal.roles.includes('T')) {
      await Tutores.findOneAndDelete({ personalMatricula: personal.matricula });
      console.log('Personal eliminado de Tutores');
    }
    if (personal.roles.includes('C')) {
      await Coordinadores.findOneAndDelete({ personalMatricula: personal.matricula });
      console.log('Personal eliminado de Coordinadores');
    }
    if (personal.roles.includes('A')) {
      await Administradores.findOneAndDelete({ personalMatricula: personal.matricula });
      console.log('Personal eliminado de Administradores');
    }

    // Eliminar el personal
    await Personal.findByIdAndDelete(req.params.id);
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
  
  // Exportar personal por carrera a CSV
  exports.exportarPersonalCSVPorCarrera = async (req, res) => {
    try {
      const { id_carrera } = req.params; // Obtener el id_carrera desde la URL
  
      if (!id_carrera) {
        return res.status(400).json({ message: "Se requiere el id_carrera" });
      }
  
      // Buscar docentes, tutores, administradores y coordinadores de la carrera
      const [docentes, tutores, administradores, coordinadores] = await Promise.all([
        Docentes.find().select("personalMatricula"),
        Tutores.find().select("personalMatricula"),
        Administradores.find({ id_carrera }).select("personalMatricula"),
        Coordinadores.find({ id_carrera }).select("personalMatricula"),
      ]);
  
      // Unificar todas las matrículas del personal de la carrera
      const personalMatriculas = new Set([
        ...docentes.map((d) => d.personalMatricula),
        ...tutores.map((t) => t.personalMatricula),
        ...administradores.map((a) => a.personalMatricula),
        ...coordinadores.map((c) => c.personalMatricula),
      ]);
  
      console.log("Personal en la carrera:", Array.from(personalMatriculas));
  
      // Obtener la información completa del personal filtrado
      const personal = await Personal.find({ matricula: { $in: Array.from(personalMatriculas) } });
  
      if (personal.length === 0) {
        return res.status(404).json({ message: "No hay personal registrado para esta carrera" });
      }
  
      // Formatear datos para el CSV
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
      let csv = json2csvParser.parse(formattedData);
  
      // Agregar BOM para compatibilidad con Excel y caracteres especiales
      csv = "\ufeff" + csv;
  
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment(`personal_carrera_${id_carrera}.csv`);
      res.send(csv);
    } catch (error) {
      console.error("❌ Error en exportarCSVPorCarrera:", error);
      res.status(500).json({ message: "Error al exportar a CSV", error });
    }
  };

  // Subir personal desde CSV por carrera
  exports.subirPersonalCSVPorCarrera = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha enviado ningún archivo CSV" });
    }
  
    const { id_carrera } = req.params; // 📌 Obtener id_carrera desde la URL
    if (!id_carrera) {
      return res.status(400).json({ message: "Se requiere el ID de la carrera en la URL" });
    }
  
    const results = [];
  
    fs.createReadStream(req.file.path, { encoding: "utf-8" })
      .pipe(csv())
      .on("data", (data) => {
        const cleanedData = {};
        Object.keys(data).forEach((key) => {
          const cleanKey = key.replace(/"/g, "").trim();
          cleanedData[cleanKey] = data[key];
        });
  
        results.push(cleanedData);
      })
      .on("end", async () => {
        try {
          if (results.length === 0) {
            return res.status(400).json({ message: "El archivo CSV está vacío" });
          }
  
          console.log("✅ Datos obtenidos del CSV:", results);
  
          const matriculasCSV = results.map((p) => p.matricula?.toString().trim()).filter(Boolean);
  
          await Promise.all(
            results.map(async (personalData) => {
              let { matricula, nombre, password, roles, correo, telefono } = personalData;
              matricula = matricula ? matricula.toString().trim() : null;
  
              if (!matricula) {
                console.warn("⚠ Personal sin matrícula:", personalData);
                return;
              }
  
              if (!roles) {
                console.warn(`⚠ Usuario ${matricula} sin roles definidos`);
                return;
              }
  
              if (typeof roles === "string") {
                roles = roles.split(",").map((r) => r.trim().toUpperCase());
              }
  
              // 🔹 Insertar o actualizar personal
              const personalActualizado = await Personal.findOneAndUpdate(
                { matricula },
                { nombre, telefono, correo, roles, password },
                { upsert: true, new: true }
              );
  
              console.log(`🔄 Personal actualizado/insertado: ${matricula}`);
  
              // 🔥 Manejo de roles
              if (roles.includes("D")) {
                await Docentes.findOneAndUpdate(
                  { personalMatricula: matricula },
                  { $set: { personalMatricula: matricula } }, // Solo actualizar personalMatricula
                  { upsert: true, new: true }
                );
              }
  
              if (roles.includes("T")) {
                await Tutores.findOneAndUpdate(
                  { personalMatricula: matricula },
                  { $set: { personalMatricula: matricula } }, // Solo actualizar personalMatricula
                  { upsert: true, new: true }
                );
              }
  
              if (roles.includes("C")) {
                await Coordinadores.findOneAndUpdate(
                  { personalMatricula: matricula },
                  { $set: { personalMatricula: matricula, id_carrera } }, // Solo actualizar personalMatricula e id_carrera
                  { upsert: true, new: true }
                );
              }
  
              if (roles.includes("A")) {
                await Administradores.findOneAndUpdate(
                  { personalMatricula: matricula },
                  { $set: { personalMatricula: matricula, id_carrera } }, // Solo actualizar personalMatricula e id_carrera
                  { upsert: true, new: true }
                );
              }
            })
          );
  
          // Eliminar registros que ya no estén en el CSV y que pertenezcan a la carrera
          const personalAEliminar = await Personal.find({ matricula: { $nin: matriculasCSV } });
          await Promise.all(
            personalAEliminar.map(async (personal) => {
              const { matricula } = personal;
  
              // Verificar si el personal pertenece a la carrera
              const esDocente = await Docentes.findOne({ personalMatricula: matricula });
              const esTutor = await Tutores.findOne({ personalMatricula: matricula });
              const esCoordinador = await Coordinadores.findOne({ personalMatricula: matricula, id_carrera });
              const esAdministrador = await Administradores.findOne({ personalMatricula: matricula, id_carrera });
  
              if (esDocente || esTutor || esCoordinador || esAdministrador) {
                await Personal.findByIdAndDelete(personal._id);
                await Promise.all([
                  Docentes.findOneAndDelete({ personalMatricula: matricula }),
                  Tutores.findOneAndDelete({ personalMatricula: matricula }),
                  Coordinadores.findOneAndDelete({ personalMatricula: matricula, id_carrera }),
                  Administradores.findOneAndDelete({ personalMatricula: matricula, id_carrera })
                ]);
                console.log(`🗑️ Personal y registros relacionados eliminados: ${matricula}`);
              }
            })
          );
  
          fs.unlinkSync(req.file.path);
          res.status(200).json({ message: `Base de datos de personal de la carrera ${id_carrera} actualizada con éxito desde el CSV` });
  
        } catch (error) {
          console.error("❌ Error al procesar el CSV:", error);
          res.status(500).json({ message: "Error al actualizar la base de datos de personal desde el CSV", error });
        }
      })
      .on("error", (err) => {
        console.error("❌ Error al leer el CSV:", err);
        res.status(500).json({ message: "Error al procesar el archivo CSV", error: err });
      });
  };