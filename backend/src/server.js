require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/database');

const PORT = process.env.PORT || 5001;

connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed', error);
        process.exit(1);
    });


(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to DB established');
      await sequelize.sync(); // { alter: true } 
      console.log('Models synchronized');
  
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('Error connecting to DB:', err.message);
      process.exit(1);
    }
  })();