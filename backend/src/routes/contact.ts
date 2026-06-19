import { Router } from "express";
import { getContacts, createContact } from "../controllers/contactController";
import rateLimit from "express-rate-limit";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 submissions per 15 minutes
  message: { error: "Too many contact submissions from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", getContacts);
router.post("/", contactLimiter, createContact);

export default router;
