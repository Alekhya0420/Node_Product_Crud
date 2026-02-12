import { Response } from "express";
import { CartModel } from "../../models/user/cart.module";
import { OrderModel } from "../../models/user/order.model";
import { InventoryModel } from "../../models/inventory.model";
import { ProductDocument } from "../../models/product.model";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { calculateStatus } from "../../helper/calculate.inventory";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    // Get cart with populated product
    const cart = await CartModel.findOne({ userId: req.user!.id }).populate<{
      items: { productId: ProductDocument; quantity: number }[];
    }>("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems: {
      productId: any;
      quantity: number;
      price: number;
    }[] = [];

    // Loop through cart items
    for (const item of cart.items) {
      const product = item.productId;

      if (!product) {
        return res.status(400).json({
          message: "Product not found",
        });
      }

      // Check inventory
      const inventory = await InventoryModel.findOne({
        productId: product._id,
      });

      if (!inventory || inventory.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }
      inventory.quantity -= item.quantity;

      // Update stock status
      inventory.status = calculateStatus(
        inventory.quantity,
        inventory.minThreshold,
      );
      await inventory.save();
      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const order = await OrderModel.create({
      userId: req.user!.id,
      items: orderItems,
      totalAmount,
    });

    //Order has placed so oviously cart will be removed
    await CartModel.deleteOne({ userId: req.user!.id });

    return res.status(201).json({
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      message: "Failed to place order",
    });
  }
};

// Get my orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await OrderModel.find({ userId: req.user!.id }).populate(
      "items.productId",
      "name price",
    );

    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
