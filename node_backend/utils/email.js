const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false, // true para usar TLS
  port: 587, // Puerto para TLS
  auth: {
    user: 'rogerzma500@gmail.com',
    pass: 'rjfr xiic dcfy lfwx',
  },
  tls: {
    rejectUnauthorized: false // ⚠️ Solo para desarrollo o certificados no válidos
  }
});

async function notificarTutorAsignado(destinatario, nombreTutor, nombreAlumno, matriculaAlumno) {
  const mailOptions = {
    from: '"Control Escolar" <rogerzma500@gmail.com>',
    to: destinatario,
    subject: 'Nuevo alumno asignado',
    html: `
      <p>Hola <strong>${nombreTutor}</strong>,</p>
      <p>Se te ha asignado como tutor del alumno <strong>${nombreAlumno}</strong> con matrícula <strong>${matriculaAlumno}</strong>.</p>
      <p>Gracias por tu compromiso académico.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function notificarAlumnoConTutorAsignado(destinatario, nombreAlumno, nombreTutor, correoTutor) {
  const mailOptions = {
    from: '"Control Escolar" <rogerzma500@gmail.com>',
    to: destinatario,
    subject: 'Asignación de Tutor Académico',
    html: `
      <p>Hola <strong>${nombreAlumno}</strong>,</p>
      <p>Se te ha asignado como tutor académico al profesor <strong>${nombreTutor}</strong>.</p>
      <p>Puedes ponerte en contacto con él a través del correo: <strong>${correoTutor}</strong>.</p>
      <p>Si tienes alguna duda o necesitas apoyo académico, tu tutor será el punto de referencia.</p>
      <p>¡Éxito en tus estudios!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

async function enviarCorreoConPDF(destinatario, pdfBuffer, nombreAlumno) {
  const mailOptions = {
    from: '"Control Escolar" rogerzma500@gmail.com',
    to: destinatario,
    subject: 'Horario de materias inscritas',
    text: `Hola , se adjunta tu horario de materias inscritas.`,
    html: `<p>Hola <strong>${nombreAlumno}</strong>,<br> Se adjunta tu horario de materias inscritas.</p>`,
    attachments: [
      {
        filename: `Horario_${nombreAlumno}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  enviarCorreoConPDF,
  notificarAlumnoConTutorAsignado,
  notificarTutorAsignado
};