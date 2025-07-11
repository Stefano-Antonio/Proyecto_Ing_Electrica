const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

function generarPDFHorario(nombreAlumno, carrera, materias) {
  if (!Array.isArray(materias)) materias = [];
  // 1. Documento en horizontal
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  // Título
  doc.fontSize(25).text(`UNIVERSIDAD AUTONOMA DE ZACATECAS`, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(20).text(`Alumno:  ${nombreAlumno}`, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).text(`Carrera: ${carrera}`, { align: 'center' });
  doc.moveDown(1.5);

  // 2. Encabezados de la tabla
  const tableTop = doc.y;
  const col1 = 40, col2 = 180, col3 = 260;
  const colDias = [340, 420, 500, 580, 660, 740]; // Lunes a Sábado

  doc.fontSize(12).text('Materia', col1, tableTop, { bold: true });
  doc.text('Grupo', col2, tableTop);
  doc.text('Salón', col3, tableTop);

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  diasSemana.forEach((dia, idx) => {
    doc.text(dia.charAt(0).toUpperCase() + dia.slice(1), colDias[idx], tableTop);
  });

  doc.moveDown(0.5);
  doc.moveTo(col1, doc.y).lineTo(820, doc.y).stroke();

  // 3. Filas de la tabla
  materias.forEach((materia) => {
    const y = doc.y + 5;
    doc.fontSize(11)
      .text(materia.nombre || '', col1, y)
      .text(materia.grupo || '', col2, y)
      .text(materia.salon || '', col3, y);

    diasSemana.forEach((dia, idx) => {
      const hora = materia.horarios && materia.horarios[dia] ? materia.horarios[dia] : '';
      doc.text(hora, colDias[idx], y);
    });

    doc.moveDown(1.2);
    doc.moveTo(col1, doc.y).lineTo(820, doc.y).strokeColor('#cccccc').stroke();
    doc.strokeColor('black');
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', reject);
  });
}

module.exports = generarPDFHorario;