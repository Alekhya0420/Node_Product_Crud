import { Schema, model, Document } from "mongoose";

export interface supplierDocument extends Document {
  name: string;
  status: "active" | "inactive";
  products: Schema.Types.ObjectId[];
}

const supplierSchema = new Schema<supplierDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      trim: true,
      default: "active"
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

export const SupplierModel = model<supplierDocument>("Supplier",supplierSchema);