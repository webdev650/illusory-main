import mongoose, { Schema, Document } from "mongoose";

export interface IIndustryCategory extends Document {
  industryCategory: string;
  post: string;
  districtPriority: string;
}

const IndustryCategorySchema: Schema = new Schema({
  industryCategory: { type: String, required: true },
  post: { type: String, default: "" },
  districtPriority: { type: String, default: "" },
});

export default mongoose.models.IndustryCategory ||
  mongoose.model<IIndustryCategory>("IndustryCategory", IndustryCategorySchema);
