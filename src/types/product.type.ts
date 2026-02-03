export interface Product {
  _id: string;
  name: string;
  price: number;

  file?: {
    url: string;
    originalName: string;
    mimeType: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
