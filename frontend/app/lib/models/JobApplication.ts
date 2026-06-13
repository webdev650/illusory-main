import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string; // Cloud storage URL
  portfolioLink?: string;
  coverNote?: string;
  status: string; // default "new"
  appliedAt: Date; // default Date.now()
  source: string; // default "website"
}

const JobApplicationSchema: Schema = new Schema({
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  portfolioLink: { type: String },
  coverNote: { type: String },
  status: { 
    type: String, 
    default: 'new', 
    enum: ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'] 
  },
  appliedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'website' },
});

export default mongoose.models.JobApplication || 
  mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema, 'jobApplications');
