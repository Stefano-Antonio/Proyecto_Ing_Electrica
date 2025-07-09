const Materia = require('../models/Materia');
const Docentes = require('../models/Docentes');
const Horario = require('../models/Horario');
const Personal = require('../models/Personal');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const carrerasPermitidas = ["ISftw", "IDsr", "IEInd", "ICmp", "IRMca", "ISftwS","IDsr", "IEInd", "ICmp", "IRMca"];


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
  const { id_materia, id_carrera, nombre, semi, horarios, salon, grupo, cupo, laboratorio, docente } = req.body;
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
      semi,
      salon, 
      grupo, 
      cupo, 
      laboratorio: laboratorio || false, // Aseguramos que laboratorio tenga un valor booleano
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
  const { nombre, horarios, salon, semi, grupo, cupo, docente, laboratorio, id_materia } = req.body;
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
      const docenteEncontrado = await Docentes.findById(docente);

      if (!docenteEncontrado) {
        return res.status(400).json({ message: "Docente no encontrado" });
      }

      docenteObjectId = docenteEncontrado._id; // Obtener ObjectId del docente
    }

    // Actualizar la materia con el nuevo docente (si hay)
    const materia = await Materia.findByIdAndUpdate(id,
      { 
        id_materia, 
        nombre, 
        horarios, 
        salon, 
        semi, 
        grupo, 
        cupo, 
        laboratorio: laboratorio === true || laboratorio === "true", // Asegurar que sea booleano
        docente: docenteObjectId 
      },
      { new: true }
    );

    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada" });
    }

    // Si la materia tenía un docente anterior diferente, eliminarla de su lista de materias
    if (materiaAnterior.docente && (!docenteObjectId || !materiaAnterior.docente.equals(docenteObjectId))) {
      await Docentes.findByIdAndUpdate(
        materiaAnterior.docente,
        { $pull: { materias: materiaAnterior._id } } // Remueve la materia de la lista del docente anterior
      );
      
    }

    // Si hay un nuevo docente, agregar la materia a su lista
    if (docenteObjectId) {
      await Docentes.findByIdAndUpdate(
        docenteObjectId,
        { $addToSet: { materias: materia._id } }, // Asegura que no se duplique
        { new: true }
      );
      
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
    const materia = await Materia.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    // Eliminar la materia de los horarios
    await Horario.updateMany(
      { materias: materia._id },
      { $pull: { materias: materia._id } }
    );
    console.log('Materia eliminada de los horarios');

    // Eliminar la materia de la lista de materias de los docentes
    await Docentes.updateMany(
      { materias: materia._id },
      { $pull: { materias: materia._id } }
    );
    console.log('Materia eliminada de la lista de materias de los docentes');

    // Eliminar la materia
    await Materia.findByIdAndDelete(req.params.id);
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

  fs.createReadStream(req.file.path, { encoding: "utf-8" })
    .pipe(csv())
    .on("data", (data) => {
      // 🔹 Normalizar nombres de columnas eliminando comillas dobles
      const cleanedData = {};
      Object.keys(data).forEach((key) => {
        const cleanKey = key.replace(/"/g, "").trim(); // Elimina comillas dobles
        cleanedData[cleanKey] = data[key];
      });

      results.push(cleanedData);
    })
    .on("end", async () => {
      try {
        if (results.length === 0) {
          return res.status(400).json({ message: "El archivo CSV está vacío" });
        }


        const idsCSV = results.map((materia) => materia.id_materia?.toString().trim()).filter(Boolean); // Asegurar que sean Strings y no null

        await Promise.all(
          results.map(async (materiaData) => {
            let { id_materia, id_carrera, nombre, salon, grupo, cupo, docente, 
                  laboratorio, lunes, martes, miercoles, jueves, viernes, sabado } = materiaData;

            id_materia = id_materia ? id_materia.toString().trim() : null; // 🔹 Convertir a String y limpiar

            if (!id_materia) {
              console.warn(" Materia sin id_materia:", materiaData);
              return; // Evita insertar datos sin id_materia
            }

            // 🔹 Buscar la materia actual antes de actualizarla
            const materiaActual = await Materia.findOne({ id_materia });

            // 🔹 Buscar el nuevo docente por su matrícula
            let docenteObjectId = null;
            if (docente && docente !== "Sin asignar") {
              const docenteEncontrado = await Docentes.findOne({ personalMatricula: docente.trim() });
              if (docenteEncontrado) {
                docenteObjectId = docenteEncontrado._id;
              }
            }

            // 🔹 Formatear horarios
            const horariosFinal = {
              lunes: lunes !== "-" ? lunes : null,
              martes: martes !== "-" ? martes : null,
              miercoles: miercoles !== "-" ? miercoles : null,
              jueves: jueves !== "-" ? jueves : null,
              viernes: viernes !== "-" ? viernes : null,
              sabado: sabado !== "-" ? sabado : null
            };

            // 🔹 Insertar o actualizar materia
            const materiaActualizada = await Materia.findOneAndUpdate(
              { id_materia },
              { id_materia, id_carrera, nombre, horarios: horariosFinal, salon, grupo, cupo, laboratorio, docente: docenteObjectId },
              { upsert: true, new: true }
            );

            //  Si la materia ya tenía un docente y ha cambiado, eliminarla del docente anterior
            if (materiaActual && materiaActual.docente && (!docenteObjectId || !materiaActual.docente.equals(docenteObjectId))) {
              await Docentes.findByIdAndUpdate(
                materiaActual.docente,
                { $pull: { materias: materiaActual._id } } // Remueve la materia de la lista del docente anterior
              );
              console.log(`Materia ${id_materia} eliminada del docente anterior.`);
            }

            //  Si hay un nuevo docente, agregar la materia a su lista
            if (docenteObjectId) {
              await Docentes.findByIdAndUpdate(
                docenteObjectId,
                { $addToSet: { materias: materiaActualizada._id } }, // Asegura que no se duplique
                { new: true }
              );
              console.log(`Materia ${id_materia} agregada al docente ${docenteObjectId}`);
            }
          })
        );

        // Solo eliminar materias si hay materias en el CSV
        if (idsCSV.length > 0) {
          console.log(" Eliminando materias no incluidas en el CSV.");
          await Materia.deleteMany({ id_materia: { $nin: idsCSV } });
        }

        fs.unlinkSync(req.file.path); // Eliminar archivo después de procesarlo
        res.status(200).json({ message: "Base de datos de materias actualizada con éxito desde el archivo CSV" });

      } catch (error) {
        console.error(" Error al procesar el CSV:", error);
        res.status(500).json({ message: "Error al actualizar la base de datos de materias desde el CSV", error });
      }
    })
    .on("error", (err) => {
      console.error(" Error al leer el CSV:", err);
      res.status(500).json({ message: "Error al procesar el archivo CSV", error: err });
    });
};


// Exportar materias a CSV
exports.exportarMateriasCSV = async (req, res) => {
  try {
    const materias = await Materia.find().populate('docente'); // Obtén todas las materias y popula el campo docente

    const formattedData = materias.map((m) => ({
      id_materia: m.id_materia,
      id_carrera: m.id_carrera,
      nombre: m.nombre,
      salon: m.salon,
      grupo: m.grupo,
      cupo: m.cupo,
      docente: m.docente ? m.docente.personalMatricula : "Sin asignar", // Usar la matrícula del docente
      laboratorio: m.laboratorio ? "Si" : "No", // <-- Aquí el cambio
      lunes: m.horarios.lunes || "-", 
      martes: m.horarios.martes || "-",
      miercoles: m.horarios.miercoles || "-",
      jueves: m.horarios.jueves || "-",
      viernes: m.horarios.viernes || "-",
      sabado: m.horarios.sabado || "-"
    }));

    const fields = ["id_materia", "id_carrera", "nombre", "salon", "grupo", "cupo", "docente", 
                    "laboratorio", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    
    const json2csvParser = new Parser({ fields });
    let csv = json2csvParser.parse(formattedData);

    // Agregar BOM para que Excel detecte correctamente UTF-8
    csv = '\ufeff' + csv;

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("materias.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Error al exportar a CSV", error });
  }
};

//FUNCIONES DE CSV POR CARRERA

// Exportar CSV por carrera

exports.exportarMateriasCSVPorCarrera = async (req, res) => {
  try {
    const { id_carrera } = req.query; // Obtener el id_carrera desde la URL

    if (!id_carrera) {
      return res.status(400).json({ message: "Se requiere el id_carrera" });
    }

    const materias = await Materia.find({ id_carrera }).populate("docente"); // Filtrar solo por la carrera

    if (materias.length === 0) {
      return res.status(404).json({ message: "No hay materias registradas para esta carrera" });
    }

    const formattedData = materias.map((m) => ({
      id_materia: m.id_materia,
      id_carrera: m.id_carrera,
      nombre: m.nombre,
      salon: m.salon,
      grupo: m.grupo,
      cupo: m.cupo,
      docente: m.docente ? m.docente.personalMatricula : "Sin asignar", // Guardar matrícula del docente
      laboratorio: m.laboratorio ? "Si" : "No", // <-- Aquí el cambio
      lunes: m.horarios.lunes || "-",
      martes: m.horarios.martes || "-",
      miercoles: m.horarios.miercoles || "-",
      jueves: m.horarios.jueves || "-",
      viernes: m.horarios.viernes || "-",
      sabado: m.horarios.sabado || "-",
    }));

    const fields = ["id_materia", "id_carrera", "nombre", "salon", "grupo", "cupo", "docente",
                    "laboratorio", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

    const json2csvParser = new Parser({ fields });
    let csv = json2csvParser.parse(formattedData);

    // Agregar BOM para compatibilidad con Excel
    csv = "\ufeff" + csv;

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(`materias_carrera_${id_carrera}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("❌ Error al exportar CSV por carrera:", error);
    res.status(500).json({ message: "Error al exportar CSV", error });
  }
};

//Exportar CSV por carrera filtrado
exports.exportarCSVPorCarreraFiltrado = async (req, res) => {
  try {
    const { id_carrera } = req.params;
    const { ids } = req.body; // IDs de materias filtradas

    if (!id_carrera || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Se requiere el id_carrera y un array de IDs de materias" });
    }

    const materias = await Materia.find({ _id: { $in: ids }, id_carrera }).populate("docente");

    if (materias.length === 0) {
      return res.status(404).json({ message: "No se encontraron materias con esos filtros" });
    }

    const formattedData = materias.map((m) => ({
      id_materia: m.id_materia,
      id_carrera: m.id_carrera,
      nombre: m.nombre,
      salon: m.salon,
      grupo: m.grupo,
      cupo: m.cupo,
      docente: m.docente ? m.docente.personalMatricula : "Sin asignar",
      laboratorio: m.laboratorio ? "Sí" : "No", // <-- Aquí el cambio
      lunes: m.horarios.lunes || "-",
      martes: m.horarios.martes || "-",
      miercoles: m.horarios.miercoles || "-",
      jueves: m.horarios.jueves || "-",
      viernes: m.horarios.viernes || "-",
      sabado: m.horarios.sabado || "-",
    }));

    const fields = [
      "id_materia", "id_carrera", "nombre", "salon", "grupo", "cupo", "docente",
      "laboratorio", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"
    ];

    const json2csvParser = new Parser({ fields });
    let csv = "\ufeff" + json2csvParser.parse(formattedData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(`materias_filtradas_${id_carrera}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("❌ Error al exportar CSV filtrado de materias:", error);
    res.status(500).json({ message: "Error al exportar", error });
  }
};

//Subir CSV por carrera

exports.subirMateriasCSVPorCarrera = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha enviado ningún archivo CSV" });
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

        console.log("✅ Datos obtenidos del CSV después de limpiar:", results);

        // Detectar carreras únicas en el CSV
        const carrerasUnicasCSV = [...new Set(results.map(m => m.id_carrera?.trim()))];
        const materiasPorCarrera = {};

        results.forEach((materia) => {
          const carrera = materia.id_carrera?.trim();
          const id_materia = materia.id_materia?.toString().trim();
          if (!carrera || !id_materia) return;
          if (!materiasPorCarrera[carrera]) materiasPorCarrera[carrera] = new Set();
          materiasPorCarrera[carrera].add(id_materia);
        });

        await Promise.all(
          results.map(async (materiaData) => {
            let {
              id_materia, id_carrera, nombre, salon, grupo, cupo, docente,
              lunes, martes, miercoles, jueves, viernes, sabado, laboratorio
            } = materiaData;

            id_materia = id_materia ? id_materia.toString().trim() : null;
            id_carrera = id_carrera ? id_carrera.trim() : null;

            if (!id_materia || !id_carrera) {
              console.warn("⚠ Materia sin id_materia o id_carrera:", materiaData);
              return;
            }

            const materiaExistente = await Materia.findOne({ id_materia });

            // Si la materia cambió de carrera, se elimina del plan anterior
            if (materiaExistente && materiaExistente.id_carrera !== id_carrera) {
              await Materia.findByIdAndDelete(materiaExistente._id);
              console.log(`🔥 Materia ${id_materia} movida de ${materiaExistente.id_carrera} a ${id_carrera}`);
            }

            const materiaActual = await Materia.findOne({ id_materia, id_carrera });

            let docenteObjectId = null;
            if (docente && docente !== "Sin asignar") {
              const docenteEncontrado = await Docentes.findOne({ personalMatricula: docente.trim() });
              if (docenteEncontrado) {
                docenteObjectId = docenteEncontrado._id;
              }
            }

            const horariosFinal = {
              lunes: lunes !== "-" ? lunes : null,
              martes: martes !== "-" ? martes : null,
              miercoles: miercoles !== "-" ? miercoles : null,
              jueves: jueves !== "-" ? jueves : null,
              viernes: viernes !== "-" ? viernes : null,
              sabado: sabado !== "-" ? sabado : null
            };

            let laboratorioBool = false;
            if (typeof laboratorio === "string") {
              laboratorioBool = laboratorio.trim().toLowerCase() === "sí" || laboratorio.trim().toLowerCase() === "si";
            }

            const materiaActualizada = await Materia.findOneAndUpdate(
              { id_materia, id_carrera },
              {
                id_materia, id_carrera, nombre,
                horarios: horariosFinal, salon, grupo, cupo,
                docente: docenteObjectId, laboratorio: laboratorioBool
              },
              { upsert: true, new: true }
            );

            // Actualizar relación con docente si cambió
            if (materiaActual && materiaActual.docente &&
                (!docenteObjectId || !materiaActual.docente.equals(docenteObjectId))) {
              await Docentes.findByIdAndUpdate(
                materiaActual.docente,
                { $pull: { materias: materiaActual._id } }
              );
              console.log(`Materia ${id_materia} eliminada del docente anterior.`);
            }

            if (docenteObjectId) {
              await Docentes.findByIdAndUpdate(
                docenteObjectId,
                { $addToSet: { materias: materiaActualizada._id } },
                { new: true }
              );
              console.log(`Materia ${id_materia} asignada al docente ${docenteObjectId}`);
            }
          })
        );

        // 🔐 Realizar limpieza solo si el CSV contiene una sola carrera
        if (carrerasUnicasCSV.length === 1) {
          const carrera = carrerasUnicasCSV[0];
          const idsCSV = Array.from(materiasPorCarrera[carrera]);
          await Materia.deleteMany({
            id_carrera: carrera,
            id_materia: { $nin: idsCSV }
          });
          console.log(`🧹 Materias eliminadas del plan ${carrera} que no están en el CSV.`);
        } else {
          console.log("⚠ CSV contiene múltiples carreras. No se aplica limpieza para evitar pérdida de datos.");
        }

        fs.unlinkSync(req.file.path);
        res.status(200).json({ message: "Base de datos actualizada con éxito desde el CSV" });

      } catch (error) {
        console.error("❌ Error al procesar el CSV:", error);
        res.status(500).json({ message: "Error al actualizar materias desde el CSV", error });
      }
    })
    .on("error", (err) => {
      console.error("❌ Error al leer el CSV:", err);
      res.status(500).json({ message: "Error al procesar el archivo CSV", error: err });
    });
};