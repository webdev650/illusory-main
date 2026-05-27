const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/illusory_package_db';

const IndustryCategorySchema = new mongoose.Schema({ industryCategory: String });
const ServicePackageSchema = new mongoose.Schema({ category: String, industry: String });

const IndustryCategory = mongoose.model('IndustryCategory', IndustryCategorySchema);
const ServicePackage = mongoose.model('ServicePackage', ServicePackageSchema);

async function findMatches() {
  await mongoose.connect(MONGODB_URI);
  const cats = await IndustryCategory.find();
  const catNames = cats.map(c => c.industryCategory.toLowerCase());

  const pkgs = await ServicePackage.find();
  const pkgCats = [...new Set(pkgs.map(p => p.category))];

  console.log('--- DISTINCT SERVICE PACKAGE CATEGORIES ---');
  console.log(pkgCats);

  console.log('\n--- DISTINCT INDUSTRY CATEGORIES ---');
  console.log(catNames);

  console.log('\n--- MATCHES ---');
  pkgCats.forEach(pc => {
    const pcLower = pc ? pc.toLowerCase() : '';
    const match = catNames.find(c => c.includes(pcLower) || pcLower.includes(c));
    console.log(`ServicePackage Category: "${pc}" -> IndustryCategory Match: "${match || 'NONE'}"`);
  });

  await mongoose.disconnect();
}

findMatches();
