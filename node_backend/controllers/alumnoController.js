const { Parser } = require('json2csv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Alumno = require('../models/Alumno');
const Horario = require('../models/Horario');
const Personal = require('../models/Personal');
const Tutor = require('../models/Tutores');
const Docente = require('../models/Docentes');
const Coordinador = require('../models/Coordinadores');
const Administrador = require('../models/Administradores');


// Configurar multer para manejar el archivo CSV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // El archivo se guardará en la carpeta "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombrar el archivo con el timestamp
  },
});

const upload = multer({ storage: storage });

exports.upload = upload;


// Función para asignar un alumno a un tutor
const asignarAlumnoATutor = async (tutorId, alumnoId) => {
  try {
    const tutorAsignado = await Personal.findById(tutorId);
    if (!tutorAsignado) {
      console.log('Tutor no encontrado');
      return;
    }

    const TutorModel = await Tutor.findOne({ personalMatricula: tutorAsignado.matricula });
    const DocenteModel = await Docente.findOne({ personalMatricula: tutorAsignado.matricula });
    const CoordinadorModel = await Coordinador.findOne({ personalMatricula: tutorAsignado.matricula });
    const AdministradorModel = await Administrador.findOne({ personalMatricula: tutorAsignado.matricula });

    if (TutorModel) {
      TutorModel.alumnos.push(alumnoId);
      await TutorModel.save();
      console.log('Alumno agregado a la lista de alumnos del tutor');
    }
    if (DocenteModel) {
      DocenteModel.alumnos.push(alumnoId);
      await DocenteModel.save();
      console.log('Alumno agregado a la lista de alumnos del docente');
    }
    if (CoordinadorModel) {
      CoordinadorModel.alumnos.push(alumnoId);
      await CoordinadorModel.save();
      console.log('Alumno agregado a la lista de alumnos del coordinador');
    }
    if (AdministradorModel) {
      AdministradorModel.alumnos.push(alumnoId);
      await AdministradorModel.save();
      console.log('Alumno agregado a la lista de alumnos del administrador');
    }
  } catch (error) {
    console.error('Error al asignar el alumno al tutor:', error);
  }
};


// Crear un nuevo alumno
exports.createAlumno = async (req, res) => {
  console.log('----Alumno:', req.body);
  const { matricula, nombre, telefono, correo, tutor, matriculaCord } = req.body;

  try {
    // Buscar al coordinador por su id
    const coordinador = await Coordinador.findOne({ personalMatricula: matriculaCord });
    if (!coordinador) {
      console.log('Tutor no encontrado');
      return res.status(404).json({ message: 'Tutor no encontrado' });
    }

    // Crear un nuevo alumno
    const id_carrera = coordinador.id_carrera;
    console.log('ID de carrera:', id_carrera);
    const horario = null; // El horario se asignará después
    const newAlumno = new Alumno({ id_carrera, matricula, nombre, telefono, correo, horario, tutor });
    await newAlumno.save();

      
    // Asignar el alumno al tutor
    await asignarAlumnoATutor(tutor, newAlumno._id);


    res.status(201).json(newAlumno);
  } catch (error) {
    console.error('Error al crear el alumno:', error);
    res.status(500).json({ message: 'Error al crear el alumno', error });
  }
};

// Obtener todos los alumnos
exports.getAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumnos', error });
  }
};
// Obtener los alumnos de una carrera específica (administradores)
exports.getAlumnosCarreraAdmin = async (req, res) => {
  console.log('Obteniendo alumnos de una carrera');

  try {
    const { matricula } = req.params;
    console.log('Matrícula recibida:', matricula);


      const personal = await Administrador.findOne({ personalMatricula: matricula });
      if (personal) {
        console.log('Administrador encontrado');
      } else {
        console.log('No se encontró un administrador con la matrícula proporcionada.');
        return res.status(404).json({ message: 'No se encontró un administrador con esa matrícula.' });
      }
    

      // Obtener el id_carrera del personal encontrado
      const carrera = personal.id_carrera;
      console.log('ID de carrera:', carrera);

      // Buscar alumnos por la carrera obtenida
      const alumnos = await Alumno.find({ id_carrera: carrera });

      console.log('Alumnos encontrados:', alumnos);
      res.status(200).json(alumnos);

    } catch (error) {
      console.error('Error al obtener alumnos de la carrera:', error);
      res.status(500).json({ message: 'Error al obtener alumnos de la carrera', error });
    }
  };

  // Obtener los alumnos de una carrera específica
exports.getAlumnosCarrera = async (req, res) => {
  console.log('Obteniendo alumnos de una carrera');

  try {
    const { matricula } = req.params;
    console.log('Matrícula recibida:', matricula);


      const personal = await Coordinador.findOne({ personalMatricula: matricula });
      if (personal) {
        console.log('Coordinador encontrado');
      } else {
        console.log('No se encontró un coordinador con la matrícula proporcionada.');
        return res.status(404).json({ message: 'No se encontró un coordinador con esa matrícula.' });
      }
    
    

      // Obtener el id_carrera del personal encontrado
      const carrera = personal.id_carrera;
      console.log('ID de carrera:', carrera);

      // Buscar alumnos por la carrera obtenida
      const alumnos = await Alumno.find({ id_carrera: carrera });

      console.log('Alumnos encontrados:', alumnos);
      res.status(200).json(alumnos);

    } catch (error) {
      console.error('Error al obtener alumnos de la carrera:', error);
      res.status(500).json({ message: 'Error al obtener alumnos de la carrera', error });
    }
  };


// Ruta para obtener los alumnos de un tutor específico
exports.getAlumnosAsignados = async (req, res) => {
  console.log('Obteniendo alumnos asignados a un tutor');
  const { matricula } = req.params;
  try {
    console.log('Matrícula del tutor:', matricula);

    // Buscar al tutor directamente por matrícula
    const personal = await Personal.findOne({ matricula: matricula });

    if (!personal) {
      console.log('personal no encontrado');
      return res.status(404).json({ message: "personal no encontrado" });
    }

    let alumnosIds = [];

    if (personal.roles == 'T') {
      console.log('personal es tutor');
      const tutor = await Tutor.findOne({ personalMatricula: matricula });
      if (!tutor) {
        console.log('Tutor no encontrado');
        return res.status(404).json({ message: "Tutor no encontrado" });
      }
      alumnosIds = tutor.alumnos;

    } else if (personal.roles == 'D') {
      console.log('personal es docente');
      const docente = await Docente.findOne({ personal: matricula });
      if (!docente) {
        console.log('Docente no encontrado');
        return res.status(404).json({ message: "Docente no encontrado" });
      }
      alumnosIds = docente.alumnos;

    } else if (personal.roles == 'C') {
      console.log('personal es coordinador');
      const coordinador = await Coordinador.findOne({ personalMatricula: matricula });
      if (!coordinador) {
        console.log('Coordinador no encontrado');
        return res.status(404).json({ message: "Coordinador no encontrado" });
      }
      alumnosIds = coordinador.alumnos;

    } else {
      console.log('Rol no válido');
      return res.status(400).json({ message: "Rol no válido" });
    }

    // Obtener los detalles completos de los alumnos
    const alumnos = await Alumno.find({ _id: { $in: alumnosIds } });

    res.status(200).json(alumnos);
  } catch (error) {
    console.error("Error al obtener los alumnos del tutor:", error);
    res.status(500).json({ message: "Error al obtener los alumnos del tutor" });
  }
};


// Obtener un alumno por ID
exports.getAlumnoById = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error });
  }
};

// Obtener los datos de un alumno, incluyendo su horario
exports.getAlumnoByIdWithHorario = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id).populate('horario');
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno con horario', error });
  }
};

// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
  const { matricula, nombre, correo, telefono, materiasSeleccionadas, tutor } = req.body;
  console.log('Datos:', matricula, nombre, correo, telefono, tutor);

  try {
    let horarioGuardado = null;

    let alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      console.log('Alumno no encontrado');
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Eliminar al alumno del tutor anterior
    if (alumno) {
      const tutorAnteriorAsignado = await Personal.findById(alumno.tutor);
      if (tutorAnteriorAsignado) {
        const TutorModel = await Tutor.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const DocenteModel = await Docente.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const CoordinadorModel = await Coordinador.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const AdministradorModel = await Administrador.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });

        if (TutorModel) {
          TutorModel.alumnos = TutorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await TutorModel.save();
          console.log('Alumno eliminado de la lista del tutor anterior');
        } else if (DocenteModel) {
          DocenteModel.alumnos = DocenteModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await DocenteModel.save();
          console.log('Alumno eliminado de la lista del docente anterior');
        } else if (CoordinadorModel) {
          CoordinadorModel.alumnos = CoordinadorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await CoordinadorModel.save();
          console.log('Alumno eliminado de la lista del coordinador anterior');
        } else if (AdministradorModel) {
          AdministradorModel.alumnos = AdministradorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await AdministradorModel.save();
          console.log('Alumno eliminado de la lista del administrador anterior');
        }
      }
    }

    // Buscar el nuevo tutor
    const tutorAsignado = await Personal.findById(tutor);
    if (!tutorAsignado) {
      console.log('Tutor no encontrado');
    }

    // Buscar el tutor en las colecciones Tutor, Docente y Coordinador
    const TutorModel = await Tutor.findOne({ personalMatricula: tutorAsignado.matricula });
    const DocenteModel = await Docente.findOne({ personalMatricula: tutorAsignado.matricula });
    const CoordinadorModel = await Coordinador.findOne({ personalMatricula: tutorAsignado.matricula });
    const AdministradorModel = await Administrador.findOne({ personalMatricula: tutorAsignado.matricula });
    console.log('Tutor encontrado:', TutorModel || DocenteModel || CoordinadorModel);

    if (!TutorModel && !DocenteModel && !CoordinadorModel && !AdministradorModel) {
      console.log('No se encontró un tutor en la base de datos con matrícula:', tutorAsignado.matricula);
    }

    // Agregar el alumno al nuevo tutor
    if (TutorModel) {
      TutorModel.alumnos.push(alumno._id);
      await TutorModel.save();
      console.log('Alumno agregado a la lista de alumnos del tutor');
    }
    if (DocenteModel) {
      DocenteModel.alumnos.push(alumno._id);
      await DocenteModel.save();
      console.log('Alumno agregado a la lista de alumnos del docente');
    }
    if (CoordinadorModel) {
      CoordinadorModel.alumnos.push(alumno._id);
      await CoordinadorModel.save();
      console.log('Alumno agregado a la lista de alumnos del coordinador');
    }
    if (AdministradorModel) {
      AdministradorModel.alumnos.push(alumno._id);
      await AdministradorModel.save();
      console.log('Alumno agregado a la lista de alumnos del administrador');
    }

    // Actualizar el alumno con los nuevos datos
    const alumnoActualizado = await Alumno.findByIdAndUpdate(
      req.params.id,
      {
        matricula,
        nombre,
        correo,
        telefono,
        ...(horarioGuardado ? { horario: horarioGuardado._id } : {}),
         tutor,
      },
      { new: true }
    );

    if (!alumnoActualizado) {
      console.log('Alumno no encontrado');
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    return res.status(200).json(alumnoActualizado);
  } catch (error) {
    console.error('Error al actualizar el alumno:', error);
    return res.status(500).json({ message: 'Error al actualizar el alumno', error });
  }
};
// Actualizar un alumno con horario
exports.updateAlumnoHorario = async (req, res) => {
  const { correo, telefono, materiasSeleccionadas } = req.body;
  console.log('Datos:', correo, telefono, materiasSeleccionadas);

  try {
    let alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      console.log('Alumno no encontrado');
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Crear un nuevo horario con la lista de materias seleccionadas
    const nuevoHorario = new Horario({
      materias: materiasSeleccionadas
    });

    // Guardar el nuevo horario en la base de datos
    const horarioGuardado = await nuevoHorario.save();
    console.log('Horario guardado:', horarioGuardado);

    // Actualizar el alumno con los nuevos datos
    alumno.correo = correo || alumno.correo;
    alumno.telefono = telefono || alumno.telefono;
    alumno.horario = horarioGuardado._id;

    const alumnoActualizado = await alumno.save();

    return res.status(200).json(alumnoActualizado);
  } catch (error) {
    console.error('Error al actualizar el alumno con horario:', error);
    return res.status(500).json({ message: 'Error al actualizar el alumno con horario', error });
  }
};

// Eliminar un alumno
exports.deleteAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    // Eliminar el horario del alumno si no es nulo
    if (alumno.horario) {
      await Horario.findByIdAndDelete(alumno.horario);
      console.log('Horario del alumno eliminado');
    }

    // Eliminar el ID del alumno de la lista de alumnos del tutor asignado
    if (alumno.tutor) {
      const tutorAsignado = await Personal.findById(alumno.tutor);
      if (tutorAsignado) {
        const TutorModel = await Tutor.findOne({ personalMatricula: tutorAsignado.matricula });
        const DocenteModel = await Docente.findOne({ personalMatricula: tutorAsignado.matricula });
        const CoordinadorModel = await Coordinador.findOne({ personalMatricula: tutorAsignado.matricula });
        const AdministradorModel = await Administrador.findOne({ personalMatricula: tutorAsignado.matricula });

        if (TutorModel) {
          TutorModel.alumnos = TutorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await TutorModel.save();
          console.log('Alumno eliminado de la lista del tutor');
        }
        if (DocenteModel) {
          DocenteModel.alumnos = DocenteModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await DocenteModel.save();
          console.log('Alumno eliminado de la lista del docente');
        }
        if (CoordinadorModel) {
          CoordinadorModel.alumnos = CoordinadorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await CoordinadorModel.save();
          console.log('Alumno eliminado de la lista del coordinador');
        }
        if (AdministradorModel) {
          AdministradorModel.alumnos = AdministradorModel.alumnos.filter(alumnoId => alumnoId.toString() !== alumno._id.toString());
          await AdministradorModel.save();
          console.log('Alumno eliminado de la lista del administrador');
        }
      }
    }

    // Eliminar el alumno
    await Alumno.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Alumno eliminado' });
  } catch (error) {
    
    res.status(500).json({ message: 'Error al eliminar el alumno', error });
  }
};


// Subir datos desde CSV a la base de datos
exports.subirAlumnosCSV = async (req, res) => {
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
        const matriculasCSV = results.map((alumno) => alumno.matricula); // Guardamos solo las matrículas del CSV

        for (const alumnoData of results) {
          const { matricula, nombre, telefono, correo } = alumnoData;

          // Busca y actualiza, si no existe lo crea
          await Alumno.findOneAndUpdate(
            { matricula }, // Busca por matrícula
            { nombre, telefono, correo }, // Actualiza estos campos
            { upsert: true, new: true } // upsert: true -> crea si no existe
          );
        }

        // Eliminar registros de la BD que ya no estén en el CSV
        await Alumno.deleteMany({ matricula: { $nin: matriculasCSV } });

        fs.unlinkSync(req.file.path); // Eliminar el archivo una vez procesado
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

exports.exportarAlumnosCSV = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); // Obtén todos los alumnos
    const fields = ['matricula', 'nombre', 'telefono', 'correo']; // Campos del CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(alumnos);

    res.header('Content-Type', 'text/csv');
    res.attachment('alumnos.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error al exportar a CSV', error });
  }
};

//Obtener el estatus del horario del alumno
exports.getEstatusHorario = async (req, res) => {
  try {
    const { matricula } = req.params;
    const alumno = await Alumno.findOne({ matricula }); 
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    const horario = await Horario.findById(alumno.horario);
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.status(200).json(horario.estatus);
  }
  catch (error) {
    console.error('Error al obtener el estatus del horario:', error);
    res.status(500).json({ message: 'Error al obtener el estatus del horario', error });
  }
}

exports.exportarAlumnosCSVPorCarrera = async (req, res) => {
  try {
    const { id_carrera } = req.params; // Obtener el id_carrera desde la URL

    if (!id_carrera) {
      return res.status(400).json({ message: "Se requiere el id_carrera" });
    }

    const alumnos = await Alumno.find({ id_carrera }); // Filtrar solo por la carrera

    if (alumnos.length === 0) {
      return res.status(404).json({ message: "No hay alumnos registrados para esta carrera" });
    }

    const formattedData = alumnos.map((a) => ({
      matricula: a.matricula,
      nombre: a.nombre,
      telefono: a.telefono,
      correo: a.correo,
      id_carrera: a.id_carrera
    }));

    const fields = ["matricula", "nombre", "telefono", "correo", "id_carrera"];
    const json2csvParser = new Parser({ fields });
    let csv = json2csvParser.parse(formattedData);

    // Agregar BOM para compatibilidad con Excel
    csv = "\ufeff" + csv;

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(`alumnos_carrera_${id_carrera}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("❌ Error al exportar CSV por carrera:", error);
    res.status(500).json({ message: "Error al exportar CSV", error });
  }
};

//Subir csv de alumnos por carrera
exports.subirAlumnosCSVPorCarrera = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha enviado ningún archivo CSV" });
  }

  const results = [];

  fs.createReadStream(req.file.path, { encoding: "utf-8" })
    .pipe(csv())
    .on("data", (data) => {
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

        console.log("✅ Datos obtenidos del CSV después de limpiar:", results);

        // 📌 Obtener la carrera del CSV (de la primera alumno)
        const id_carrera = results[0].id_carrera;

        if (!id_carrera) {
          return res.status(400).json({ message: "No se encontró el ID de la carrera en el archivo CSV" });
        }

        const matriculasCSV = results.map((alumno) => alumno.matricula?.toString().trim()).filter(Boolean);

        await Promise.all(
          results.map(async (alumnoData) => {
            let { matricula, nombre, telefono, correo } = alumnoData;
            matricula = matricula ? matricula.toString().trim() : null;

            if (!matricula) {
              console.warn("⚠ Alumno sin matrícula:", alumnoData);
              return;
            }

            // 🔹 Insertar o actualizar alumno
            const alumnoActualizado = await Alumno.findOneAndUpdate(
              { matricula, id_carrera }, // Filtrar por matrícula y carrera
              { nombre, telefono, correo, id_carrera },
              { upsert: true, new: true }
            );

            console.log(`🔄 Alumno actualizado/insertado: ${matricula}`);
          })
        );

        // 🔥 Solo eliminar alumnos que sean de la misma carrera y no estén en el CSV
        if (matriculasCSV.length > 0) {
          console.log("✅ Eliminando alumnos no incluidos en el CSV de esta carrera.");
          await Alumno.deleteMany({ id_carrera, matricula: { $nin: matriculasCSV } });
        }

        fs.unlinkSync(req.file.path); // Eliminar archivo después de procesarlo
        res.status(200).json({ message: `Base de datos de alumnos de la carrera ${id_carrera} actualizada con éxito desde el CSV` });

      } catch (error) {
        console.error("❌ Error al procesar el CSV:", error);
        res.status(500).json({ message: "Error al actualizar la base de datos de alumnos desde el CSV", error });
      }
    })
    .on("error", (err) => {
      console.error("❌ Error al leer el CSV:", err);
      res.status(500).json({ message: "Error al procesar el archivo CSV", error: err });
    });
};
