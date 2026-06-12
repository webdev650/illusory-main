import { Router } from "express";
import { applyToJob } from "../controllers/careersController";

const router = Router();

router.post("/apply", applyToJob);

export default router;
