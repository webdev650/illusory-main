const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../backend/package.xlsx.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet1 = workbook.Sheets['Sheet1'];
const data1 = xlsx.utils.sheet_to_json(sheet1);

console.log('--- ALL ROWS IN SHEET 1 ---');
console.log(JSON.stringify(data1, null, 2));
