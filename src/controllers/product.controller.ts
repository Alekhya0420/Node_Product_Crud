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
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const productData: any = {
      name,
      price,
    };
    if (req.file) {
      productData.file = {
        url: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
    }

    const product = await ProductModel.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// UPDATE product
export const updateProduct = async (req: Request, res: Response) => {
  const updateData: any = { ...req.body };

  if (req.file) {
    updateData.file = {
      url: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    };
  }

  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    updateData,
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
