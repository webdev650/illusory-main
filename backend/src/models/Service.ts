import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  link: string;
  textHead: string;
  words: { text: string; color: string }[];
}

const ServiceSchema: Schema = new Schema({
  link: { type: String, required: true },
  textHead: { type: String, required: true },
  words: [
    {
      text: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
