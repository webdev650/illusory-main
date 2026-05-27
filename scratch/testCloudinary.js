const cloudinary = require('cloudinary').v2;

const apiKey = '752552312252278';
const apiSecret = 'gKi-BP6gGjwhE9_oG6wYtx94e2o';

const candidateCloudNames = [
  'illusory',
  'illusory-design',
  'illusory-studios',
  'illusorystudios',
  'illusorydesign',
  'illusory-design-studios',
  'illusorydesignstudios',
  'illusory-crm',
  'dqlmblh5i'
];

async function testCloud(cloudName) {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });
    
    // Attempt a simple ping / root folders call
    console.log(`Testing cloud name: "${cloudName}"...`);
    const res = await cloudinary.api.ping();
    console.log(`✅ Success for cloud name: "${cloudName}"! Result:`, res);
    return true;
  } catch (err) {
    console.log(`❌ Failed for "${cloudName}":`, err.message);
    return false;
  }
}

async function run() {
  for (const name of candidateCloudNames) {
    const success = await testCloud(name);
    if (success) {
      console.log(`\n🎉 Found valid cloud name: "${name}"!`);
      break;
    }
  }
}

run();
