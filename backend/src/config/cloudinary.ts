import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
  console.warn("⚠️ Warning: Cloudinary environment variables are not fully configured in .env");
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true, // Forces all generated URLs to use HTTPS protocol
});

export default cloudinary;
