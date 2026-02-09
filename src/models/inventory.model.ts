import { Schema, model, Document, Types } from "mongoose";

export interface InventoryDocument extends Document {
  productId: Types.ObjectId;
  quantity: number;
  minThreshold: number;
  status: "in_stock" | "out_of_stock";
}

const inventorySchema = new Schema<InventoryDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    minThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    status: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      default: "in_stock",
    },
  },
  { timestamps: true }
);

export const InventoryModel = model<InventoryDocument>(
  "Inventory",
  inventorySchema
);
