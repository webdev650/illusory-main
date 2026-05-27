import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerLead extends Document {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  state: string;
  district: string;
  industry: string;
  selectedPackage: string;
  estimatedBudget: string;
  message?: string;
  status: string;
  createdAt: Date;
}

const CustomerLeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  businessName: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  industry: { type: String, required: true },
  selectedPackage: { type: String, required: true },
  estimatedBudget: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["New", "Contacted", "Converted"], default: "New" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CustomerLead ||
  mongoose.model<ICustomerLead>("CustomerLead", CustomerLeadSchema);
