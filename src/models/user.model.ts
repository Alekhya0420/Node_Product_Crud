import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";  
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  otpVerified?: boolean;
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {                        
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

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

