import { Response } from "express";
import { CartModel } from "../../models/user/cart.module";
import { ProductModel } from "../../models/product.model";
import { AuthRequest } from "../../middlewares/auth.middleware";
// Add to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Valid productId and quantity required",
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findOne({ userId: req.user!.id });

    if (!cart) {
      cart = await CartModel.create({
        userId: req.user!.id,
        items: [{ productId, quantity }],
      });
    } else {
      const item = cart.items.find(
        (i) => i.productId.toString() === productId
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return res.status(200).json({
      message: "Product added to cart",
      data: cart,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to add to cart",
    });
  }
};

// Get my cart
export const getMyCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user!.id })
      .populate("items.productId", "name price");

    res.status(200).json(cart);
  } catch {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Remove item
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;

    const cart = await CartModel.findOne({ userId: req.user!.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch {
    res.status(500).json({ message: "Failed to remove item" });
  }
};
