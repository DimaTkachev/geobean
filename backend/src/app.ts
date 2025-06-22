import path from 'path';

import cors from 'cors';
import express, { json, Request, Response } from 'express';

import authRoutes from './routes/authRoutes';
import coffeeLotRoutes from './routes/coffeeLotRoutes';
import { mapRoutes } from './routes/mapRoutes';
import shopRoutes from './routes/shopRoutes';
import { testRoutes } from './routes/testRoutes';

const app = express();

// Serve static files from frontend/public
app.use(express.static(path.join(__dirname, '../../frontend/public')));

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://192.168.1.67:3000',
    'https://gentle-kids-hug.loca.lt',
    'https://geobean-app.loca.lt',
    /^https:\/\/.*\.loca\.lt$/,
    /^http:\/\/192\.168\.\d+\.\d+:3000$/,
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(json());

app.use('/api/test', testRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/coffee-lots', coffeeLotRoutes);

app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK' });
});

export default app;
