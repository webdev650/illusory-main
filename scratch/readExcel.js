const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../backend/package.xlsx.xlsx');
console.log('Reading:', excelPath);
const workbook = xlsx.readFile(excelPath);

console.log('--- SHEET NAMES ---');
console.log(workbook.SheetNames);

workbook.SheetNames.forEach(name => {
  console.log(`\n=== SHEET: ${name} (First 3 rows) ===`);
  const sheet = workbook.Sheets[name];
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
});
