import { Router } from "express";
import upload from "../config/upload";

const router = Router();

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  // Safely get the file path/URL and ensure it uses secure https protocol
  let fileUrl = (req.file as any).path || (req.file as any).secure_url || "";
  if (typeof fileUrl === "string" && fileUrl.startsWith("http://")) {
    fileUrl = fileUrl.replace("http://", "https://");
  }

  res.json({
    message: "File uploaded successfully",
    url: fileUrl,
    public_id: (req.file as any).filename,
  });
});

export default router;
