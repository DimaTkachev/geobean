import express, { Request, Response } from 'express';
import cors from 'cors';
import { testRoutes } from './routes/testRoutes';
import { mapRoutes } from './routes/mapRoutes';

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/map', mapRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

export default app;
