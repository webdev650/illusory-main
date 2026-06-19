import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { connectToDatabase } from '../../lib/mongodb';
import JobApplication from '../../lib/models/JobApplication';
import FormSubmission from '../../lib/models/FormSubmission';
import { sanitizeObject } from '../../lib/utils/sanitize';
import { isRateLimited } from '../../lib/utils/rateLimiter';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to send email via Resend API or Nodemailer SMTP
async function sendEmail({ 
  to, 
  subject, 
  html, 
  replyTo 
}: { 
  to: string; 
  subject: string; 
  html: string; 
  replyTo?: string; 
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  // Enforce EMAIL_FROM verified domain sender
  const fromEmail = process.env.EMAIL_FROM || 'noreply@illusorydesignstudios.com';

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
        reply_to: replyTo, // Resend API uses reply_to
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
    const sender = process.env.EMAIL_USER && process.env.EMAIL_USER.includes('@') ? process.env.EMAIL_USER : fromEmail;
    
    return transporter.sendMail({
      from: `"Illusory Design Studios" <${sender}>`,
      to,
      subject,
      html,
      replyTo, // Nodemailer uses replyTo
    });
  }
}

// Zod validation schema for form text fields
const careerValidationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is too short').max(20),
  jobId: z.string().min(1, 'Job ID is required'),
  jobTitle: z.string().min(1, 'Job Title is required'),
  portfolioLink: z.string().url('Invalid portfolio URL').or(z.literal('')),
  coverNote: z.string().max(2000, 'Cover note cannot exceed 2000 characters').optional().default(''),
  website: z.string().optional(), // honeypot
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (Limit to 5 applications per 1 minute window)
    if (isRateLimited(req, 5, 60 * 1000)) {
      console.warn("⚠️ Rate limit exceeded for careers endpoint.");
      return NextResponse.json(
        { error: 'Too many application submissions from this IP. Please try again in a minute.' }, 
        { status: 429 }
      );
    }

    const formData = await req.formData();
    
    // Parse form fields
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const portfolioLink = formData.get('portfolioLink') as string || '';
    const coverNote = formData.get('coverNote') as string || '';
    const website = formData.get('website') as string || ''; // Honeypot

    // 2. Validate payload using Zod
    const parsedData = careerValidationSchema.parse({
      fullName,
      email,
      phone,
      jobId,
      jobTitle,
      portfolioLink,
      coverNote,
      website
    });

    // 3. Honeypot check
    if (parsedData.website && parsedData.website.trim() !== '') {
      console.warn('Spam application detected via honeypot. Silently dropping payload.');
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
        applicationId: 'fake-id-' + Date.now(),
      }, { status: 201 });
    }

    // 4. Sanitize inputs
    const validatedData = sanitizeObject(parsedData);
    delete validatedData.website; // Remove honeypot field

    // Validate resume file presence
    const resumeFile = formData.get('resume') as File | null;
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

    // 5. Save to consolidated FormSubmission collection
    const submission = await FormSubmission.create({
      formType: 'career',
      emailStatus: 'pending',
      emailError: null,
      name: validatedData.fullName,
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      portfolioLink: validatedData.portfolioLink,
      coverNote: validatedData.coverNote,
      jobId: validatedData.jobId,
      jobTitle: validatedData.jobTitle,
      resumeUrl,
    });

    // 6. Save to legacy JobApplication collection for dashboard compatibility
    const application = await JobApplication.create({
      jobId: validatedData.jobId,
      jobTitle: validatedData.jobTitle,
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      resumeUrl,
      portfolioLink: validatedData.portfolioLink,
      coverNote: validatedData.coverNote,
      status: 'new',
      source: 'website',
    });

    // 7. Trigger Notification emails (does not block client response)
    const operationsEmail = process.env.EMAIL_TO || 'business@illusorydesignstudios.com';
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 25px; border-radius: 12px; background-color: #ffffff; color: #333333;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">New Job Application</h2>
        <p style="font-size: 16px; margin: 15px 0;"><strong>Position:</strong> ${validatedData.jobTitle} (Ref ID: #${validatedData.jobId})</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #4b5563; letter-spacing: 0.05em;">Applicant Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; font-size: 14px;">Full Name:</td>
              <td style="padding: 6px 0; font-size: 14px;">${validatedData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Email:</td>
              <td style="padding: 6px 0; font-size: 14px;"><a href="mailto:${validatedData.email}" style="color: #2563eb; text-decoration: none;">${validatedData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Phone:</td>
              <td style="padding: 6px 0; font-size: 14px;">${validatedData.phone}</td>
            </tr>
            ${validatedData.portfolioLink ? `
            <tr>
              <td style="padding: 6px 0; font-weight: bold; font-size: 14px;">Portfolio:</td>
              <td style="padding: 6px 0; font-size: 14px;"><a href="${validatedData.portfolioLink}" target="_blank" style="color: #2563eb; text-decoration: none;">${validatedData.portfolioLink}</a></td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="margin: 25px 0; text-align: center;">
          <a href="${resumeUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 14px;">Download Resume / CV</a>
        </div>

        ${validatedData.coverNote ? `
        <div style="margin-top: 25px;">
          <p style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">Cover Note:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-style: italic; font-size: 13px; line-height: 1.5; color: #4b5563;">${validatedData.coverNote}</div>
        </div>
        ` : ''}
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">This application was submitted via illusorydesignstudios.com/careers</p>
      </div>
    `;

    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; padding: 30px; border-radius: 12px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin: 10px 0 5px 0; letter-spacing: 2px;">ILLUSORY</h1>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0;">Design Studios</p>
        </div>

        <h3 style="color: #2563eb; margin-top: 0; font-size: 18px;">Application Received</h3>
        <p style="font-size: 14px;">Dear ${validatedData.fullName},</p>
        <p style="font-size: 14px;">We have successfully received your application for the <strong>${validatedData.jobTitle}</strong> position at Illusory Design Studios.</p>
        <p style="font-size: 14px;">Our operations and creative team will review your qualifications and portfolio. If your profile aligns with our vision, we will contact you to discuss the next steps.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
          <h4 style="margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #374151;">Application Details:</h4>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Position:</strong> ${validatedData.jobTitle}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Applied On:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> Under Review</p>
        </div>

        <p style="font-size: 14px;">In the meantime, feel free to check out our works at <a href="https://www.illusorydesignstudios.com" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: bold;">illusorydesignstudios.com</a>.</p>
        
        <p style="margin-top: 35px; font-size: 14px;">Best regards,<br /><strong style="color: #111827;">The Operations Team</strong><br />Illusory Design Studios</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Please do not reply directly to this email as it is automated.</p>
      </div>
    `;

    // Trigger Admin Email notification
    sendEmail({
      to: operationsEmail,
      subject: `New Job Application: ${validatedData.jobTitle} - ${validatedData.fullName}`,
      html: adminHtml,
      replyTo: validatedData.email,
    }).then(async () => {
      submission.emailStatus = 'sent';
      await submission.save();
      console.log('✉️ Email sent successfully (Operations Desk).');
    }).catch(async (emailErr) => {
      console.error('❌ Failed to send operations application email:', emailErr);
      submission.emailStatus = 'failed';
      submission.emailError = emailErr.message || String(emailErr);
      await submission.save();
    });

    // Trigger Applicant Auto-Reply Email
    sendEmail({
      to: validatedData.email,
      subject: `Application Received - ${validatedData.jobTitle} - Illusory Design Studios`,
      html: applicantHtml,
    }).catch((applicantEmailErr) => {
      console.error('❌ Failed to send applicant confirmation email:', applicantEmailErr);
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id,
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.warn("⚠️ Zod validation failure in Next.js careers route:", error.issues);
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation failed' }, { status: 400 });
    }
    console.error('Application API error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
