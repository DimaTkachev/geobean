import { sequelize } from './sequelize';

import type { Sequelize } from 'sequelize';

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
