const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database'); // Добавлено
const testRoutes = require('./routes/testRoutes');
const mapRoutes = require('./routes/mapRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

async function startServer() {
  try {
    await initializeDatabase();
    
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/test', testRoutes);
    app.use('/api/map', mapRoutes);

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;