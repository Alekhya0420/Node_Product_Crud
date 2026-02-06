import { Schema, model, Document, Types } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  status: "active" | "inactive";
  price: number;

  supplierId: Types.ObjectId;
  categoryId: Types.ObjectId;

  file?: {
    url: string;
    originalName: string;
    mimeType: string;
  };
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    price: {
      type: Number,
      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    file: {
      url: String,
      originalName: String,
      mimeType: String,
    },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>(
  "Product",
  productSchema
);

