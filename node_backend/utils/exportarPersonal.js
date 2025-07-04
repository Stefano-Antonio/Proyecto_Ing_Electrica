const ExcelJS = require('exceljs');
const Personal = require('../models/Personal');
const path = require('path');

async function exportarPersonal(semestre, outputPath) {
  // Si el personal no tiene semestre, puedes quitar el filtro o adaptarlo
  const personal = await Personal.find();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Personal');

  worksheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Matrícula', key: 'matricula', width: 20 },
    { header: 'Correo', key: 'correo', width: 30 },
    { header: 'Teléfono', key: 'telefono', width: 20 },
    { header: 'Roles', key: 'roles', width: 20 }
  ];

  personal.forEach(p => worksheet.addRow(p));
  const filePath = path.join(outputPath, 'personal.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { exportarPersonal };
