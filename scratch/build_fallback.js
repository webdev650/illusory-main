const fs = require('fs');
const path = require('path');

const dumpedPath = path.join(__dirname, 'dumped_packages.json');
const rawContent = fs.readFileSync(dumpedPath, 'utf16le');

// Parse DISTRICTS and PACKAGES from the file content
const districtsStartIdx = rawContent.indexOf('DISTRICTS:');
const categoriesStartIdx = rawContent.indexOf('CATEGORIES:');
const packagesStartIdx = rawContent.indexOf('PACKAGES:');

const districtsStr = rawContent.substring(districtsStartIdx + 10, categoriesStartIdx).trim();
const categoriesStr = rawContent.substring(categoriesStartIdx + 11, packagesStartIdx).trim();
const packagesStr = rawContent.substring(packagesStartIdx + 9).trim();

const districts = JSON.parse(districtsStr);
const categories = JSON.parse(categoriesStr);
const packages = JSON.parse(packagesStr);

console.log(`Loaded from dump: ${districts.length} districts, ${categories.length} categories, ${packages.length} packages.`);

// Read existing fallbackData.ts
const fallbackFilePath = path.join(__dirname, '../frontend/services/fallbackData.ts');
let existingContent = fs.readFileSync(fallbackFilePath, 'utf8');

// Append new fallback arrays to fallbackData.ts
const districtsExport = `\n\nexport const fallbackDistrictIndustries = ${JSON.stringify(districts, null, 2)};`;
const categoriesExport = `\n\nexport const fallbackCategories = ${JSON.stringify(categories, null, 2)};`;
const packagesExport = `\n\nexport const fallbackServicePackages = ${JSON.stringify(packages, null, 2)};`;

// Add them if they don't exist
if (!existingContent.includes('fallbackDistrictIndustries')) {
  existingContent += districtsExport;
}
if (!existingContent.includes('fallbackCategories')) {
  existingContent += categoriesExport;
}
if (!existingContent.includes('fallbackServicePackages')) {
  existingContent += packagesExport;
}

fs.writeFileSync(fallbackFilePath, existingContent, 'utf8');
console.log('Successfully updated fallbackData.ts with package calculator data!');
