import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  products: Schema.Types.ObjectId[];
  status: "active" | "inactive";
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

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
