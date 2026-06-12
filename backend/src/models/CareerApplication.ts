import mongoose, { Schema, Document } from "mongoose";

export interface ICareerApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  coverLetter?: string;
  jobId: string;
  jobTitle: string;
  status: string;
  createdAt: Date;
}

const CareerApplicationSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  portfolioUrl: { type: String, required: true },
  coverLetter: { type: String },
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  status: { type: String, default: "New" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CareerApplication ||
  mongoose.model<ICareerApplication>("CareerApplication", CareerApplicationSchema);
