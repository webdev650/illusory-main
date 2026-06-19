const path = require('path');
const mongoose = require('mongoose');

// Load env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

async function testContactForm() {
  console.log('\n--- Testing Contact Form ---');
  try {
    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Contact Visitor',
        email: 'testvisitor@gmail.com',
        phone: '1234567890',
        company: 'Test Company LLC',
        serviceType: 'Web Development',
        budget: '$10k-$20k',
        message: 'This is a test message of at least ten characters.',
        hearAboutUs: 'Google Search',
        contactMethod: 'Email',
        formType: 'contact',
      }),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error testing contact form:', err.message);
  }
}

async function testDiscussionForm() {
  console.log('\n--- Testing Discussion Form ---');
  try {
    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Discussion Visitor',
        email: 'testdiscussion@gmail.com',
        phone: '9876543210',
        company: 'Test Discussion Corp',
        serviceType: 'UI/UX Design',
        budget: '$5k-$10k',
        message: 'Let us start a discussion about a new project design.',
        hearAboutUs: 'Social Media',
        contactMethod: 'Phone',
        formType: 'discussion',
      }),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error testing discussion form:', err.message);
  }
}

async function testPackageForm() {
  console.log('\n--- Testing Package Lead Form ---');
  try {
    const res = await fetch(`${BACKEND_URL}/api/package/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Package Lead',
        email: 'testpackage@gmail.com',
        phone: '5555555555',
        businessName: 'Package Lead Business',
        state: 'California',
        district: 'Los Angeles',
        industry: 'E-commerce',
        selectedPackage: 'Starter Package',
        estimatedBudget: '$3,000',
        message: 'I want to inquire about the Starter Package.',
      }),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error testing package form:', err.message);
  }
}

async function testCareerForm() {
  console.log('\n--- Testing Career Form (Multipart/FormData) ---');
  try {
    const form = new FormData();
    form.append('fullName', 'Test Career Applicant');
    form.append('email', 'testapplicant@gmail.com');
    form.append('phone', '4444444444');
    form.append('jobId', 'webdev-01');
    form.append('jobTitle', 'Frontend Developer');
    form.append('portfolioLink', 'https://portfolio.test');
    form.append('coverNote', 'This is a cover note for career application testing.');
    
    // Create a mock PDF file using Blob
    const blob = new Blob(['%PDF-1.4 Mock PDF Content'], { type: 'application/pdf' });
    form.append('resume', blob, 'resume-test.pdf');

    const res = await fetch(`${FRONTEND_URL}/api/applications`, {
      method: 'POST',
      body: form,
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Error testing career form:', err.message);
  }
}

async function testHoneypot() {
  console.log('\n--- Testing Honeypot (Contact) ---');
  try {
    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spambot@gmail.com',
        phone: '0000000000',
        company: 'Spam Inc',
        serviceType: 'SEO Spam',
        budget: '$1k',
        message: 'This is spam message.',
        hearAboutUs: 'None',
        contactMethod: 'Email',
        website: 'http://spammy-website.com', // Honeypot filled!
      }),
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response (should be silent success):', data);
  } catch (err) {
    console.error('Error testing honeypot:', err.message);
  }
}

async function checkDatabase() {
  console.log('\n--- Checking Saved Submissions in MongoDB ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // We dynamically look up the collection "formSubmissions"
    const db = mongoose.connection.db;
    const submissions = await db.collection('formSubmissions').find({}).sort({ submittedAt: -1 }).limit(10).toArray();
    console.log(`Found ${submissions.length} submissions in FormSubmission collection:`);
    submissions.forEach(sub => {
      console.log(`- ID: ${sub._id}, Type: ${sub.formType}, Email: ${sub.email}, Name: ${sub.name || sub.fullName}, emailStatus: ${sub.emailStatus}, error: ${sub.emailError}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Error querying database:', err.message);
  }
}

async function run() {
  await testContactForm();
  await testDiscussionForm();
  await testPackageForm();
  await testCareerForm();
  await testHoneypot();
  
  // Wait 3 seconds for async email tasks to run on the server
  console.log('\nWaiting 3 seconds for server email tasks to complete...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await checkDatabase();
}

run();
