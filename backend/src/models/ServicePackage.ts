import mongoose, { Schema, Document } from "mongoose";

export interface IServicePackage extends Document {
  serialNumber?: number;
  category?: string;
  industry?: string;
  subSegments?: string;
  type?: string;
  basic?: string;
  basicDeliverables?: string;
  standard?: string;
  standardDeliverables?: string;
  premium?: string;
  premiumDeliverables?: string;
}

const ServicePackageSchema: Schema = new Schema({
  serialNumber: { type: Number },
  category: { type: String, default: "" },
  industry: { type: String, default: "" },
  subSegments: { type: String, default: "" },
  type: { type: String, default: "" },
  basic: { type: String, default: "" },
  basicDeliverables: { type: String, default: "" },
  standard: { type: String, default: "" },
  standardDeliverables: { type: String, default: "" },
  premium: { type: String, default: "" },
  premiumDeliverables: { type: String, default: "" },
});

export default mongoose.models.ServicePackage ||
  mongoose.model<IServicePackage>("ServicePackage", ServicePackageSchema);
