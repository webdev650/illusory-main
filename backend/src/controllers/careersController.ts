import { Request, Response } from "express";
import CareerApplication from "../models/CareerApplication";
import transporter from "../config/nodemailer";

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const application = await CareerApplication.create(req.body);

    // Send Email Notification to Studio
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || "official@illusory.design",
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending career application email:", error);
      } else {
        console.log("Career application email sent:", info.response);
      }
    });

    res.status(201).json(application);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
