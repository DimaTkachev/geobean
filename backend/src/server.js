const app = require('./app');
const { initializeDatabase } = require('./config/database');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
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
