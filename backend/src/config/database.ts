import { Sequelize } from 'sequelize';
import { sequelize } from './sequelize';

export const initializeDatabase = async (): Promise<Sequelize> => {
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
