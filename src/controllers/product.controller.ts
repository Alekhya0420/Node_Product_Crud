// import { Request, Response } from 'express';
// import { Product } from '../types/product.type';


// let products: Product[] = [];

// //1)GET all products
// export const getProducts = (req: Request, res: Response): void => {
//   res.status(200).json(products);
// };

// //2)GET product by ID
// export const getProductById = (req: Request, res: Response): void => {
//   const id = Number(req.params.id);
//   const product = products.find(p => p.id === id);

//   if (!product) {
//     res.status(404).json({ message: 'Product not found' });
//     return;
//   }

//   res.status(200).json(product);
// };

// //3)CREATE product
// export const createProduct = (req: Request, res: Response): void => {
//   const { name, price } = req.body;

//   if (!name || !price) {
//     res.status(400).json({ message: 'Name and price are required' });
//     return;
//   }

//   const newProduct: Product = {
//     id: Date.now(),
//     name,
//     price,
//   };

//   products.push(newProduct);
//   res.status(201).json(newProduct);
// };

// //4)UPDATE product
// export const updateProduct = (req: Request, res: Response): void => {
//   const id = Number(req.params.id);
//   const product = products.find(p => p.id === id);

//   if (!product) {
//     res.status(404).json({ message: 'Product not found' });
//     return;
//   }

//   const { name, price } = req.body;

//   product.name = name ?? product.name;
//   product.price = price ?? product.price;

//   res.status(200).json(product);
// };

// //5)DELETE product
// export const deleteProduct = (req: Request, res: Response): void => {
//   const id = Number(req.params.id);

//   const productExists = products.some(p => p.id === id);

//   if (!productExists) {
//     res.status(404).json({ message: 'Product not found' });
//     return;
//   }

//   products = products.filter(p => p.id !== id);

//   res.status(200).json({ message: 'Product deleted successfully' });
// };


import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';

// GET all products
export const getProducts = async (_: Request, res: Response) => {
  const products = await ProductModel.find();
  res.status(200).json(products);
};

// GET product by ID
export const getProductById = async (req: Request, res: Response) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

// CREATE product
export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const product = await ProductModel.create({ name, price });
  res.status(201).json(product);
};

// UPDATE product
export const updateProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json(product);
};

// DELETE product
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ message: 'Product deleted successfully' });
};
