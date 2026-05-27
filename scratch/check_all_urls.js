const fs = require('fs');
const http = require('https');
const path = require('path');

const seedFileContent = fs.readFileSync(path.join(__dirname, '../backend/src/controllers/seedController.ts'), 'utf8');

// Regex to find all cloudinary URLs
const urlRegex = /https:\/\/res\.cloudinary\.com\/[^\s"',]+/g;
const urls = [...new Set(seedFileContent.match(urlRegex) || [])];

console.log(`Found ${urls.length} unique Cloudinary URLs. Testing...`);

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
