const nodemailer = require("nodemailer");
const Alumno = require('../models/Alumno');
const Tutor = require('../models/Tutores');
const Personal = require('../models/Personal');
const Horario = require('../models/Horario');
const Materia = require('../models/Materia');
const enviarCorreo = require('../utils/emailHorario');

// Ruta para obtener los alumnos de un tutor específico
exports.getAlumnosAsignados = async (req, res) => {
    console.log('Obteniendo alumnos asignados a un tutor');
    try {
        const { matricula } = req.params;
        console.log('Matrícula del tutor:', matricula);

        // Buscar al tutor directamente por matrícula
        const tutor = await Tutor.findOne({ personalMatricula: matricula }).populate('alumnos');

        if (!tutor) {
            console.log('Tutor no encontrado');
            return res.status(404).json({ message: "Tutor no encontrado" });
        }

        // Devolver la lista de alumnos asociados al tutor
        res.status(200).json({ alumnos: tutor.alumnos });
    } catch (error) {
        console.error("Error al obtener los alumnos del tutor:", error);
        res.status(500).json({ message: "Error al obtener los alumnos del tutor" });
    }
};

// Ruta para obtener el horario completo de un alumno por matrícula
exports.getHorarioAlumno = async (req, res) => {
    console.log('Obteniendo horario de un alumno');
    try {
        const { matricula } = req.params;
        console.log('Matrícula del alumno:', matricula);

        // Buscar al alumno y poblar el horario con las materias
        const alumno = await Alumno.findOne({ matricula }).populate({
            path: 'horario',
            populate: {
                path: 'materias',
                model: 'Materia'
            }
        });

        if (!alumno || !alumno.horario) {
            console.log('Horario no encontrado para este alumno');
            return res.status(404).json({ message: 'Horario no encontrado para este alumno' });
        }

        // Formatear la respuesta para enviarla a la interfaz
        const horarioFormateado = alumno.horario.materias.map(materia => ({
            grupo: materia.grupo,
            salon: materia.salon,
            materia: materia.nombre,
            semi: materia.semi,
            horarios: materia.horarios
        }));

        res.status(200).json({
            alumno: {
                nombre: alumno.nombre,
                matricula: alumno.matricula,
                id_carrera: alumno.id_carrera
            },
            horario: horarioFormateado
        });
    } catch (error) {
        console.error('Error al obtener el horario del alumno:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Ruta para obtener los tutores disponibles para un coordinador
exports.getEstatusHorario = async (req, res) => {
    try {
        const { matricula } = req.params;
        console.log('Obteniendo el estatus del horario para matrícula:', matricula);

        // Buscar al alumno por su matrícula
        const alumno = await Alumno.findOne({ matricula }).populate('horario');

        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        // Si no tiene horario, el estatus es "En espera"
        if (!alumno.horario) {
            return res.json({ estatus: "En espera" });
        }

        // Obtener el estatus del horario
        const estatusHorario = alumno.horario.estatus;

        // Mapear el número del estatus a su significado
        let estatusTexto = "Desconocido";
        switch (estatusHorario) {
            case 0:
                estatusTexto = "Falta de revisar";
                break;
            case 1:
                estatusTexto = "Revisado";
                break;
        }

        res.json({ estatus: estatusTexto });

    } catch (error) {
        console.error("Error al obtener el estatus del horario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Ruta para actualizar el estatus del horario por matrícula
exports.updateEstatusHorario = async (req, res) => {
    console.log('Actualizando el estatus del horario por matrícula');
    try {
      const { matricula } = req.params;
      const { estatus, comentario } = req.body;
      console.log('Matrícula del alumno:', matricula);
      console.log('Nuevo estatus:', estatus);
      console.log('Comentario:', comentario);

      // Buscar al alumno por su matrícula
      const alumno = await Alumno.findOne({ matricula });

      if (!alumno) {
        console.log('Alumno no encontrado');
        return res.status(404).json({ message: "Alumno no encontrado" });
      }

      // Obtener el ID del horario
      const horarioId = alumno.horario;

      if (!horarioId) {
        console.log('El alumno no tiene un horario asignado');
        return res.status(400).json({ message: "El alumno no tiene un horario asignado" });
      }

      // Actualizar el estatus y el comentario del horario
      const horarioActualizado = await Horario.findByIdAndUpdate(
        horarioId,
        { 
          estatus,
          comentario
        },
        { new: true }
      );

      if (!horarioActualizado) {
        console.log('Horario no encontrado');
        return res.status(404).json({ message: "Horario no encontrado" });
      }

      // Enviar correo al alumno
      console.log('Enviando comentario por correo al alumno');
      await enviarCorreo({
        to: alumno.correo,
        subject: "Actualización de estatus de horario",
        text: `Hola ${alumno.nombre},\n\nTu horario ha sido actualizado con el siguiente estatus: "${estatus === 1 ? 'Aceptado' : 'Rechazado'}".\nComentario: "${comentario}".\n\nSaludos.`,
        html: `<p>Hola <strong>${alumno.nombre}</strong>,<br>
               Tu horario ha sido actualizado con el siguiente estatus: <b>${estatus === 1 ? 'Aceptado' : 'Rechazado'}</b>.<br>
               <b>Comentario:</b> ${comentario}<br><br>Saludos.</p>`
      });
      console.log('Correo enviado correctamente');

      res.json({ message: "Estatus y comentario actualizados correctamente", horario: horarioActualizado });
    } catch (error) {
        console.error("Error al actualizar el estatus del horario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Ruta para actualizar el estatus del horario por matrícula
exports.updateEstatusHorarioAdmin = async (req, res) => {
    console.log('Actualizando el estatus del horario por matrícula');
    try {
      const { matricula } = req.params;
      const { estatus, comentario } = req.body;
      console.log('Matrícula del alumno:', matricula);
      console.log('Nuevo estatus:', estatus);
      console.log('Comentario:', comentario);

      // Buscar al alumno por su matrícula
      const alumno = await Alumno.findOne({ matricula });

      if (!alumno) {
        console.log('Alumno no encontrado');
        return res.status(404).json({ message: "Alumno no encontrado" });
      }

      // Obtener el ID del horario
      const horarioId = alumno.horario;

      if (!horarioId) {
        console.log('El alumno no tiene un horario asignado');
        return res.status(400).json({ message: "El alumno no tiene un horario asignado" });
      }

      // Actualizar el estatus y el comentario del horario
      const horarioActualizado = await Horario.findByIdAndUpdate(
        horarioId,
        { 
          estatus,
          comentario
        },
        { new: true }
      );

      if (!horarioActualizado) {
        console.log('Horario no encontrado');
        return res.status(404).json({ message: "Horario no encontrado" });
      }

      // Enviar correo al alumno
      console.log('Enviando comentario por correo al alumno');
      await enviarCorreo({
        to: alumno.correo,
        subject: "Actualización de estatus de horario",
        text: `Hola ${alumno.nombre},\n\nTu horario ha sido actualizado con el siguiente estatus: "${estatus === 1 ? 'Aceptado' : 'Rechazado'}".\nComentario: "${comentario}".\n\nSaludos.`,
        html: `<p>Hola <strong>${alumno.nombre}</strong>,<br>
               Tu horario ha regresado a estatus: PENDIENTE.<br>
               Con las siguientes observaciones:<br><br>
               <b>Comentario:</b> ${comentario}<br><br>Saludos.</p>`
      });
      console.log('Correo enviado correctamente');

      res.json({ message: "Estatus y comentario actualizados correctamente", horario: horarioActualizado });
    } catch (error) {
        console.error("Error al actualizar el estatus del horario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
  
  

// Ruta para eliminar un horario de un alumno y de la base de datos
exports.deleteHorarioAlumno = async (req, res) => {
    console.log('Eliminando horario de un alumno');
    try {
        const { matricula } = req.params;
        console.log('Matricula:', matricula);

        // Buscar al alumno por su matrícula
        const alumno = await Alumno.findOne({ matricula: matricula }); 
        
        // Obtener el ID del horario del alumno
        const horarioId = alumno.horario;

        // Obtener las materias asociadas al horario del alumno
        const horario = await Horario.findById(horarioId).populate('materias');
        if (!horario || !horario.materias) {
            console.log('No se encontraron materias asociadas al horario');
            return res.status(404).json({ message: "No se encontraron materias asociadas al horario" });
        }

        // Eliminar al alumno del array de alumnos de las materias del horario
        const materias = await Materia.updateMany(
            { _id: { $in: horario.materias } }, // Filtrar solo las materias del horario
            { 
            $pull: { alumnos: alumno._id }, // Eliminar al alumno del array
            $inc: { cupo: 1 } // Incrementar el cupo disponible
            }
        );

        if (materias.modifiedCount > 0) {
            console.log('Alumno eliminado de las materias del horario');
        } else {
            console.log('No se realizaron cambios en las materias');
        }


        if (materias){
            console.log('Alumno eliminado de la materia');
        }

        // Eliminar el horario de la colección Horario
        await Horario.findByIdAndDelete(horarioId);
        console.log('Horario eliminado correctamente', horarioId);

        // Establecer el campo 'horario' del alumno en null
        alumno.horario = null;
        console.log('Horario eliminado del el alumno');
        await alumno.save();
        res.status(200).json({ message: "Horario eliminado correctamente" });

    } catch (error) {
        console.error('Error al eliminar el horario:', error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// Ruta para enviar comentarios por correo al alumno
exports.enviarComentarioAlumno = async (req, res) => {
    console.log('Enviando comentario por correo al alumno');
    try {
        const { alumnoId } = req.params;
        const { comentario } = req.body;
        console.log('ID del alumno:', alumnoId);
        console.log('Comentario:', comentario);

        // Buscar al alumno
        const alumno = await Alumno.findById(alumnoId);
        if (!alumno) {
            console.log('Alumno no encontrado');
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        // Configurar el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tuemail@gmail.com", // Cambia esto con tu correo
                pass: "tucontraseña" // Usa variables de entorno en producción
            }
        });

        // Configurar el correo
        const mailOptions = {
            from: "tuemail@gmail.com",
            to: alumno.email, // Asegúrate de que el modelo Alumno tiene un campo 'email'
            subject: "Nuevo comentario recibido",
            text: `Hola ${alumno.nombre},\n\nHas recibido un nuevo comentario:\n"${comentario}"\n\nSaludos.`
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.json({ message: "Comentario enviado por correo al alumno" });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ message: "Error al enviar correo", error });
    }
};