const Materia = require('../models/Materia');
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

// Crear una nueva materia
exports.createMateria = async (req, res) => {
  const { id_materia, nombre, horarios, salon, grupo, cupo, docente } = req.body;
  console.log('Datos recibidos para crear la materia:', req.body);
  try {

    const docenteFinal = docente.trim() === "" ? null : docente;

    const newMateria = new Materia({ id_materia, nombre, horarios, salon, grupo, cupo, docente: docenteFinal  });
    await newMateria.save();

    console.log('Materia creada:', newMateria);
    res.status(201).json(newMateria);  // Responde con la materia creada
  } catch (error) {
    console.error('Error al crear la materia:', error);
    res.status(500).json({ message: 'Error al crear la materia', error });
  }
};

// Obtener todas las materias
exports.getMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();  // Si necesitas mostrar información del docente
    console.log(materias);  // Agrega esto para ver la respuesta
    res.status(200).json(materias);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ message: 'Error al obtener materias', error });
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

// Actualizar una materia
exports.updateMateria = async (req, res) => {
  const { nombre, horarios, salon, grupo, cupo, docente } = req.body;
  try {
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { nombre, horarios, salon, grupo, cupo, docente },
      { new: true }
    );
    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }
    res.status(200).json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la materia', error });
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
