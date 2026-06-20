import { Request, Response } from "express";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import FormSubmission from "../models/FormSubmission";
import Contact from "../models/Contact";
import CustomerLead from "../models/CustomerLead";
import JobApplication from "../models/JobApplication";
import transporter from "../config/nodemailer";
import { sanitizeObject } from "../utils/sanitize";

// Zod Validation Schemas
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20, "Phone number is too long"),
  company: z.string().min(1, "Company is required").max(150, "Company name is too long"),
  serviceType: z.string().min(1, "Service type is required"),
  budget: z.string().min(1, "Budget is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  hearAboutUs: z.string().min(1, "Hear about us is required"),
  contactMethod: z.string().min(1, "Contact method is required"),
});

const packageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20),
  businessName: z.string().min(1, "Business name is required").max(150),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  industry: z.string().min(1, "Industry is required"),
  selectedPackage: z.string().min(1, "Selected package is required"),
  estimatedBudget: z.string().min(1, "Estimated budget is required"),
  message: z.string().optional().default(""),
});

const careerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20),
  jobId: z.string().min(1, "Job ID is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  portfolioLink: z.string().url("Invalid portfolio URL").or(z.literal("")).optional(),
  coverNote: z.string().max(2000, "Cover note cannot exceed 2000 characters").optional().default(""),
});

// Helper: Upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer, folder: string, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "raw",
        public_id: filename,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const submitForm = async (req: Request, res: Response): Promise<any> => {
  // Set Cache-Control to no-store to prevent edge/CDN caching on form POST requests
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const startTime = Date.now();
  console.log(`[Submission Pipeline] Starting submission processing at ${new Date().toISOString()}`);

  try {
    const { formType } = req.body;
    if (!formType || !["contact", "discussion", "package", "career"].includes(formType)) {
      console.warn("[Submission Pipeline] Invalid or missing formType:", formType);
      return res.status(400).json({ success: false, error: "Invalid or missing formType" });
    }

    // 1. Zod payload validation
    let validatedData: any = {};
    if (formType === "contact" || formType === "discussion") {
      validatedData = contactSchema.parse(req.body);
    } else if (formType === "package") {
      validatedData = packageSchema.parse(req.body);
    } else if (formType === "career") {
      validatedData = careerSchema.parse(req.body);
    }

    // Sanitize validated data to prevent XSS
    validatedData = sanitizeObject(validatedData);

    console.log(`[Submission Pipeline] Payload validation passed for formType: ${formType}`);

    // 2. Handle resume file upload (if Career form)
    let resumeUrl = "";
    if (formType === "career") {
      const resumeFile = req.file;
      if (!resumeFile) {
        console.warn("[Submission Pipeline] Career submission failed: Resume file is required.");
        return res.status(400).json({ success: false, error: "Resume file is required" });
      }

      // Check size limit (5MB)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: "Resume file size cannot exceed 5MB" });
      }

      // Check file extension
      const extension = resumeFile.originalname.split(".").pop()?.toLowerCase();
      if (extension !== "pdf" && extension !== "doc" && extension !== "docx") {
        return res.status(400).json({ success: false, error: "Only PDF, DOC, and DOCX files are allowed" });
      }

      console.log(`[Submission Pipeline] Uploading resume file "${resumeFile.originalname}" (${resumeFile.size} bytes) to Cloudinary...`);
      try {
        const uploadResult = await uploadToCloudinary(
          resumeFile.buffer,
          "resumes",
          `resume-${Date.now()}-${resumeFile.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        );
        resumeUrl = uploadResult.secure_url;
        console.log(`[Submission Pipeline] Resume uploaded successfully to Cloudinary. URL: ${resumeUrl}`);
      } catch (uploadErr: any) {
        console.error("[Submission Pipeline] Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ success: false, error: `Resume upload failed: ${uploadErr.message || uploadErr}` });
      }
    }

    // 3. Persist to consolidated FormSubmission collection
    console.log("[Submission Pipeline] Saving submission to consolidated FormSubmission collection...");
    const submission = await FormSubmission.create({
      formType,
      emailStatus: "pending",
      emailError: null,
      ...validatedData,
      ...(resumeUrl ? { resumeUrl } : {}),
    });
    console.log(`[Submission Pipeline] FormSubmission record created. ID: ${submission._id}`);

    // 4. Save to legacy collection for dashboard backwards compatibility
    let legacyRecordId = "";
    if (formType === "contact" || formType === "discussion") {
      const legacyContact = await Contact.create({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        serviceType: validatedData.serviceType,
        budget: validatedData.budget,
        message: validatedData.message,
        hearAboutUs: validatedData.hearAboutUs,
        contactMethod: validatedData.contactMethod,
      });
      legacyRecordId = legacyContact._id;
      console.log(`[Submission Pipeline] Legacy Contact record created. ID: ${legacyRecordId}`);
    } else if (formType === "package") {
      const legacyLead = await CustomerLead.create({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        businessName: validatedData.businessName,
        state: validatedData.state,
        district: validatedData.district,
        industry: validatedData.industry,
        selectedPackage: validatedData.selectedPackage,
        estimatedBudget: validatedData.estimatedBudget,
        message: validatedData.message,
        status: "New",
      });
      legacyRecordId = legacyLead._id;
      console.log(`[Submission Pipeline] Legacy CustomerLead record created. ID: ${legacyRecordId}`);
    } else if (formType === "career") {
      const legacyJobApp = await JobApplication.create({
        jobId: validatedData.jobId,
        jobTitle: validatedData.jobTitle,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        resumeUrl,
        portfolioLink: validatedData.portfolioLink || "",
        coverNote: validatedData.coverNote || "",
        status: "new",
        source: "website",
      });
      legacyRecordId = legacyJobApp._id;
      console.log(`[Submission Pipeline] Legacy JobApplication record created. ID: ${legacyRecordId}`);
    }

    // 5. Build Admin Notification Email
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@illusorydesignstudios.com";
    const toEmail = process.env.EMAIL_TO || "business@illusorydesignstudios.com";
    const replyToEmail = validatedData.email;

    let emailSubject = "";
    let emailHtml = "";

    if (formType === "contact" || formType === "discussion") {
      emailSubject = `New Project ${formType === "discussion" ? "Discussion" : "Inquiry"} from ${validatedData.name}`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #FF1284; border-bottom: 2px solid #FF1284; padding-bottom: 10px; margin-top: 0;">
            New ${formType === "discussion" ? "Discussion Request" : "Contact Inquiry"}
          </h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Company:</strong> ${validatedData.company}</p>
          <p><strong>Service Type:</strong> ${validatedData.serviceType}</p>
          <p><strong>Budget:</strong> ${validatedData.budget}</p>
          <p><strong>Preferred Contact:</strong> ${validatedData.contactMethod}</p>
          <p><strong>How they heard:</strong> ${validatedData.hearAboutUs}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Project Description:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.5; white-space: pre-wrap;">${validatedData.message}</p>
        </div>
      `;
    } else if (formType === "package") {
      emailSubject = `New Lead Estimate - ${validatedData.name}`;
      emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #FF1284; border-bottom: 2px solid #FF1284; padding-bottom: 10px; margin-top: 0;">New Lead Estimate</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Business Name:</strong> ${validatedData.businessName}</p>
          <p><strong>Industry:</strong> ${validatedData.industry}</p>
          <p><strong>Location:</strong> ${validatedData.district}, ${validatedData.state}</p>
          <p><strong>Selected Package:</strong> ${validatedData.selectedPackage}</p>
          <p><strong>Estimated Budget:</strong> ${validatedData.estimatedBudget}</p>
          ${validatedData.message ? `
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Custom Requirements:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; line-height: 1.5; white-space: pre-wrap;">${validatedData.message}</p>
          ` : ""}
        </div>
      `;
    } else if (formType === "career") {
      emailSubject = `New Job Application: ${validatedData.jobTitle} - ${validatedData.fullName}`;
      emailHtml = `
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
              ` : ""}
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
          ` : ""}
        </div>
      `;
    }

    // 6. Send Admin Notification Email (Awaited)
    console.log(`[Submission Pipeline] Dispatching email to admin (${toEmail})...`);
    try {
      await transporter.sendMail({
        from: `"Illusory Inquiry Desk" <${fromEmail}>`,
        to: toEmail,
        replyTo: replyToEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      submission.emailStatus = "sent";
      await submission.save();
      console.log("[Submission Pipeline] Admin notification email sent successfully.");
    } catch (emailErr: any) {
      console.error("[Submission Pipeline] Nodemailer email dispatch failed:", emailErr);
      submission.emailStatus = "failed";
      submission.emailError = emailErr.message || String(emailErr);
      await submission.save();
      throw emailErr; // Throw to fail the request
    }

    // 7. Send Visitor Auto-Reply Email (Backgrounded / Non-blocking)
    let autoReplySubject = "";
    let autoReplyHtml = "";

    if (formType === "contact" || formType === "discussion") {
      autoReplySubject = "We have received your request! - Illusory Design Studios";
      autoReplyHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin: 10px 0 5px 0; letter-spacing: 2px;">ILLUSORY</h1>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0;">Design Studios</p>
          </div>
          <h3 style="color: #FF1284; margin-top: 0; font-size: 18px;">Request Logged Successfully</h3>
          <p>Hi ${validatedData.name},</p>
          <p>Thank you for reaching out to us. We have received your request for <strong>${validatedData.serviceType}</strong> and our team is currently analyzing it.</p>
          <p>One of our creative producers will get back to you within 24 hours to discuss the next steps.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF1284; font-size: 13px;">
            <strong>Your Message Reference:</strong><br />
            "${validatedData.message.length > 100 ? validatedData.message.substring(0, 100) + "..." : validatedData.message}"
          </div>
          <p>Best regards,</p>
          <p><strong>The Creative Team</strong><br />Illusory Design Studios</p>
        </div>
      `;
    } else if (formType === "package") {
      autoReplySubject = "We've received your request! - Illusory Design Studios";
      autoReplyHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin: 10px 0 5px 0; letter-spacing: 2px;">ILLUSORY</h1>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #6b7280; margin: 0;">Design Studios</p>
          </div>
          <h3 style="color: #FF1284; margin-top: 0; font-size: 18px;">Estimate Proposal Requested</h3>
          <p>Hi ${validatedData.name},</p>
          <p>Thank you for requesting an estimate quote for <strong>${validatedData.businessName}</strong>. We have received your package inquiry and our team is on it!</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF1284; font-size: 13px;">
            <strong>Request Details:</strong><br />
            • Selected Package: ${validatedData.selectedPackage}<br />
            • Estimated Budget: ${validatedData.estimatedBudget}<br />
            • Industry segment: ${validatedData.industry}
          </div>
          <p>One of our creative producers will get back to you within 24 hours to discuss your proposal.</p>
          <p>Best regards,</p>
          <p><strong>The Creative Team</strong><br />Illusory Design Studios</p>
        </div>
      `;
    } else if (formType === "career") {
      autoReplySubject = `Application Received - ${validatedData.jobTitle} - Illusory Design Studios`;
      autoReplyHtml = `
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
            <p style="margin: 5px 0; font-size: 13px;"><strong>Applied On:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Status:</strong> Under Review</p>
          </div>
          <p>Best regards,</p>
          <p><strong>The Operations Team</strong><br />Illusory Design Studios</p>
        </div>
      `;
    }

    if (autoReplySubject && autoReplyHtml) {
      console.log(`[Submission Pipeline] Sending auto-reply confirmation to visitor (${validatedData.email || validatedData.fullName})...`);
      transporter.sendMail({
        from: `"Illusory Design Studios" <${fromEmail}>`,
        to: validatedData.email,
        subject: autoReplySubject,
        html: autoReplyHtml,
      }).catch((autoReplyErr) => {
        console.error("[Submission Pipeline] Visitor auto-reply failed in background:", autoReplyErr);
      });
    }

    console.log(`[Submission Pipeline] Successful execution. Form type: ${formType}, Elapsed: ${Date.now() - startTime}ms`);
    return res.status(201).json({
      success: true,
      message: "Submission processed and email dispatched successfully.",
      id: submission._id,
      legacyId: legacyRecordId
    });

  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    if (error instanceof z.ZodError) {
      console.warn(`[Submission Pipeline] Zod validation failure. Elapsed: ${elapsed}ms. Error:`, error.issues);
      return res.status(400).json({
        success: false,
        error: error.issues[0]?.message || "Validation failed",
        details: error.issues,
      });
    }

    console.error(`[Submission Pipeline] Unexpected error in submission flow. Elapsed: ${elapsed}ms. Error:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to submit request",
    });
  }
};
