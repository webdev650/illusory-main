import mongoose, { Schema, Document } from "mongoose";

export interface IFormSubmission extends Document {
  formType: "contact" | "career" | "discussion" | "package";
  submittedAt: Date;
  emailStatus: "pending" | "sent" | "failed";
  emailError: string | null;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string;
  serviceType?: string;
  budget?: string;
  hearAboutUs?: string;
  contactMethod?: string;
  fullName?: string;
  portfolioLink?: string;
  coverNote?: string;
  jobId?: string;
  jobTitle?: string;
  resumeUrl?: string;
  businessName?: string;
  state?: string;
  district?: string;
  industry?: string;
  selectedPackage?: string;
  estimatedBudget?: string;
}

const FormSubmissionSchema: Schema = new Schema(
  {
    formType: { 
      type: String, 
      enum: ["contact", "career", "discussion", "package"], 
      required: true 
    },
    submittedAt: { type: Date, default: Date.now },
    emailStatus: { 
      type: String, 
      enum: ["pending", "sent", "failed"], 
      default: "pending" 
    },
    emailError: { type: String, default: null },
    // Flattened form fields
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
    company: { type: String },
    serviceType: { type: String },
    budget: { type: String },
    hearAboutUs: { type: String },
    contactMethod: { type: String },
    fullName: { type: String },
    portfolioLink: { type: String },
    coverNote: { type: String },
    jobId: { type: String },
    jobTitle: { type: String },
    resumeUrl: { type: String },
    businessName: { type: String },
    state: { type: String },
    district: { type: String },
    industry: { type: String },
    selectedPackage: { type: String },
    estimatedBudget: { type: String }
  },
  { 
    strict: false, // Allows saving other form fields dynamically if added in future
    timestamps: true 
  }
);

// Add index on common query fields
FormSubmissionSchema.index({ formType: 1, emailStatus: 1 });
FormSubmissionSchema.index({ email: 1 });

export default mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema, "formSubmissions");
