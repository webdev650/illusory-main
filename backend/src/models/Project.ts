import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  navigation: string;
  title: string;
  image: string;
  video?: string;
  gallery?: string[];
  description: string;
  tags: string;
}

const ProjectSchema: Schema = new Schema({
  navigation: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String },
  gallery: [{ type: String }],
  description: { type: String, required: true },
  tags: { type: String, required: true },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
