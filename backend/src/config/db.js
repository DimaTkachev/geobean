const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds timeout
});

async function connectToDatabase() {
    const maxRetries = 5;
    const retryDelay = 5000; // 2 seconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Connected to MySQL database');
            connection.release();
            return;
        } catch (error) {
            console.error(
                `Attempt ${i + 1} - Error connecting to MySQL:`,
                error.message
            );
            if (i < maxRetries - 1) {
                console.log(`Retrying in ${retryDelay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
                throw error;
            }
        }
    }
}

module.exports = { pool, connectToDatabase };
