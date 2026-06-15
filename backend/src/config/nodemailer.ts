import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const mailConfig: any = process.env.EMAIL_HOST
  ? {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }
  : {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an App Password for Gmail
      },
    };

const transporter = nodemailer.createTransport(mailConfig);

export default transporter;
