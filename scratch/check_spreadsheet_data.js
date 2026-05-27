const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../backend/package.xlsx.xlsx');
console.log('Reading:', excelPath);

const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['Sheet3'];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(`Total rows in Sheet3: ${data.length}`);

// Clean names helper
const clean = (s) => String(s || '').trim().toLowerCase();

const dbIndustries = data.map(r => ({
  serialNumber: r['Serial Number'],
  category: r['CATEGORY'],
  industry: r['INDUSTRY'],
  subSegments: r['SUB-SEGMENTS'],
  type: r['TYPE']
}));

const userList = [
  "B2B Services",
  "Manufacturing",
  "Tech Services",
  "Medical Tech",
  "Finance Tech",
  "Real Estate Tech",
  "Tech Tools",
  "Food & Hospitality",
  "Local Businesses",
  "Small Businesses",
  "Household Services",
  "Performance",
  "Gaming Startups",
  "Real Estate & Infrastructure",
  "Medical",
  "Coaching & EdTech",
  "Auto Industry",
  "Finance & Legal",
  "Study Abroad",
  "Business Services",
  "Transport",
  "Coaching & Therapy",
  "Elder Care",
  "Career Services",
  "Support Services",
  "Tourism",
  "Social Sector",
  "D2C Brands",
  "Tech & SaaS",
  "Salon & Wellness",
  "Creators",
  "Fitness & Sports",
  "Interior & Architecture",
  "Wedding & Events",
  "Spiritual & Wellness",
  "Gaming & Entertainment",
  "Apparel",
  "Cosmetics",
  "Home & Living",
  "Kids Industry",
  "Pet Products",
  "Food Products",
  "Wellness Goods",
  "Gadgets",
  "Auto Goods",
  "Manufacturing Goods",
  "Gift Industry",
  "Learning",
  "Handmade Goods, DIY", // wait, Handmade is the CATEGORY, Handmade Goods, DIY is the INDUSTRY
  "Eco Products"
];

console.log('\n--- MATCHING RESULTS ---');
const missing = [];
const found = [];

userList.forEach((indName, idx) => {
  const match = dbIndustries.find(dbInd => clean(dbInd.industry) === clean(indName));
  if (match) {
    found.push({ index: idx + 1, name: indName, serialNumber: match.serialNumber });
  } else {
    missing.push({ index: idx + 1, name: indName });
  }
});

console.log(`Found: ${found.length}/${userList.length}`);
if (missing.length > 0) {
  console.log(`\nMissing Industries (${missing.length}):`);
  missing.forEach(m => console.log(`- Row ${m.index}: "${m.name}"`));
} else {
  console.log('\nAll 50 industries are present in the Excel spreadsheet!');
}
