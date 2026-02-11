import { Schema, model, Document } from "mongoose";

export interface DashboardDocument extends Document {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalInventoryItems: number;
  lowStockCount: number;
  generatedAt: Date;
}

const dashboardSchema = new Schema<DashboardDocument>(
  {
    totalProducts: {
      type: Number,
      required: true,
      min: 0,
    },

    totalCategories: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSuppliers: {
      type: Number,
      required: true,
      min: 0,
    },

    totalInventoryItems: {
      type: Number,
      required: true,
      min: 0,
    },

    lowStockCount: {
      type: Number,
      required: true,
      min: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const DashboardModel = model<DashboardDocument>(
  "Dashboard",
  dashboardSchema
);
