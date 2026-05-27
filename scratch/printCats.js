const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/illusory_package_db';

const IndustryCategorySchema = new mongoose.Schema({
  industryCategory: String,
  post: String,
  districtPriority: String
});

const IndustryCategory = mongoose.model('IndustryCategory', IndustryCategorySchema);

async function printCats() {
  await mongoose.connect(MONGODB_URI);
  const cats = await IndustryCategory.find();
  console.log(JSON.stringify(cats, null, 2));
  await mongoose.disconnect();
}

printCats();
