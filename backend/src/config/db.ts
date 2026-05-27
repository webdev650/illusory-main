import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    console.log(`Connecting to database at ${MONGODB_URI}...`);
    const options = MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1")
      ? { serverSelectionTimeoutMS: 3000 }
      : {};
    await mongoose.connect(MONGODB_URI, options);
    console.log("MongoDB Connected Successfully");
    
    // Auto-seed packages if needed
    try {
      const { seedPackageDataIfNeeded } = await import("./seedPackages");
      await seedPackageDataIfNeeded();
    } catch (seedPkgErr) {
      console.error("Auto-seeding package data failed:", seedPkgErr);
    }

    // Auto-seed projects and other database content if empty
    try {
      const { default: Project } = await import("../models/Project");
      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        console.log("Database is empty. Auto-seeding projects, FAQs, services, and about slides...");
        const { seedDatabase } = await import("../controllers/seedController");
        const mockReq = {} as any;
        const mockRes = {
          json: (data: any) => console.log("Auto-seeding completed successfully:", data),
          status: (code: number) => ({
            json: (err: any) => console.error(`Auto-seeding failed with status ${code}:`, err)
          })
        } as any;
        await seedDatabase(mockReq, mockRes);
      }
    } catch (seedErr) {
      console.error("Auto-seeding database failed:", seedErr);
    }
  } catch (error) {
    if (MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1")) {
      console.warn("Local MongoDB connection failed. Attempting to start in-memory MongoDB fallback...");
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        console.log(`In-memory MongoDB started at: ${mongoUri}`);
        await mongoose.connect(mongoUri);
        console.log("MongoDB (In-Memory) Connected Successfully");

        // Auto-seed packages if needed
        try {
          const { seedPackageDataIfNeeded } = await import("./seedPackages");
          await seedPackageDataIfNeeded();
        } catch (seedPkgErr) {
          console.error("Auto-seeding package data failed:", seedPkgErr);
        }

        // Auto-seed the database so the frontend has data immediately
        try {
          const { seedDatabase } = await import("../controllers/seedController");
          const mockReq = {} as any;
          const mockRes = {
            json: (data: any) => console.log("Auto-seeding (in-memory) completed:", data),
            status: (code: number) => ({
              json: (err: any) => console.error(`Auto-seeding (in-memory) failed with status ${code}:`, err)
            })
          } as any;
          await seedDatabase(mockReq, mockRes);
        } catch (seedErr) {
          console.error("Auto-seeding of in-memory database failed:", seedErr);
        }
      } catch (fallbackError) {
        console.error("Failed to start in-memory MongoDB fallback:", fallbackError);
        process.exit(1);
      }
    } else {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
};

export default connectDB;
