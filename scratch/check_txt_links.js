const fs = require('fs');
const path = require('path');

function run() {
  const filePath = path.join(__dirname, '../cloudinary_links_new.txt');
  const content = fs.readFileSync(filePath, 'utf16le');
  
  const lines = content.split('\n');
  const urls = [];
  
  lines.forEach(line => {
    const match = line.match(/(https?:\/\/res\.cloudinary\.com\/[^\s]+)/);
    if (match) {
      urls.push(match[1].trim());
    }
  });
  
  const uniqueUrls = Array.from(new Set(urls));
  console.log(`Found ${uniqueUrls.length} unique Cloudinary URLs:`);
  uniqueUrls.forEach((u, i) => console.log(`${i+1}. ${u}`));
}

run();
