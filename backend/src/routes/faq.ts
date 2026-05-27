import { Router } from "express";
import { getFAQs, createFAQ } from "../controllers/faqController";

const router = Router();

router.get("/", getFAQs);
router.post("/", createFAQ);

export default router;
