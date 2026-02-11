import { Response } from "express";
import { CartModel } from "../../models/user/cart.module";
import { OrderModel } from "../../models/user/order.model";
import { AuthRequest } from "../../middlewares/auth.middleware";

// Place order
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user!.id })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    const orderItems = cart.items.map((item: any) => {
      total += item.productId.price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    const order = await OrderModel.create({
      userId: req.user!.id,
      items: orderItems,
      totalAmount: total,
    });

    await CartModel.deleteOne({ userId: req.user!.id });

    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get my orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await OrderModel.find({ userId: req.user!.id })
      .populate("items.productId", "name price");

    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
