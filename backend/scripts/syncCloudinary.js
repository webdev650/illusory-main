const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with user credentials
cloudinary.config({
  cloud_name: 'illusory',
  api_key: '752552312252278',
  api_secret: 'gKi-BP6gGjwhE9_oG6wYtx94e2o'
});

function getPublicId(url) {
  // Matches the path after /upload/ (optionally followed by version vXXXXXX/) and before the file extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

async function run() {
  const filePath = path.join(__dirname, '../../cloudinary_links_new.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Links file not found at: ${filePath}`);
    process.exit(1);
  }

  // Read UTF-16LE content
  const content = fs.readFileSync(filePath, 'utf16le');
  const lines = content.split('\n');
  const urls = [];

  lines.forEach(line => {
    const match = line.match(/(https?:\/\/res\.cloudinary\.com\/dqlmblh5i\/[^\s]+)/);
    if (match) {
      urls.push(match[1].trim());
    }
  });

  const uniqueUrls = Array.from(new Set(urls));
  console.log(`🚀 Found ${uniqueUrls.length} unique Cloudinary assets to transfer...`);

  // Process in batches of 5 to respect rate limits
  const batchSize = 5;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(uniqueUrls.length / batchSize)}...`);
    
    await Promise.all(batch.map(async (url) => {
      const publicId = getPublicId(url);
      if (!publicId) {
        console.error(`⚠️ Could not parse public ID for URL: ${url}`);
        return;
      }
      
      try {
        console.log(`📤 Uploading: ${publicId}...`);
        const result = await cloudinary.uploader.upload(url, {
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true
        });
        console.log(`✅ Success: ${publicId} -> ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed: ${publicId}. Error: ${err.message}`);
      }
    }));
  }

  console.log('\n🎉 Cloudinary Assets Sync Completed!');
}

run();
