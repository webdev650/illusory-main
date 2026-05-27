const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, '../backend/package.xlsx.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['Sheet3'];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(`Total rows in Excel Sheet3: ${data.length}`);

// Map Excel rows to key fields
const excelRows = data.map((r, idx) => ({
  serialNumber: r['Serial Number'] || (idx + 1),
  category: String(r['CATEGORY'] || '').trim(),
  industry: String(r['INDUSTRY'] || '').trim(),
  subSegments: String(r['SUB-SEGMENTS'] || '').trim(),
  type: String(r['TYPE'] || '').trim(),
  group: String(r['__EMPTY'] || '').trim()
}));

// The user list parsed row-by-row
const userRows = [
  { sn: 1, cat: "Corporate", ind: "B2B Services", sub: "Agencies, SaaS, Consultants", type: "Service", group: "B2B / CORPORATE INDUSTR" },
  { sn: 2, cat: "Industrial", ind: "Manufacturing", sub: "Factories, Suppliers, Machinery", type: "Product", group: "B2B / CORPORATE INDUSTR" },
  { sn: 3, cat: "IT Services", ind: "Tech Services", sub: "Developers, IT Firms", type: "Service", group: "B2B / CORPORATE INDUSTR" },
  { sn: 4, cat: "HealthTech", ind: "Medical Tech", sub: "Health Apps, Devices", type: "Product", group: "B2B / CORPORATE INDUSTR" },
  { sn: 5, cat: "FinTech", ind: "Finance Tech", sub: "Payment Apps, Platforms", type: "Product", group: "B2B / CORPORATE INDUSTR" },
  { sn: 6, cat: "PropTech", ind: "Real Estate Tech", sub: "Property Platforms", type: "Product", group: "B2B / CORPORATE INDUSTR" },
  { sn: 7, cat: "AI & Tools", ind: "Tech Tools", sub: "AI SaaS, Automation Tools", type: "Product", group: "B2B / CORPORATE INDUSTR" },
  { sn: 8, cat: "Food", ind: "Food & Hospitality", sub: "Cafes, Restaurants, Cloud Kitchens, Hotels", type: "Service", group: "FOOD/LOCAL" },
  { sn: 9, cat: "Retail", ind: "Local Businesses", sub: "Shops, Boutiques, Electronics Stores", type: "Product", group: "FOOD/LOCAL" },
  { sn: 10, cat: "Home Business", ind: "Small Businesses", sub: "Home Bakers, Instagram Shops", type: "Product", group: "FOOD/LOCAL" },
  { sn: 11, cat: "Home Services", ind: "Household Services", sub: "Cleaning, Pest Control, Electricians", type: "Service", group: "FOOD/LOCAL" },
  { sn: 12, cat: "Entertainment", ind: "Performance", sub: "DJs, Anchors, Artists", type: "Service", group: "INDUSTRIAL / LOW AWARENESS" },
  { sn: 13, cat: "Gaming Tech", ind: "Gaming Startups", sub: "Game Developers, Platforms", type: "Product", group: "INDUSTRIAL / LOW AWARENESS" },
  { sn: 14, cat: "Real Estate", ind: "Real Estate & Infrastructure", sub: "Builders, Developers, Agents, Township Projects", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 15, cat: "Healthcare", ind: "Medical", sub: "Clinics, Hospitals, Diagnostics, IVF Centers", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 16, cat: "Education", ind: "Coaching & EdTech", sub: "Institutes, Schools, Colleges, Skill Centers", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 17, cat: "Automobile", ind: "Auto Industry", sub: "Dealerships, Services", type: "Mixed", group: "LEAD GENERATION INDUSTRY" },
  { sn: 18, cat: "Finance", ind: "Finance & Legal", sub: "CA Firms, Advisors, Lawyers", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 19, cat: "Abroad Education", ind: "Study Abroad", sub: "Visa Consultants, Agencies", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 20, cat: "Professional", ind: "Business Services", sub: "HR Firms, Consultants, Franchise Experts", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 21, cat: "Logistics", ind: "Transport", sub: "Packers & Movers, Courier", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 22, cat: "Mental Health", ind: "Coaching & Therapy", sub: "Therapists, Life Coaches", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 23, cat: "Care Services", ind: "Elder Care", sub: "Nursing, Care Homes", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 24, cat: "Career", ind: "Career Services", sub: "Job Agencies, Resume Experts", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 25, cat: "Real Estate Allied", ind: "Support Services", sub: "Loan Agents, Legal Advisors", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 26, cat: "Travel", ind: "Tourism", sub: "Travel Agencies, Tours, Homestays", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 27, cat: "NGOs", ind: "Social Sector", sub: "Non-profits, Foundations", type: "Service", group: "LEAD GENERATION INDUSTRY" },
  { sn: 28, cat: "E-commerce", ind: "D2C Brands", sub: "Clothing, Jewelry, Skincare, Fitness, Decor", type: "Product", group: "PRODUCT / D2C INDUSTRY" },
  { sn: 29, cat: "Startups", ind: "Tech & SaaS", sub: "Apps, SaaS Platforms", type: "Product", group: "PRODUCT / D2C INDUSTRY" },
  { sn: 30, cat: "Beauty", ind: "Salon & Wellness", sub: "Salons, Spas, Skin Clinics, Makeup Artists", type: "Service", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 31, cat: "Personal Brand", ind: "Creators", sub: "Influencers, Coaches, Trainers, Speakers", type: "Service", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 32, cat: "Fitness", ind: "Fitness & Sports", sub: "Gyms, Trainers, Yoga Studios", type: "Service", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 33, cat: "Interior", ind: "Interior & Architecture", sub: "Designers, Architects, Furniture", type: "Mixed", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 34, cat: "Events", ind: "Wedding & Events", sub: "Planners, Decorators, Photographers", type: "Service", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 35, cat: "Spiritual", ind: "Spiritual & Wellness", sub: "Meditation Centers, Coaches", type: "Service", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 36, cat: "Gaming", ind: "Gaming & Entertainment", sub: "Gaming Brands, Streamers", type: "Mixed", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 37, cat: "Fashion", ind: "Apparel", sub: "Streetwear, Ethnic, Kidswear", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 38, cat: "Beauty Products", ind: "Cosmetics", sub: "Skincare, Haircare, Organic", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 39, cat: "Home", ind: "Home & Living", sub: "Furniture, Decor, Kitchenware", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 40, cat: "Baby Products", ind: "Kids Industry", sub: "Toys, Clothing, Kits", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 41, cat: "Pet Industry", ind: "Pet Products", sub: "Food, Accessories, Grooming", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 42, cat: "FMCG", ind: "Food Products", sub: "Snacks, Beverages, Organic", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 43, cat: "Health Products", ind: "Wellness Goods", sub: "Supplements, Ayurveda", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 44, cat: "Electronics", ind: "Gadgets", sub: "Devices, Accessories", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 45, cat: "Auto Products", ind: "Auto Goods", sub: "Spare Parts, Car Care", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 46, cat: "Industrial Goods", ind: "Manufacturing Goods", sub: "Materials, Machinery", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 47, cat: "Gifting", ind: "Gift Industry", sub: "Customized Gifts, Hampers", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 48, cat: "Education Products", ind: "Learning", sub: "Books, Courses, Kits", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 49, cat: "Handmade", ind: "Art & Craft", sub: "Handmade Goods, DIY", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" },
  { sn: 50, cat: "Sustainable", ind: "Eco Products", sub: "Reusable, Eco-friendly", type: "Product", group: "VISUAL / LIFESTYLE INDUSTRY" }
];

console.log('\n--- ROW-BY-ROW VERIFICATION ---');
let discrepancies = 0;

userRows.forEach(userRow => {
  const excelRow = excelRows.find(r => r.serialNumber === userRow.sn);
  if (!excelRow) {
    console.log(`❌ Serial Number ${userRow.sn} is completely MISSING in Excel!`);
    discrepancies++;
    return;
  }
  
  // Check fields
  const catMatches = excelRow.category.toLowerCase() === userRow.cat.toLowerCase();
  const indMatches = excelRow.industry.toLowerCase() === userRow.ind.toLowerCase();
  const subMatches = excelRow.subSegments.toLowerCase() === userRow.sub.toLowerCase();
  const typeMatches = excelRow.type.toLowerCase() === userRow.type.toLowerCase();
  const groupMatches = excelRow.group.toLowerCase() === userRow.group.toLowerCase();
  
  if (catMatches && indMatches && subMatches && typeMatches && groupMatches) {
    // Exact match
  } else {
    console.log(`⚠️ SN ${userRow.sn} has field differences:`);
    if (!catMatches) console.log(`   Category: User="${userRow.cat}" | Excel="${excelRow.category}"`);
    if (!indMatches) console.log(`   Industry: User="${userRow.ind}" | Excel="${excelRow.industry}"`);
    if (!subMatches) console.log(`   Subsegments: User="${userRow.sub}" | Excel="${excelRow.subSegments}"`);
    if (!typeMatches) console.log(`   Type: User="${userRow.type}" | Excel="${excelRow.type}"`);
    if (!groupMatches) console.log(`   Group: User="${userRow.group}" | Excel="${excelRow.group}"`);
    discrepancies++;
  }
});

if (discrepancies === 0) {
  console.log('✅ ALL 50 rows match perfectly between your list and the Excel spreadsheet!');
} else {
  console.log(`\nFound ${discrepancies} row discrepancies/missing items.`);
}
