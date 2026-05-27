const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/illusory-studios';

const EmployeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "employee" },
  phone: { type: String },
  isActive: { type: Boolean, required: true, default: true },
  joiningDate: { type: Date, required: true, default: Date.now }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');
  
  console.log('Dropping old employees collection...');
  await Employee.deleteMany({});
  
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const managerPassword = await bcrypt.hash('Manager@123', salt);
  const employeePassword = await bcrypt.hash('Employee@123', salt);
  
  console.log('Seeding temporary accounts...');
  await Employee.create([
    {
      fullName: "Admin User",
      employeeId: "IDS001",
      email: "admin@illusory.design",
      password: adminPassword,
      role: "admin",
      phone: "9999999991",
      isActive: true
    },
    {
      fullName: "Manager User",
      employeeId: "IDS002",
      email: "manager@illusory.design",
      password: managerPassword,
      role: "manager",
      phone: "9999999992",
      isActive: true
    },
    {
      fullName: "Employee One",
      employeeId: "IDS003",
      email: "employee1@illusory.design",
      password: employeePassword,
      role: "employee",
      phone: "9999999993",
      isActive: true
    },
    {
      fullName: "Employee Two",
      employeeId: "IDS004",
      email: "employee2@illusory.design",
      password: employeePassword,
      role: "employee",
      phone: "9999999994",
      isActive: true
    }
  ]);
  
  console.log('Employee seeding completed successfully!');
  await mongoose.disconnect();
}

seed();
