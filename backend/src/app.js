const express = require('express');
const cors = require('cors');
const testRoutes = require('./routes/testRoutes');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/test', testRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

module.exports = app;
