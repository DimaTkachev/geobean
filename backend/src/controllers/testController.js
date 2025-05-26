const sequelize = require('../config/db');

exports.getTestMessage = async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT "Hello from MySQL!" as message');
    
    res.json({
      apiMessage: 'Hello from Express API!',
      dbMessage: results[0].message
    });
  } catch (error) {
    console.error('Test controller error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};