// utils/exportarAlumnos.js
const ExcelJS = require('exceljs');
const Alumno = require('../models/Alumno');
const path = require('path');

async function exportarAlumnos(semestre, outputPath) {
  const alumnos = await Alumno.find({ semestre });
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Alumnos');

  worksheet.columns = [
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Matrícula', key: 'matricula', width: 20 },
    { header: 'Carrera', key: 'id_carrera', width: 25 },
    { header: 'Correo', key: 'correo', width: 30 }
  ];

  alumnos.forEach(a => worksheet.addRow(a));
  const filePath = path.join(outputPath, 'alumnos.xlsx');
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { exportarAlumnos };