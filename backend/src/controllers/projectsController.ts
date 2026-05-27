import { Request, Response } from "express";
import Project from "../models/Project";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({});
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const getProjectByNavigation = async (req: Request, res: Response) => {
  try {
    const project = await Project.findOne({ navigation: req.params.navigation });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
