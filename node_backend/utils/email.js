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
    from: '"Control Escolar" <rogerzma500@gmail.com>',
    to: destinatario,
    subject: 'Horario de materias inscritas',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 10px;">
        <h2 style="color: #005288;">Universidad Autonoma de Zacatecas</h2>
        <p>Hola <strong>${nombreAlumno}</strong>,</p>

        <p>Adjunto encontrarás el archivo con tu <strong>horario de materias inscritas</strong>.</p>

        <p>Recuerda que este horario es de caracter informativo y aun no tiene validez oficial, por lo que te pedimos, estés al pendiente de la validación de tu tutor.</p>
        <p>Si tienes alguna duda o necesitas más información, ponte en contacto con Control escolar.</p>
        <p style="margin-top: 20px;">¡Te deseamos mucho éxito en este ciclo escolar!</p>

        <p style="margin-top: 30px; font-size: 0.9em; color: #555;">
          Atentamente,<br>
          <strong>Departamento de Control Escolar</strong><br>
          INIFAP C.E. Zacatecas
        </p>
      </div>
    `,
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