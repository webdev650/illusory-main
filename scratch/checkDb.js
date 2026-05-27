const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/illusory_package_db';

const IndustryCategorySchema = new mongoose.Schema({
  industryCategory: String,
  post: String,
  districtPriority: String
});

const ServicePackageSchema = new mongoose.Schema({
  serialNumber: Number,
  category: String,
  industry: String,
  subSegments: String,
  type: String,
  basic: String,
  basicDeliverables: String,
  standard: String,
  standardDeliverables: String,
  premium: String,
  premiumDeliverables: String
});

const IndustryCategory = mongoose.model('IndustryCategory', IndustryCategorySchema);
const ServicePackage = mongoose.model('ServicePackage', ServicePackageSchema);

async function checkDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('--- ALL INDUSTRY CATEGORIES ---');
  const cats = await IndustryCategory.find();
  console.log(cats.map(c => ({ name: c.industryCategory, post: c.post, priority: c.districtPriority })));
  
  console.log('\n--- ALL SERVICE PACKAGES ---');
  const pkgs = await ServicePackage.find();
  console.log(pkgs.map(p => ({
    serialNumber: p.serialNumber,
    category: p.category,
    industry: p.industry,
    subSegments: p.subSegments,
    type: p.type,
    basic: p.basic,
    standard: p.standard,
    premium: p.premium
  })));
  
  await mongoose.disconnect();
}

checkDb();
