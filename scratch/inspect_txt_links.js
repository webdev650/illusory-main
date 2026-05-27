const fs = require('fs');
const path = require('path');

function inspectFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`${filename} does not exist.`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf16le');
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  console.log(`=== FILE: ${filename} ===`);
  console.log(`Total lines: ${lines.length}`);
  console.log(`First 5 lines:`);
  lines.slice(0, 5).forEach((line, idx) => console.log(`  ${idx + 1}: ${line}`));
  
  // Find distinct cloud names in URLs (e.g. res.cloudinary.com/<cloud_name>/)
  const cloudNames = new Set();
  const urlRegex = /res\.cloudinary\.com\/([^/]+)/g;
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    cloudNames.add(match[1]);
  }
  console.log(`Distinct cloud names found:`, Array.from(cloudNames));
  console.log('---------------------------------\n');
}

inspectFile('cloudinary_links_clean.txt');
inspectFile('cloudinary_links_new.txt');
inspectFile('cloudinary_links.txt');
