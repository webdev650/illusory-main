import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../src/models/Project";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const MONGO_URI = process.env.MONGODB_URI || "";

async function listImages() {
  if (!MONGO_URI) {
    console.error("❌ MONGODB_URI not found");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB\n");

    const projects = await Project.find({});

    projects.forEach((p: any) => {
      console.log("=================================");
      console.log(`📌 ${p.title}`);
      console.log("=================================");

      console.log("🖼 MAIN IMAGE:");
      console.log(p.image || "-");

      console.log("\n🎥 VIDEO:");
      console.log(p.video || "-");

      console.log("\n🖼 GALLERY:");

      if (p.gallery?.length > 0) {
        p.gallery.forEach((img: string, index: number) => {
          console.log(`${index + 1}. ${img}`);
        });
      } else {
        console.log("-");
      }

      console.log("\n");
    });

    await mongoose.disconnect();
    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

listImages();