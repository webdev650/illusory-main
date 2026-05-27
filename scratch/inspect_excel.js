const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../backend/package.xlsx.xlsx');
console.log('Reading file:', filePath);

try {
  const workbook = xlsx.readFile(filePath);
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log(`\n--- Sheet: ${sheetName} ---`);
    console.log('Number of rows:', data.length);
    if (data.length > 0) {
      console.log('Headers:', Object.keys(data[0]));
      console.log('First row sample:', data[0]);
    }
  });
} catch (error) {
  console.error('Error reading excel file:', error);
}
