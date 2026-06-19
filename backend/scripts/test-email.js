const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables from backend/.env
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

console.log('Loaded env from:', envPath);
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '*** (loaded)' : 'not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_TO:', process.env.EMAIL_TO);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465', // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    console.log('Verifying SMTP transporter configuration...');
    await transporter.verify();
    console.log('SMTP transporter is ready to take messages!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@illusorydesignstudios.com',
      to: process.env.EMAIL_TO || 'business@illusorydesignstudios.com',
      subject: 'Test Email - SMTP Verification',
      text: 'This is a test email sent from the test-email.js script to verify SMTP settings.',
      html: '<p>This is a test email sent from the <b>test-email.js</b> script to verify SMTP settings.</p>',
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error verifying/sending email:', error);
  }
}

run();
