import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.routes';

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/productDB';

app.use(express.json());
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

