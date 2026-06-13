import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../../lib/mongodb';
import JobApplication from '../../lib/models/JobApplication';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to send email via Resend API or Nodemailer SMTP
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  // If using Resend, a verified sender email is required. Default to onboarding@resend.dev for testing,
  // or a verified domain email like careers@illusorydesignstudios.com
  const fromEmail = process.env.EMAIL_FROM || 'careers@illusorydesignstudios.com';

  if (resendApiKey) {
    console.log(`Sending email to ${to} via Resend REST API...`);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Illusory Design Studios <${fromEmail}>`,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Resend API returned status ${res.status}`);
    }

    return res.json();
  } else {
    console.log(`Sending email to ${to} via Nodemailer SMTP...`);
    const mailConfig: any = process.env.EMAIL_HOST
      ? {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587', 10),
          secure: process.env.EMAIL_PORT === '465',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        };

    const transporter = nodemailer.createTransport(mailConfig);
    const sender = process.env.EMAIL_USER || fromEmail;
    
    return transporter.sendMail({
      from: `"Illusory Design Studios" <${sender}>`,
      to,
      subject,
      html,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Parse form fields
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const portfolioLink = formData.get('portfolioLink') as string || '';
    const coverNote = formData.get('coverNote') as string || '';
    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields
    if (!fullName || !email || !phone || !jobId || !jobTitle) {
      return NextResponse.json({ error: 'All marked fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // Validate resume file
    if (!resumeFile) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    // Check size limit (5MB)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Resume file size cannot exceed 5MB' }, { status: 400 });
    }

    // Check file extension
    const extension = resumeFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'doc' && extension !== 'docx') {
      return NextResponse.json({ error: 'Only PDF, DOC, and DOCX files are allowed' }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Convert resume file to buffer for uploading
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${resumeFile.type || 'application/octet-stream'};base64,${base64Data}`;

    // Upload to Cloudinary using raw format (crucial for documents like PDF/DOC)
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'resumes',
      resource_type: 'raw',
    });

    const resumeUrl = uploadResult.secure_url;

    // Save application to MongoDB
    const application = await JobApplication.create({
      jobId,
      jobTitle,
      fullName,
      email,
      phone,
      resumeUrl,
      portfolioLink,
      coverNote,
      status: 'new',
      source: 'website',
    });

    // Email content for the operations team
    const operationsEmail = process.env.EMAIL_TO || 'operations@illusorydesignstudios.com';
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 25px; border-radius: 12px; background-color: #ffffff; color: #333333;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">New Job Application</h2>
        <p style="font-size: 16px; margin: 15px 0;"><strong>Position:</strong> ${jobTitle} (Ref ID: #${jobId})</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #4b5563; letter-spacing: 0.05em;">Applicant Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; font-size: 14px;">Full Name:</td>
              <td style="padding: 6px 0; font-size: 14px;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Email:</td>
              <td style="padding: 6px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Phone:</td>
              <td style="padding: 6px 0; font-size: 14px;">${phone}</td>
            </tr>
            ${portfolioLink ? `
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Portfolio:</td>
              <td style="padding: 6px 0; font-size: 14px;"><a href="${portfolioLink}" target="_blank" style="color: #2563eb; text-decoration: none;">${portfolioLink}</a></td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="margin: 25px 0; text-align: center;">
          <a href="${resumeUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 14px;">Download Resume / CV</a>
        </div>

        ${coverNote ? `
        <div style="margin-top: 25px;">
          <p style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">Cover Note:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-style: italic; font-size: 13px; line-height: 1.5; color: #4b5563;">${coverNote}</div>
        </div>
        ` : ''}
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">This application was submitted via illusorydesignstudios.com/careers</p>
      </div>
    `;

    // Email content for the applicant
    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 30px; border-radius: 12px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin: 10px 0 5px 0; letter-spacing: 2px;">ILLUSORY</h1>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0;">Design Studios</p>
        </div>

        <h3 style="color: #2563eb; margin-top: 0; font-size: 18px;">Application Received</h3>
        <p style="font-size: 14px;">Dear ${fullName},</p>
        <p style="font-size: 14px;">We have successfully received your application for the <strong>${jobTitle}</strong> position at Illusory Design Studios.</p>
        <p style="font-size: 14px;">Our operations and creative team will review your qualifications and portfolio. If your profile aligns with our vision, we will contact you to discuss the next steps.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
          <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #374151;">Application Details:</h4>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Position:</strong> ${jobTitle}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Applied On:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> Under Review</p>
        </div>

        <p style="font-size: 14px;">In the meantime, feel free to check out our works at <a href="https://www.illusorydesignstudios.com" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: bold;">illusorydesignstudios.com</a>.</p>
        
        <p style="margin-top: 35px; font-size: 14px;">Best regards,<br /><strong style="color: #111827;">The Operations Team</strong><br />Illusory Design Studios</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Please do not reply directly to this email as it is automated.</p>
      </div>
    `;

    // Send emails
    sendEmail({
      to: operationsEmail,
      subject: `New Job Application: ${jobTitle} - ${fullName}`,
      html: adminHtml,
    }).catch((err) => {
      console.error('Error sending admin notification email:', err);
    });

    sendEmail({
      to: email,
      subject: `We've received your application for ${jobTitle} — Illusory Design Studios`,
      html: applicantHtml,
    }).catch((err) => {
      console.error('Error sending applicant confirmation email:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Application API error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
