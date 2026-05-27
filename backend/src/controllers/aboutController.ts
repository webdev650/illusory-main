import { Request, Response } from "express";
import AboutSlide from "../models/AboutSlide";

export const getAboutSlides = async (req: Request, res: Response) => {
  try {
    const slides = await AboutSlide.find({});
    res.json(slides);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAboutSlide = async (req: Request, res: Response) => {
  try {
    const slide = await AboutSlide.create(req.body);
    res.status(201).json(slide);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
