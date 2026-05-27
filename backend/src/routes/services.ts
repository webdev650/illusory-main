import { Router } from "express";
import { getServices, createService } from "../controllers/servicesController";

const router = Router();

router.get("/", getServices);
router.post("/", createService);

export default router;
