import { Router } from "express";
import aboutRoutes from "./about";
import contactRoutes from "./contact";
import faqRoutes from "./faq";
import projectsRoutes from "./projects";
import seedRoutes from "./seed";
import servicesRoutes from "./services";
import uploadRoutes from "./upload";
import packageRoutes from "./package";
import careersRoutes from "./careers";
import debugRoutes from "./debug";
import submissionRoutes from "./submission";

const router = Router();

router.use("/about", aboutRoutes);
router.use("/contact", contactRoutes);
router.use("/faq", faqRoutes);
router.use("/projects", projectsRoutes);
router.use("/seed", seedRoutes);
router.use("/services", servicesRoutes);
router.use("/upload", uploadRoutes);
router.use("/package", packageRoutes);
router.use("/careers", careersRoutes);
router.use("/debug", debugRoutes);
router.use("/submissions", submissionRoutes);

export default router;
