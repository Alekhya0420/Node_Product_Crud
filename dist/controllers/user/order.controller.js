"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.placeOrder = void 0;
const cart_module_1 = require("../../models/user/cart.module");
const order_model_1 = require("../../models/user/order.model");
const inventory_model_1 = require("../../models/inventory.model");
const calculate_inventory_1 = require("../../helper/calculate.inventory");
const placeOrder = async (req, res) => {
    try {
        // Get cart with populated product
        const cart = await cart_module_1.CartModel.findOne({ userId: req.user.id }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        let totalAmount = 0;
        const orderItems = [];
        // Loop through cart items
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                return res.status(400).json({
                    message: "Product not found",
                });
            }
            // Check inventory
            const inventory = await inventory_model_1.InventoryModel.findOne({
                productId: product._id,
            });
            if (!inventory || inventory.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`,
                });
            }
            inventory.quantity -= item.quantity;
            // Update stock status
            inventory.status = (0, calculate_inventory_1.calculateStatus)(inventory.quantity, inventory.minThreshold);
            await inventory.save();
            totalAmount += product.price * item.quantity;
            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }
        // Create order
        const order = await order_model_1.OrderModel.create({
            userId: req.user.id,
            items: orderItems,
            totalAmount,
        });
        //Order has placed so oviously cart will be removed
        await cart_module_1.CartModel.deleteOne({ userId: req.user.id });
        return res.status(201).json({
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
        console.error("Order error:", error);
        return res.status(500).json({
            message: "Failed to place order",
        });
    }
};
exports.placeOrder = placeOrder;
// Get my orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await order_model_1.OrderModel.find({ userId: req.user.id }).populate("items.productId", "name price");
        res.status(200).json(orders);
    }
    catch {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};
exports.getMyOrders = getMyOrders;
//# sourceMappingURL=order.controller.js.map