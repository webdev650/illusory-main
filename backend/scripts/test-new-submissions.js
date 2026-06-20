const path = require("path");
const mongoose = require("mongoose");

// Load env
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const BACKEND_URL = "http://localhost:5000";

async function testContactForm() {
  console.log("\n--- Testing Unified Submissions: Contact Form ---");
  try {
    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType: "contact",
        name: "Test Contact Unified",
        email: "business@illusorydesignstudios.com", // Send to itself for testing
        phone: "1234567890",
        company: "Test Unified Company",
        serviceType: "web-development",
        budget: "INR 50000",
        message: "This is a test message of at least ten characters.",
        hearAboutUs: "google",
        contactMethod: "email",
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error testing contact form:", err.message);
  }
}

async function testDiscussionForm() {
  console.log("\n--- Testing Unified Submissions: Discussion Form ---");
  try {
    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType: "discussion",
        name: "Test Discussion Unified",
        email: "business@illusorydesignstudios.com",
        phone: "9876543210",
        company: "Test Discussion Corp",
        serviceType: "brand-strategy",
        budget: "USD 2000",
        message: "Let us start a discussion about a new project design.",
        hearAboutUs: "instagram",
        contactMethod: "whatsapp",
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error testing discussion form:", err.message);
  }
}

async function testPackageForm() {
  console.log("\n--- Testing Unified Submissions: Package Lead Form ---");
  try {
    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType: "package",
        name: "Test Package Unified",
        email: "business@illusorydesignstudios.com",
        phone: "5555555555",
        businessName: "Package Unified Business",
        state: "Odisha",
        district: "Cuttack",
        industry: "Cafe",
        selectedPackage: "GROWTH",
        estimatedBudget: "₹18,000",
        message: "I want to inquire about the Growth Package.",
      }),
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error testing package form:", err.message);
  }
}

async function testCareerForm() {
  console.log("\n--- Testing Unified Submissions: Career Form (Multipart/FormData) ---");
  try {
    const form = new FormData();
    form.append("formType", "career");
    form.append("fullName", "Test Career Unified Applicant");
    form.append("email", "business@illusorydesignstudios.com");
    form.append("phone", "4444444444");
    form.append("jobId", "1");
    form.append("jobTitle", "UI/UX Designer");
    form.append("portfolioLink", "https://portfolio.test");
    form.append("coverNote", "This is a cover note for career application testing.");
    
    // Create a mock PDF file using Blob
    const blob = new Blob(["%PDF-1.4 Mock PDF Content"], { type: "application/pdf" });
    form.append("resume", blob, "resume-test.pdf");

    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
      method: "POST",
      body: form,
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error testing career form:", err.message);
  }
}

async function testInvalidForm() {
  console.log("\n--- Testing Unified Submissions: Validation Failure ---");
  try {
    const res = await fetch(`${BACKEND_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType: "contact",
        name: "A", // too short, validation should fail
        email: "invalid-email",
        phone: "123",
        company: "",
        serviceType: "",
        budget: "",
        message: "Short",
        hearAboutUs: "",
        contactMethod: "",
      }),
    });
    console.log("Status (should be 400):", res.status);
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Error testing validation failure:", err.message);
  }
}

async function checkDatabase() {
  console.log("\n--- Checking Saved Submissions in MongoDB ---");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    
    // Query FormSubmissions
    const submissions = await db.collection("formSubmissions").find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log(`Found ${submissions.length} submissions in formSubmissions:`);
    submissions.forEach(sub => {
      console.log(`- ID: ${sub._id}, Type: ${sub.formType}, Email: ${sub.email}, Name: ${sub.name || sub.fullName}, emailStatus: ${sub.emailStatus}, error: ${sub.emailError}`);
    });

    // Query JobApplications to make sure they match the career applications
    const jobApps = await db.collection("jobApplications").find({}).sort({ appliedAt: -1 }).limit(1).toArray();
    console.log(`Found ${jobApps.length} records in jobApplications:`);
    jobApps.forEach(app => {
      console.log(`- ID: ${app._id}, Name: ${app.fullName}, Title: ${app.jobTitle}, Resume: ${app.resumeUrl}`);
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("Error querying database:", err.message);
  }
}

async function run() {
  await testContactForm();
  await testDiscussionForm();
  await testPackageForm();
  await testCareerForm();
  await testInvalidForm();
  
  console.log("\nChecking database for records...");
  await checkDatabase();
}

run();
