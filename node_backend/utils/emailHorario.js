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

// Enviar correo con o sin adjunto
async function enviarCorreo({ to, subject, text, html, attachments }) {
  const mailOptions = {
    from: '"Control Escolar" <rogerzma500@gmail.com>',
    to,
    subject,
    text,
    html,
    attachments
  };
  return transporter.sendMail(mailOptions);
}

module.exports = enviarCorreo;
