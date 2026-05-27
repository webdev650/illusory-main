const mongoose = require('mongoose');

const uri1 = "mongodb+srv://illusory:illusory%40123@cluster0.hfuxxob.mongodb.net/?appName=Cluster0";
const uri2 = "mongodb+srv://illusory:illusory%4012@cluster0.hfuxxob.mongodb.net/?appName=Cluster0";

async function testConn(uri, name) {
  try {
    console.log(`Testing connection for ${name}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ Success for ${name}! Connected successfully.`);
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`❌ Failed for ${name}:`, err.message);
    return false;
  }
}

async function run() {
  const success1 = await testConn(uri1, "illusory@123");
  if (!success1) {
    await testConn(uri2, "illusory@12");
  }
}

run();
