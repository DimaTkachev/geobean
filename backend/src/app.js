const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const testRoutes = require('./routes/testRoutes');
const mapRoutes = require('./routes/mapRoutes');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/test', testRoutes);
app.use('/api/map', mapRoutes);

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = app;
