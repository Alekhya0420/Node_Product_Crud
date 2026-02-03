export interface Product {
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
