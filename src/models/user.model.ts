import { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", userSchema);
