import { Request, Response } from "express";
import FAQ from "../models/FAQ";

export const getFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
