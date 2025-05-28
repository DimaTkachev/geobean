import app from './app';
import { initializeDatabase } from './config/database';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

const startServer = async (): Promise<void> => {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
