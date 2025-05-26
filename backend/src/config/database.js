const sequelize = require('./db');
const { Marker, CoffeeLot, Region, Country, Continent, Roasting, ProcessingMethod, TasteTag } = require('../models');

async function initializeDatabase() {
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
}

module.exports = { 
  initializeDatabase//,
  //sequelize 
};