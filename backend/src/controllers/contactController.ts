import { Request, Response } from "express";
import { z } from "zod";
import Contact from "../models/Contact";
import FormSubmission from "../models/FormSubmission";
import transporter from "../config/nodemailer";
import { sanitizeObject } from "../utils/sanitize";

// Define validation schema using Zod
const contactValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(6, "Phone number is too short").max(20, "Phone number is too long"),
  company: z.string().min(1, "Company is required").max(150, "Company name is too long"),
  serviceType: z.string().min(1, "Service type is required"),
  budget: z.string().min(1, "Budget is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  hearAboutUs: z.string().min(1, "Hear about us is required"),
  contactMethod: z.string().min(1, "Contact method is required"),
  formType: z.enum(["contact", "discussion"]).optional().default("contact"),
  // Honeypot field
  website: z.string().optional(),
});

export const getContacts = async (req: Request, res: Response) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Validate payload using Zod
    const parsedData = contactValidationSchema.parse(req.body);

    // 2. Honeypot check (hidden field)
    if (parsedData.website && parsedData.website.trim() !== "") {
      console.warn("⚠️ Spam submission detected via honeypot. Silently dropping payload.");
      // Return a fake success message to confuse bots
      return res.status(201).json({
        success: true,
        message: "Message received successfully."
      });
    }

    // 3. Sanitize inputs
    const validatedData = sanitizeObject(parsedData);

    // Remove honeypot field from saved data
    delete validatedData.website;

    console.log(`Saving contact inquiry to database (${validatedData.formType})...`);

    // 4. Save to consolidated FormSubmission collection
    const submission = await FormSubmission.create({
      ...validatedData,
      emailStatus: "pending",
      emailError: null,
    });

    // 5. Save to legacy Contact collection for dashboard backward compatibility
    const contact = await Contact.create(validatedData);

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@illusorydesignstudios.com";

    // 6. Build Admin Notification Email
    const adminMailOptions = {
      from: `"Illusory Inquiry Desk" <${fromEmail}>`,
      to: process.env.EMAIL_TO || "business@illusorydesignstudios.com",
      replyTo: validatedData.email,
      subject: `New Project ${validatedData.formType === "discussion" ? "Discussion" : "Inquiry"} from ${validatedData.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 12px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #FF1284; border-bottom: 2px solid #FF1284; padding-bottom: 10px; margin-top: 0;">
            New ${validatedData.formType === "discussion" ? "Discussion Request" : "Contact Inquiry"}
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
      `,
    };

    // 7. Send Admin Notification Email (does not block client response)
    console.log("Sending admin email notification...");
    try {
      await transporter.sendMail(adminMailOptions);
      submission.emailStatus = "sent";
      await submission.save();
      console.log("✉️ Nodemailer: Admin notification email sent successfully.");
    } catch (emailErr: any) {
      console.error("❌ Admin email notification failed:", emailErr);
      submission.emailStatus = "failed";
      submission.emailError = emailErr.message || String(emailErr);
      await submission.save();
    }

    // 8. Send Customer Auto-Reply Confirmation Email (Optional but recommended)
    const customerMailOptions = {
      from: `"Illusory Design Studios" <${fromEmail}>`,
      to: validatedData.email,
      subject: "We have received your request! - Illusory Design Studios",
      html: `
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
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0 20px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">Please do not reply directly to this automated email.</p>
        </div>
      `,
    };

    transporter.sendMail(customerMailOptions).catch((customerEmailErr) => {
      console.error("❌ Failed to send customer auto-reply email:", customerEmailErr);
    });

    console.log("All contact operations completed successfully!");
    // Return created legacy object for frontend compatibility
    return res.status(201).json(contact);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.warn("⚠️ Zod validation failure in contact route:", error.issues);
      return res.status(400).json({ error: error.issues[0]?.message || "Validation failed" });
    }
    console.error("Detailed server error in contact creation process:", error);
    return res.status(500).json({ error: error.message || "Failed to submit inquiry" });
  }
};
