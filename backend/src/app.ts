import cors from 'cors';
import express, { json, Request, Response } from 'express';

import authRoutes from './routes/authRoutes';
import { mapRoutes } from './routes/mapRoutes';
import shopRoutes from './routes/shopRoutes';
import { testRoutes } from './routes/testRoutes';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());

app.use('/api/test', testRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK' });
});

export default app;
