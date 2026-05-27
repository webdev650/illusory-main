import { Router } from "express";
import { getContacts, createContact } from "../controllers/contactController";

const router = Router();

router.get("/", getContacts);
router.post("/", createContact);

export default router;
