require('dotenv').config();
const app = require('./app');
const { connectToDatabase } = require('./config/db');

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
