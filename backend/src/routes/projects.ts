import { Router } from "express";
import { getProjects, createProject, getProjectByNavigation } from "../controllers/projectsController";

const router = Router();

router.get("/", getProjects);
router.get("/:navigation", getProjectByNavigation);
router.post("/", createProject);

export default router;
