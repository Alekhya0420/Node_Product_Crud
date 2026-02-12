import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { createSocketServer } from "./socket/socket.server";
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes'
import categoryRoutes from './routes/category.routes'
import supplierRoutes from './routes/supplier.routes'
import inventoryRoutes from './routes/inventory.routes'
import dashboardRoutes from './routes/dashboard.routes'
import OrderRoutes from './routes/user/order.routes'
import CartRoutes from './routes/user/cart.routes'
import { connectDB } from "./config/db";

const app = express();
const PORT = 3000;

//const MONGO_URI = 'mongodb+srv://Alekhya:VesEL_ND77thuQV@cluster0.xel9zn0.mongodb.net/productDB?retryWrites=true&w=majority'
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get('/', (_req: Request, res: Response) => {
  res.send('Product CRUD API is running');
  res.send('Product CRUD API is running');
});

app.use('/api/products', productRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/supplier',supplierRoutes);
app.use('/api/inventory',inventoryRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/order',OrderRoutes)
app.use('/api/cart',CartRoutes);


const startServer = async () => {
  try {
    await connectDB();

    const server = createSocketServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();



