import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IEmployee extends Document {
  fullName: string;
  employeeId: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  isActive: boolean;
  joiningDate: Date;
  resetOtp?: string;
  resetOtpExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const EmployeeSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "employee" },
  phone: { type: String },
  isActive: { type: Boolean, required: true, default: true },
  joiningDate: { type: Date, required: true, default: Date.now },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date }
});

// Helper to hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
EmployeeSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);
