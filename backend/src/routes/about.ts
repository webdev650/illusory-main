import { Router } from "express";
import { getAboutSlides, createAboutSlide } from "../controllers/aboutController";

const router = Router();

router.get("/", getAboutSlides);
router.post("/", createAboutSlide);

export default router;
