import { Request, Response } from "express";
import Contact from "../models/Contact";
import transporter from "../config/nodemailer";

export const getContacts = async (req: Request, res: Response) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    // 1. Save contact message to database
    const contact = await Contact.create(req.body);

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    // 2. Send Email Notification to Studio (Admin)
    const adminMailOptions = {
      from: fromEmail,
      to: process.env.EMAIL_TO || "business@illusorydesignstudios.com",
      subject: `New Project Inquiry from ${contact.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #FF1284; border-bottom: 2px solid #FF1284; padding-bottom: 10px;">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Phone:</strong> ${contact.phone || "N/A"}</p>
          <p><strong>Company:</strong> ${contact.company || "N/A"}</p>
          <p><strong>Service Type:</strong> ${contact.serviceType}</p>
          <p><strong>Budget:</strong> ${contact.budget || "N/A"}</p>
          <p><strong>Preferred Contact:</strong> ${contact.contactMethod || "N/A"}</p>
          <p><strong>How they heard:</strong> ${contact.hearAboutUs || "N/A"}</p>
          <hr />
          <p><strong>Project Description:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${contact.message}</p>
        </div>
      `,
    };

    console.log("Saving contact inquiry to database...");
    console.log("Sending admin email notification...");
    await transporter.sendMail(adminMailOptions);

    console.log("All contact operations completed successfully!");
    res.status(201).json(contact);
  } catch (error: any) {
    console.error("Detailed server error in contact creation process:", error);
    res.status(500).json({ error: error.message || "Failed to submit inquiry. All operations must succeed." });
  }
};
