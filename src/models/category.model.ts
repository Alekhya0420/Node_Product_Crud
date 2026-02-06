import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  status: "active" | "inactive";
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<ICategory>("Category", CategorySchema);

