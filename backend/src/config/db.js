const { Sequelize } = require('sequelize');
require('dotenv').config();

// Создаем экземпляр Sequelize без немедленного подключения
const dbConfig = {
    database: process.env.DB_NAME || 'geobean',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log,
};

const poolConfig = {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 10000,
};

const sequelize = new Sequelize({
    ...dbConfig,
    pool: poolConfig,
});

// Экспортируем только инициализированный экземпляр
module.exports = sequelize;
