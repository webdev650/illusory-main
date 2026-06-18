import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load backend/.env relative to the location of this config file
const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Fallback to default loading if the relative file doesn't exist
  dotenv.config();
}
