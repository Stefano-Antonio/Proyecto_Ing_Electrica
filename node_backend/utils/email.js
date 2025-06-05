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

module.exports = enviarCorreoConPDF;
