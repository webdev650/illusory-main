const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/illusory-studios';

const DistrictIndustrySchema = new mongoose.Schema({}, { strict: false });
const IndustryCategorySchema = new mongoose.Schema({}, { strict: false });
const ServicePackageSchema = new mongoose.Schema({}, { strict: false });

const DistrictIndustry = mongoose.model('DistrictIndustry', DistrictIndustrySchema, 'districtindustries');
const IndustryCategory = mongoose.model('IndustryCategory', IndustryCategorySchema, 'industrycategories');
const ServicePackage = mongoose.model('ServicePackage', ServicePackageSchema, 'servicepackages');

async function dump() {
  await mongoose.connect(MONGODB_URI);
  
  const dists = await DistrictIndustry.find();
  const cats = await IndustryCategory.find();
  const pkgs = await ServicePackage.find().sort({ serialNumber: 1 });
  
  console.log('--- DUMP DATA ---');
  console.log('DISTRICTS:', JSON.stringify(dists, null, 2));
  console.log('CATEGORIES:', JSON.stringify(cats, null, 2));
  console.log('PACKAGES:', JSON.stringify(pkgs, null, 2));
  
  await mongoose.disconnect();
}

dump();
