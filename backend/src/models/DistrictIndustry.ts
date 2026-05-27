import mongoose, { Schema, Document } from "mongoose";

export interface IDistrictIndustry extends Document {
  state: string;
  district: string;
  popularIndustries: string;
}

const DistrictIndustrySchema: Schema = new Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  popularIndustries: { type: String, default: "" },
});

export default mongoose.models.DistrictIndustry ||
  mongoose.model<IDistrictIndustry>("DistrictIndustry", DistrictIndustrySchema);
