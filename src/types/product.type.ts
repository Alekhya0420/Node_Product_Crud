export interface Product {
  name: string;
  price: number;
  status: string;

  file?: {
    url: string;
    originalName: string;
    mimeType: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
