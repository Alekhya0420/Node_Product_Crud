import { Schema, model, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  price: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>(
  'Product',
  productSchema
);
