import { Router } from "express";
import { seedDatabase } from "../controllers/seedController";

const router = Router();

router.get("/", seedDatabase);

export default router;
