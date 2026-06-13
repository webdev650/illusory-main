import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  referenceId: string; // e.g. "001"
  title: string;
  department: string;
  location: string;
  employmentType: string; // "Full-time" | "Part-time" | "Contract" | "Internship" | "Temporary"
  workMode: string; // "On-site" | "Remote" | "Hybrid"
  description: string; // mapped to overview
  responsibilities: string[];
  requirements: string[];
  lookingFor: string[]; // for UI detail page
  experience: string; // for UI detail page
  qualification: string; // for UI detail page
  company: string; // default "Illusory"
  isActivelyHiring: boolean; // default true
  isRemote: boolean; // default false
  datePosted: Date; // default Date.now()
  validThrough: Date; // default Date.now() + 180 days
}

const JobSchema: Schema = new Schema({
  referenceId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, required: true, default: 'Full-time' },
  workMode: { type: String, required: true, default: 'On-site' },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  lookingFor: { type: [String], default: [] },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  company: { type: String, default: 'Illusory' },
  isActivelyHiring: { type: Boolean, default: true },
  isRemote: { type: Boolean, default: false },
  datePosted: { type: Date, default: Date.now },
  validThrough: {
    type: Date,
    default: () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
  },
});

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
