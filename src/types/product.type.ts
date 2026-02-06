import { Types } from "mongoose";

export interface Product {
  name: string;
  price: number;
  status?: "active" | "inactive";

  supplierId: Types.ObjectId | string;
  categoryId: Types.ObjectId | string;

  file?: {
    url: string;
    originalName: string;
    mimeType: string;
  };
}

