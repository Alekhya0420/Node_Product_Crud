import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.routes';
import dotenv from 'dotenv';

const app = express();
const PORT = 3000;
dotenv.config();

//const MONGO_URI = 'mongodb+srv://Alekhya:VesEL_ND77thuQV@cluster0.xel9zn0.mongodb.net/productDB?retryWrites=true&w=majority'
dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;
app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.get('/', (_req: Request, res: Response) => {
  res.send('✅ Product CRUD API is running');
});

app.use('/api/products', productRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

startServer();

