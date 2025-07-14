const PDFDocument = require('pdfkit');

function generarPDFHorario(nombreAlumno, carrera, materias) {
  if (!Array.isArray(materias)) materias = [];

  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));

  // === Encabezado ===
  doc.fontSize(25).font('Helvetica-Bold').text('UNIVERSIDAD AUTÓNOMA DE ZACATECAS', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(20).font('Helvetica').text(`Alumno: ${nombreAlumno}`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(14).text(`Carrera: ${carrera}`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(12).fillColor('gray')
    .text('Este documento es de carácter informativo y carece de validez oficial.', { align: 'center' });
  doc.fillColor('black');
  doc.moveDown(1.2);

  // === Configuración de columnas ===
  const startY = doc.y;
  const colWidths = {
    materia: 120,
    grupo: 60,
    salon: 60,
    dias: 70, // ancho por día
  };

  const colPositions = {
    materia: 40,
    grupo: 40 + colWidths.materia + 10,
    salon: 40 + colWidths.materia + 10 + colWidths.grupo + 10,
  };

  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  diasSemana.forEach((dia, i) => {
    colPositions[dia] = colPositions.salon + colWidths.salon + 10 + i * (colWidths.dias + 5);
  });

  // === Encabezados de la tabla ===
  doc.fontSize(11).font('Helvetica-Bold');
  doc.text('Materia', colPositions.materia, startY, { width: colWidths.materia });
  doc.text('Grupo', colPositions.grupo, startY, { width: colWidths.grupo });
  doc.text('Salón', colPositions.salon, startY, { width: colWidths.salon });

  diasSemana.forEach((dia) => {
    doc.text(dia.charAt(0).toUpperCase() + dia.slice(1), colPositions[dia], startY, {
      width: colWidths.dias,
      align: 'center',
    });
  });

  // Línea debajo del encabezado
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(800, doc.y).stroke();

  // === Filas de datos ===
  doc.font('Helvetica');
  materias.forEach((materia) => {
    const rowTop = doc.y + 4;

    // Verificación de salto de página
    if (rowTop > doc.page.height - 60) {
      doc.addPage();
    }

    // Ajuste de texto con salto de línea automático
    doc.fontSize(10);
    doc.text(materia.nombre || '', colPositions.materia, rowTop, {
      width: colWidths.materia,
      lineGap: 2,
    });

    doc.text(materia.grupo || '', colPositions.grupo, rowTop, {
      width: colWidths.grupo,
      align: 'center',
    });

    doc.text(materia.salon || '', colPositions.salon, rowTop, {
      width: colWidths.salon,
      align: 'center',
    });

    diasSemana.forEach((dia) => {
      const hora = materia.horarios?.[dia] || '';
      doc.text(hora, colPositions[dia], rowTop, {
        width: colWidths.dias,
        align: 'center',
      });
    });

    doc.moveDown(2);
    doc.moveTo(40, doc.y).lineTo(800, doc.y).strokeColor('#e0e0e0').stroke();
    doc.strokeColor('black');
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}

module.exports = generarPDFHorario;
