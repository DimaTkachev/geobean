const sequelize = require('./db');

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to DB established');

        await sequelize.sync();
        console.log('✅ Models synchronized');

        return sequelize;
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

module.exports = { initializeDatabase };
