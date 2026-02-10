import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  status: "active" | "inactive";
  products: Types.ObjectId[];
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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const CategoryModel = model<ICategory>("Category", CategorySchema);
