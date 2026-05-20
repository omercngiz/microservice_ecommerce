import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import productRouter from './routes/product.route';
import categoryRouter from './routes/category.route';
import { producer, consumer } from './utils/kafka';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin:["http://localhost:3001"],
    credentials: true
}))
app.use(express.json());
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use('/products', productRouter);
app.use('/categories', categoryRouter);

app.get('/health', (req:Request, res:Response) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    timeStamp: new Date().toISOString(),
  });
});

const start = async () => {
  try {
    await Promise.all([consumer.connect(), producer.connect()]);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    process.exit(1);
  } 
}

start();