const fs = require('fs');
const http = require('https');
const path = require('path');

// Read cloudinary_links_clean.txt which is UTF-16LE
const fileContent = fs.readFileSync(path.join(__dirname, '../cloudinary_links_clean.txt'), 'utf16le');
const urls = fileContent.split(/\r?\n/).map(line => line.trim()).filter(line => line.startsWith('http'));

console.log(`Found ${urls.length} unique Cloudinary URLs in clean file. Testing...`);

function checkUrl(url) {
  return new Promise((resolve) => {
    http.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    }).end();
  });
}

async function run() {
  const results = [];
  for (const url of urls) {
    const res = await checkUrl(url);
    results.push(res);
    console.log(`${res.status === 200 ? '✅' : '❌'} [${res.status}] ${url}`);
  }
  const broken = results.filter(r => r.status !== 200);
  console.log(`\nResults: ${urls.length - broken.length}/${urls.length} working.`);
  if (broken.length > 0) {
    console.log(`\nBroken URLs (${broken.length}):`);
    broken.forEach(b => console.log(`- [${b.status}] ${b.url}`));
  }
}

run();
