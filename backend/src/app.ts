import cors from 'cors';
import express, { json, Request, Response } from 'express';

import { mapRoutes } from './routes/mapRoutes';
import { testRoutes } from './routes/testRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(json());

app.use('/api/test', testRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK' });
});

export default app;
