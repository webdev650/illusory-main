import { Request, Response } from "express";
import CareerApplication from "../models/CareerApplication";
import transporter from "../config/nodemailer";

export const applyToJob = async (req: Request, res: Response) => {
  try {
    // 1. Save application to database
    const application = await CareerApplication.create(req.body);

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    // 2. Send Email Notification to Studio (Admin)
    const adminMailOptions = {
      from: fromEmail,
      to: process.env.EMAIL_TO || "business@illusorydesignstudios.com",
      subject: `New Job Application: ${application.jobTitle} - ${application.fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0066FF; border-bottom: 2px solid #0066FF; padding-bottom: 10px;">New Job Application</h2>
          <p><strong>Position:</strong> ${application.jobTitle} (Ref: #${application.jobId.padStart(3, '0')})</p>
          <p><strong>Applicant Name:</strong> ${application.fullName}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Phone:</strong> ${application.phone}</p>
          <p><strong>Resume/Portfolio Link:</strong> <a href="${application.portfolioUrl}" target="_blank">${application.portfolioUrl}</a></p>
          <hr />
          <p><strong>Cover Letter:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${application.coverLetter || "No cover letter provided."}</p>
        </div>
      `,
    };

    console.log("Saving job application to database...");
    console.log("Sending admin email notification...");
    await transporter.sendMail(adminMailOptions);

    console.log("All operations completed successfully!");
    res.status(201).json(application);
  } catch (error: any) {
    console.error("Detailed server error in job application process:", error);
    res.status(500).json({ error: error.message || "Failed to submit application. All operations must succeed." });
  }
};
