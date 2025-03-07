const Materia = require('../models/Materia');
const Docentes = require('../models/Docentes');
const mongoose = require('mongoose');
const Personal = require('../models/Personal');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const carrerasPermitidas = ["ISftw", "IDsr", "IEInd", "ICmp", "IRMca", "ISftwS"];

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

// Crear una nueva materia
exports.createMateria = async (req, res) => {
  const { id_materia, id_carrera, nombre, horarios, salon, grupo, cupo, docente } = req.body;
  console.log('Datos recibidos para crear la materia:', req.body);

  try {
    if (!id_carrera) {
      return res.status(400).json({ message: "El campo id_carrera es obligatorio." });
    }

    let docenteObjectId = null;

    if (docente) {
      // Buscar el docente por matrícula en la colección 'Docentes'
      const docenteEncontrado = await Docentes.findOne({ personalMatricula: docente });

      if (!docenteEncontrado) {
        return res.status(400).json({ message: "Docente no encontrado" });
      }

      docenteObjectId = docenteEncontrado._id;  // Usar el ObjectId del docente

      console.log('Docente encontrado, matrícula:', docenteObjectId);
    } else {
      console.error('Docente no encontrado:', docenteObjectId);
    }

    // Crear la materia con la matrícula del docente
    const newMateria = new Materia({ 
      id_materia, 
      id_carrera, 
      nombre, 
      horarios, 
      salon, 
      grupo, 
      cupo, 
      docente: docenteObjectId  // Guardamos la matrícula en lugar de ObjectId
    });

    await newMateria.save();
    console.log('Materia creada:', newMateria);

    if (docenteObjectId) {
      await Docentes.findByIdAndUpdate(
        docenteObjectId,
        { $addToSet: { materias: newMateria._id } }, // Evita duplicados
        { new: true }
      );
      console.log(`Materia ${newMateria._id} agregada al docente ${docenteObjectId}`);
    }

    res.status(201).json(newMateria);
  } catch (error) {
    console.error('Error al crear la materia:', error);
    res.status(500).json({ message: 'Error al crear la materia', error: error.message });
  }
};



// Obtener todas las materias
exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();

    const materiasConDocente = await Promise.all(
      materias.map(async (materia) => {
        if (!materia.docente) {
          return { ...materia.toObject(), docenteNombre: "Sin asignar" };
        }

        // Buscar el docente en la colección Docentes usando el ObjectId
        const docente = await Docentes.findById(materia.docente);

        if (!docente) {
          return { ...materia.toObject(), docenteNombre: "Sin asignar" };
        }

        // Buscar el nombre del personal en la colección Personal usando personalMatricula
        const personal = await Personal.findOne({ matricula: docente.personalMatricula });

        return {
          ...materia.toObject(),
          docenteNombre: personal ? personal.nombre : "Sin asignar",
        };
      })
    );

    console.log(materiasConDocente); // Para depuración
    res.status(200).json(materiasConDocente);
  } catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ message: "Error al obtener materias", error });
  }
};

// Obtener materias por id_carrera e incluir el nombre del docente
exports.getMateriasByCarreraId = async (req, res) => {
  const { id_carrera } = req.params;
  console.log("ID de carrera recibido:", id_carrera);

  // Verificar si el id_carrera está en la lista permitida
  if (!carrerasPermitidas.includes(id_carrera)) {
    return res.status(400).json({ message: "ID de carrera no válido" });
  }

  try {
    // Filtra las materias por id_carrera en la base de datos
    const materias = await Materia.find({ id_carrera: id_carrera });

    if (!materias.length) {
      return res.status(404).json({ mensaje: "No se encontraron materias para esta carrera" });
    }

    // Obtener el nombre del docente asociado a cada materia
    const materiasConDocente = await Promise.all(
      materias.map(async (materia) => {
        if (!materia.docente) {
          return { ...materia.toObject(), docenteNombre: "Sin asignar" };
        }

        // Buscar el docente en la colección Docentes usando el ObjectId
        const docente = await Docentes.findById(materia.docente);

        if (!docente) {
          return { ...materia.toObject(), docenteNombre: "Sin asignar" };
        }

        // Buscar el nombre del personal en la colección Personal usando personalMatricula
        const personal = await Personal.findOne({ matricula: docente.personalMatricula });

        return {
          ...materia.toObject(),
          docenteNombre: personal ? personal.nombre : "Sin asignar",
        };
      })
    );

    console.log(materiasConDocente); // Para depuración
    res.status(200).json(materiasConDocente);
  } catch (error) {
    console.error("Error al obtener materias:", error);
    res.status(500).json({ mensaje: "Error interno al obtener materias", error });
    
  }
};


// Obtener una materia por ID
exports.getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id).populate('docente');
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la materia', error });
  }
};

//Actualizar materia
exports.updateMateria = async (req, res) => {
  const { nombre, horarios, salon, grupo, cupo, docente, id_materia } = req.body;
  console.log('Datos recibidos para crear la materia:', req.body);
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de materia no válido" });
  }

  try {
    // Buscar la materia antes de actualizarla
    const materiaAnterior = await Materia.findById(id);
    if (!materiaAnterior) {
      return res.status(404).json({ message: "Materia no encontrada" });
    }

    let docenteObjectId = null;

    if (docente) {
      // Buscar el nuevo docente por personalMatricula
      const docenteEncontrado = await Docentes.findOne({ personalMatricula: docente });

      if (!docenteEncontrado) {
        return res.status(400).json({ message: "Docente no encontrado" });
      }

      docenteObjectId = docenteEncontrado._id; // Obtener ObjectId del docente
    }

    // Actualizar la materia con el nuevo docente (si hay)
    const materia = await Materia.findByIdAndUpdate(
      id,
      { nombre, horarios, salon, grupo, cupo, docente: docenteObjectId },
      { new: true }
    );

    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada" });
    }

    // 🔴 Si la materia tenía un docente anterior diferente, eliminarla de su lista de materias
    if (materiaAnterior.docente && (!docenteObjectId || !materiaAnterior.docente.equals(docenteObjectId))) {
      await Docentes.findByIdAndUpdate(
        materiaAnterior.docente,
        { $pull: { materias: materiaAnterior._id } } // Remueve la materia de la lista del docente anterior
      );
      console.log(`Materia ${id} eliminada de docente anterior`);
    }

    // 🟢 Si hay un nuevo docente, agregar la materia a su lista
    if (docenteObjectId) {
      await Docentes.findByIdAndUpdate(
        docenteObjectId,
        { $addToSet: { materias: materia._id } }, // Asegura que no se duplique
        { new: true }
      );
      console.log(`Materia ${id} agregada a docente ${docenteObjectId}`);
    }

    console.log("Materia actualizada correctamente:", materia);
    res.status(200).json(materia);
  } catch (error) {
    console.error("Error en updateMateria:", error);
    res.status(500).json({ message: "Error al actualizar la materia", error });
  }
};




// Eliminar una materia
exports.deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(204).json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la materia', error });
  }
};

//Subir csv
exports.subirMateriasCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha enviado ningún archivo CSV" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        const idsCSV = results.map((materia) => materia.id_materia);

        for (const materiaData of results) {
          let { id_materia, nombre, salon, grupo, cupo, docente, 
                lunes, martes, miercoles, jueves, viernes, sabado } = materiaData;

          // ✅ Si el docente es "Sin asignar" o está vacío, guardarlo como null
          if (!docente || docente === "Sin asignar") {
            docente = null;
          }

          // ✅ Construir el objeto de horarios a partir de las columnas
          const horariosFinal = {
            lunes: lunes !== "-" ? lunes : null,
            martes: martes !== "-" ? martes : null,
            miercoles: miercoles !== "-" ? miercoles : null,
            jueves: jueves !== "-" ? jueves : null,
            viernes: viernes !== "-" ? viernes : null,
            sabado: sabado !== "-" ? sabado : null
          };

          // 📌 Busca y actualiza, si no existe lo crea
          await Materia.findOneAndUpdate(
            { id_materia },
            { nombre, horarios: horariosFinal, salon, grupo, cupo, docente },
            { upsert: true, new: true }
          );
        }

        // 🔥 Eliminar registros de la BD que ya no estén en el CSV
        await Materia.deleteMany({ id_materia: { $nin: idsCSV } });

        fs.unlinkSync(req.file.path); // Eliminar archivo después de procesarlo
        res.status(200).json({ message: "Base de datos de materias actualizada con éxito desde el archivo CSV" });

      } catch (error) {
        console.error("Error al procesar el CSV:", error);
        res.status(500).json({ message: "Error al actualizar la base de datos de materias desde el CSV", error });
      }
    })
    .on("error", (err) => {
      console.error("Error al leer el CSV:", err);
      res.status(500).json({ message: "Error al procesar el archivo CSV", error: err });
    });
};



// Exportar materias a CSV
exports.exportarMateriasCSV = async (req, res) => {
  try {
    const materias = await Materia.find(); // Obtén todas las materias

    const formattedData = materias.map((m) => ({
      id_materia: m.id_materia,
      nombre: m.nombre,
      salon: m.salon,
      grupo: m.grupo,
      cupo: m.cupo,
      docente: m.docente || "Sin asignar", // Si no tiene docente, mostrar "Sin asignar"
      lunes: m.horarios.lunes || "-", 
      martes: m.horarios.martes || "-",
      miercoles: m.horarios.miercoles || "-",
      jueves: m.horarios.jueves || "-",
      viernes: m.horarios.viernes || "-",
      sabado: m.horarios.sabado || "-"
    }));

    const fields = ["id_materia", "nombre", "salon", "grupo", "cupo", "docente", 
                    "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedData);

    res.header("Content-Type", "text/csv");
    res.attachment("materias.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error al exportar a CSV", error });
  }
};
