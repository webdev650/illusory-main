import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  budget?: string;
  message: string;
  hearAboutUs?: string;
  contactMethod?: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  serviceType: { type: String, required: true },
  budget: { type: String },
  message: { type: String, required: true },
  hearAboutUs: { type: String },
  contactMethod: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
