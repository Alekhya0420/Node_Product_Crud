import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  otpVerified?:boolean,
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    email: String,
    password: String,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    otp: String,
    otpExpiry: Date,
    otpVerified: { type: Boolean, default: false },

  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);
