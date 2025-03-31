// Ruta para obtener el id_carrera de coordinadores, administradores y personal
const Coordinadores = require('../models/Coordinadores');
const Alumnos = require('../models/Alumno');
const Administradores = require('../models/Administradores');
const Personal = require('../models/Personal');
const Tutores = require('../models/Tutores');
const Docentes = require('../models/Docentes');


// obtener el id_carrera del personal
module.exports.getIdCarrera = async (req, res) => {
    const { matricula } = req.params;
    console.log("Matrícula:", matricula);
    try {
        const coordinador = await Coordinadores.findOne({ personalMatricula: matricula });
        if (coordinador) {
            console.log("Carrera encontrada:", coordinador.id_carrera);
            return res.json({ id_carrera: coordinador.id_carrera });
        }

        const administrador = await Administradores.findOne({ personalMatricula: matricula });
        if (administrador) {
            console.log("Carrera encontrada:", administrador.id_carrera);
            return res.json({ id_carrera: administrador.id_carrera });
        }

        const personal = await Personal.findOne({ matricula });
        if (personal) {
            console.log("Carrera encontrada:", personal.id_carrera);
            return res.json({ id_carrera: personal.id_carrera });
        }

        return res.status(404).json({ message: "No se encontró el usuario" });
    } catch (error) {
        return res.status(500).json({ message: "Error del servidor", error });
    }
};

// Función para asignar un alumno a un tutor
const asignarAlumnoATutor = async (tutorId, alumnoId) => {
    try {
      const tutorAsignado = await Personal.findById(tutorId);
      if (!tutorAsignado) {
        console.log('Tutor no encontrado');
        return;
      }
  
      const TutorModel = await Tutores.findOne({ personalMatricula: tutorAsignado.matricula });
      const DocenteModel = await Docentes.findOne({ personalMatricula: tutorAsignado.matricula });
      const CoordinadorModel = await Coordinadores.findOne({ personalMatricula: tutorAsignado.matricula });
      const AdministradorModel = await Administradores.findOne({ personalMatricula: tutorAsignado.matricula });
  
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

// Ruta para crear un alumno 
module.exports.createAlumno = async (req, res) => {
    const { matricula, nombre, correo, telefono, tutor, id_carrera } = req.body;
    console.log("Datos del alumno:", req.body);
    try {
        // Crear el alumno
        const alumno = new Alumnos({ matricula, nombre, correo, telefono, tutor, id_carrera });
        await alumno.save();

        // Asignar el alumno al tutor
        await asignarAlumnoATutor(tutor, alumno._id);

        return res.status(201).json({ message: "Alumno creado", alumno });
    } catch (error) {
        console.error("Error al crear el alumno:", error);
        return res.status(500).json({ message: "Error del servidor", error });
    }
};

// Actualizar un alumno
exports.updateAlumno = async (req, res) => {
  const { matricula, nombre, correo, telefono, materiasSeleccionadas, tutor, id_carrera } = req.body;
  console.log('Datos:', matricula, nombre, correo, telefono, tutor, id_carrera);

  try {
    let horarioGuardado = null;

    let alumno = await Alumnos.findById(req.params.id);
    if (!alumno) {
      console.log('Alumno no encontrado');
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }

    // Eliminar al alumno del tutor anterior
    if (alumno) {
      const tutorAnteriorAsignado = await Personal.findById(alumno.tutor);
      if (tutorAnteriorAsignado) {
        const TutorModel = await Tutores.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const DocenteModel = await Docentes.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const CoordinadorModel = await Coordinadores.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });
        const AdministradorModel = await Administradores.findOne({ personalMatricula: tutorAnteriorAsignado.matricula });

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
    const TutorModel = await Tutores.findOne({ personalMatricula: tutorAsignado.matricula });
    const DocenteModel = await Docentes.findOne({ personalMatricula: tutorAsignado.matricula });
    const CoordinadorModel = await Coordinadores.findOne({ personalMatricula: tutorAsignado.matricula });
    const AdministradorModel = await Administradores.findOne({ personalMatricula: tutorAsignado.matricula });
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
    const alumnoActualizado = await Alumnos.findByIdAndUpdate(
      req.params.id,
      {
        matricula,
        id_carrera,
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

// Ruta para obtener tutores
module.exports.getTutores = async (req, res) => {
    console.log("Obteniendo tutores");
    try {
        const personal = await Personal.find({});
        
        // Filtrar los perfiles que solo tengan roles T (Tutores), D (Directores), C (Coordinadores), A (Administradores) o CG (Coordinadores Generales)
        const filteredTutors = personal.filter(p => 
            p.roles.some(role => ['T', 'D', 'C', 'A', 'CG'].includes(role))
        );
        
        console.log("Tutores encontrados:", filteredTutors);
        return res.json({ tutors: filteredTutors }); // Devolver un objeto con la propiedad 'tutors'
    } catch (error) {
        console.error("Error al obtener tutores:", error);
        return res.status(500).json({ message: "Error del servidor", error });
    }
};
