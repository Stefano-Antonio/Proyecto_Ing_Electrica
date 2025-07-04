const ExcelJS = require('exceljs');
const Materia = require('../models/Materia');
const path = require('path');

async function exportarMaterias(semestre, outputPath) {
  const materias = await Materia.find({ semestre });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Materias');

  worksheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'ID Materia', key: 'id_materia', width: 20 },
    { header: 'Carrera', key: 'id_carrera', width: 25 },
    { header: 'Grupo', key: 'grupo', width: 10 },
    { header: 'Docente', key: 'docente', width: 30 }
  ];

  materias.forEach(m => worksheet.addRow(m));
  const filePath = path.join(outputPath, 'materias.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { exportarMaterias };
