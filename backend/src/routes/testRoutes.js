const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { getTestMessage } = require('../controllers/testController');

router.get('/', getTestMessage);

router.get('/db-check', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'OK',
      dbHost: sequelize.config.host,
      dialect: sequelize.getDialect()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Unable to connect to the database',
      error: error.message
    });
  }
});

module.exports = router;
