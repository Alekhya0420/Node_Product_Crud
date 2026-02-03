import { Schema, model, Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  price: number;
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
    price: {
      type: Number,
      required: true,
    },
    file: {
      url: {
        type: String,
        required: false,
      },
      originalName: {
        type: String,
        required: false,
      },
      mimeType: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>(
  'Product',
  productSchema
);

