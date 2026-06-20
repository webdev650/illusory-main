import { Router } from "express";
import multer from "multer";
import { submitForm } from "../controllers/submissionController";
import rateLimit from "express-rate-limit";

const router = Router();

// Setup rate limiter: Max 10 submissions per 15 minutes per IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: { success: false, error: "Too many form submissions from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Conditionally parse multipart form-data if contentType is multipart/form-data,
// otherwise fall through to express.json() parser.
const multipartConditionalMiddleware = (req: any, res: any, next: any) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    upload.single("resume")(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, error: "File size exceeds the 5MB limit" });
        }
        return res.status(400).json({ success: false, error: err.message || "Multer upload error" });
      }
      next();
    });
  } else {
    next();
  }
};

router.post("/", submissionLimiter, multipartConditionalMiddleware, submitForm);

export default router;
