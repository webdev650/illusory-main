import { Router, Request, Response } from "express";

const router = Router();

router.get("/env", (req: Request, res: Response) => {
  const envStatus = {
    EMAIL_HOST: {
      loaded: !!process.env.EMAIL_HOST,
      value: process.env.EMAIL_HOST || null,
    },
    EMAIL_PORT: {
      loaded: !!process.env.EMAIL_PORT,
      value: process.env.EMAIL_PORT || null,
    },
    EMAIL_USER: {
      loaded: !!process.env.EMAIL_USER,
      value: process.env.EMAIL_USER || null,
    },
    EMAIL_PASS: {
      loaded: !!process.env.EMAIL_PASS,
      value: process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 5)}...` : null,
    },
    EMAIL_FROM: {
      loaded: !!process.env.EMAIL_FROM,
      value: process.env.EMAIL_FROM || null,
    },
    EMAIL_TO: {
      loaded: !!process.env.EMAIL_TO,
      value: process.env.EMAIL_TO || null,
    },
    MONGODB_URI: {
      loaded: !!process.env.MONGODB_URI,
      value: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : null,
    },
    NODE_ENV: process.env.NODE_ENV || "development",
  };

  console.log("=== Production Environment Variables Status Audit ===");
  console.log(JSON.stringify(envStatus, null, 2));

  res.json({
    message: "Environment variables loaded status. Secrets are masked.",
    envStatus,
  });
});

export default router;
