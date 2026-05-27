import path from "path";
import xlsx from "xlsx";
import DistrictIndustry from "../models/DistrictIndustry";
import IndustryCategory from "../models/IndustryCategory";
import ServicePackage from "../models/ServicePackage";
import Employee, { hashPassword } from "../models/Employee";

export async function seedPackageDataIfNeeded() {
  try {
    // 1. Check & Seed Employees
    // If the old default employee is present, reset employee collection to update schema
    const oldEmployee = await Employee.findOne({ email: "employee@illusory.design" });
    if (oldEmployee) {
      console.log("Found legacy employee schema. Dropping employee collection for fresh seeding...");
      await Employee.deleteMany({});
    }

    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      console.log("Seeding default employee accounts...");
      await Employee.create([
        {
          fullName: "Admin User",
          employeeId: "IDS001",
          email: "admin@illusory.design",
          password: await hashPassword("Admin@123"),
          role: "admin",
          phone: "9999999991",
          isActive: true
        },
        {
          fullName: "Manager User",
          employeeId: "IDS002",
          email: "manager@illusory.design",
          password: await hashPassword("Manager@123"),
          role: "manager",
          phone: "9999999992",
          isActive: true
        },
        {
          fullName: "Employee One",
          employeeId: "IDS003",
          email: "employee1@illusory.design",
          password: await hashPassword("Employee@123"),
          role: "employee",
          phone: "9999999993",
          isActive: true
        },
        {
          fullName: "Employee Two",
          employeeId: "IDS004",
          email: "employee2@illusory.design",
          password: await hashPassword("Employee@123"),
          role: "employee",
          phone: "9999999994",
          isActive: true
        }
      ]);
      console.log("Temporary employee accounts created: admin, manager, employee1, employee2");
    }

    // 2. Check existing Package Data
    const districtCount = await DistrictIndustry.countDocuments();
    const categoryCount = await IndustryCategory.countDocuments();
    const packageCount = await ServicePackage.countDocuments();

    if (districtCount > 0 && categoryCount > 0 && packageCount > 0) {
      console.log("Package database collections already seeded.");
      return;
    }

    console.log("Package data missing. Starting auto-seed from Excel...");
    const excelPath = path.join(__dirname, "../../package.xlsx.xlsx");
    console.log(`Reading Excel file from: ${excelPath}`);
    
    const workbook = xlsx.readFile(excelPath);

    // Seed Sheet1 (Industry Category)
    if (categoryCount === 0) {
      const sheet1 = workbook.Sheets["Sheet1"];
      if (sheet1) {
        const data1 = xlsx.utils.sheet_to_json(sheet1) as any[];
        const docs1 = data1.map((row) => ({
          industryCategory: row["Industry Category"] || "",
          post: row["Post"] ? String(row["Post"]) : "",
          districtPriority: row["District Priority"] ? String(row["District Priority"]) : "",
        }));
        await IndustryCategory.deleteMany({});
        await IndustryCategory.insertMany(docs1);
        console.log(`Imported ${docs1.length} categories.`);
      }
    }

    // Seed Sheet2 (District Industry)
    if (districtCount === 0) {
      const sheet2 = workbook.Sheets["Sheet2"];
      if (sheet2) {
        const data2 = xlsx.utils.sheet_to_json(sheet2) as any[];
        const docs2 = data2.map((row) => ({
          state: row["State"] || "",
          district: row["District"] || "",
          popularIndustries: row["Popular Industries"] ? String(row["Popular Industries"]) : "",
        }));
        await DistrictIndustry.deleteMany({});
        await DistrictIndustry.insertMany(docs2);
        console.log(`Imported ${docs2.length} district industries.`);
      }
    }

    // Seed Sheet3 (Service Packages)
    if (packageCount === 0) {
      const sheet3 = workbook.Sheets["Sheet3"];
      if (sheet3) {
        const data3 = xlsx.utils.sheet_to_json(sheet3) as any[];
        const docs3 = data3.map((row) => ({
          serialNumber: row["Serial Number"],
          category: row["CATEGORY"] || "",
          industry: row["INDUSTRY"] || "",
          subSegments: row["SUB-SEGMENTS"] || "",
          type: row["TYPE"] || "",
          basic: row["Basic"] ? String(row["Basic"]) : "",
          basicDeliverables: row["Deliverable"] ? String(row["Deliverable"]) : "",
          standard: row["Standard"] ? String(row["Standard"]) : "",
          standardDeliverables: row["Deliverable_1"] ? String(row["Deliverable_1"]) : "",
          premium: row["Premium"] ? String(row["Premium"]) : "",
          premiumDeliverables: row["Deliverable_2"] ? String(row["Deliverable_2"]) : "",
        }));
        await ServicePackage.deleteMany({});
        await ServicePackage.insertMany(docs3);
        console.log(`Imported ${docs3.length} service packages.`);
      }
    }

    console.log("Package data auto-seeding completed successfully!");
  } catch (error) {
    console.error("Auto-seeding package data failed:", error);
  }
}
