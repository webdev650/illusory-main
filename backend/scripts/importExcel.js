const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI || 'mongodb://localhost:27017/illusory_package_db';

// Define Schemas
const IndustryCategorySchema = new mongoose.Schema({
  industryCategory: { type: String, required: true },
  post: String,
  districtPriority: String
});

const DistrictIndustrySchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  popularIndustries: String
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

// Models
const IndustryCategory = mongoose.model('IndustryCategory', IndustryCategorySchema);
const DistrictIndustry = mongoose.model('DistrictIndustry', DistrictIndustrySchema);
const ServicePackage = mongoose.model('ServicePackage', ServicePackageSchema);

async function importExcel() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    // Set a short timeout for local connection attempts
    const options = { serverSelectionTimeoutMS: 5000 };
    await mongoose.connect(MONGODB_URI, options);
    console.log('Connected to MongoDB successfully!');

    const excelPath = path.join(__dirname, '../package.xlsx.xlsx');
    console.log(`Reading Excel file from ${excelPath}...`);
    const workbook = xlsx.readFile(excelPath);

    // 1. Process Sheet1 (Industry Category)
    console.log('Processing Sheet1...');
    const sheet1 = workbook.Sheets['Sheet1'];
    if (sheet1) {
      const data1 = xlsx.utils.sheet_to_json(sheet1);
      const docs1 = data1.map(row => ({
        industryCategory: row['Industry Category'],
        post: row['Post'],
        districtPriority: row['District Priority']
      }));
      await IndustryCategory.deleteMany({});
      await IndustryCategory.insertMany(docs1);
      console.log(`Successfully imported ${docs1.length} rows into IndustryCategory collection.`);
    } else {
      console.warn('Sheet1 not found in workbook!');
    }

    // 2. Process Sheet2 (District Industry)
    console.log('Processing Sheet2...');
    const sheet2 = workbook.Sheets['Sheet2'];
    if (sheet2) {
      const data2 = xlsx.utils.sheet_to_json(sheet2);
      const docs2 = data2.map(row => ({
        state: row['State'],
        district: row['District'],
        popularIndustries: row['Popular Industries']
      }));
      await DistrictIndustry.deleteMany({});
      await DistrictIndustry.insertMany(docs2);
      console.log(`Successfully imported ${docs2.length} rows into DistrictIndustry collection.`);
    } else {
      console.warn('Sheet2 not found in workbook!');
    }

    // 3. Process Sheet3 (Service Packages)
    console.log('Processing Sheet3...');
    const sheet3 = workbook.Sheets['Sheet3'];
    if (sheet3) {
      const data3 = xlsx.utils.sheet_to_json(sheet3);
      const docs3 = data3.map(row => ({
        serialNumber: row['Serial Number'],
        category: row['CATEGORY'],
        industry: row['INDUSTRY'],
        subSegments: row['SUB-SEGMENTS'],
        type: row['TYPE'],
        basic: row['Basic'],
        basicDeliverables: row['Deliverable'],
        standard: row['Standard'],
        standardDeliverables: row['Deliverable_1'],
        premium: row['Premium'],
        premiumDeliverables: row['Deliverable_2']
      }));
      await ServicePackage.deleteMany({});
      await ServicePackage.insertMany(docs3);
      console.log(`Successfully imported ${docs3.length} rows into ServicePackage collection.`);
    } else {
      console.warn('Sheet3 not found in workbook!');
    }

    console.log('Excel import completed successfully!');
  } catch (error) {
    console.error('Import failed with error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

importExcel();
