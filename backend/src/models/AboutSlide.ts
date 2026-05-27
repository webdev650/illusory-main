import mongoose, { Schema, Document } from "mongoose";

export interface IAboutSlide extends Document {
  section: "About Us" | "Mission" | "Vision";
  num: string;
  title: string;
  body: string;
}

const AboutSlideSchema: Schema = new Schema({
  section: { type: String, enum: ["About Us", "Mission", "Vision"], required: true },
  num: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
});

export default mongoose.models.AboutSlide || mongoose.model<IAboutSlide>("AboutSlide", AboutSlideSchema);
