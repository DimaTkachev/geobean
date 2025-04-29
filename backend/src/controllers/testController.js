const { pool } = require('../config/db');

exports.getTestMessage = async (req, res) => {
  try {
    // Test database connection
    const [rows] = await pool.query('SELECT "Hello from MySQL!" as message');
    
    res.json({
      apiMessage: 'Hello from Express API!',
      dbMessage: rows[0].message
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ error: 'Database query failed' });
  }
};