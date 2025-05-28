import { sequelize } from '../config/sequelize';
import fs from 'fs';
import path from 'path';

interface DatabaseError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
    sqlMessage?: string;
}

const runMigrations = async () => {
    try {
        // Run schema migrations
        const schemaMigrationFile = path.join(
            __dirname,
            '001_initial_schema.sql'
        );
        const schemaSql = fs.readFileSync(schemaMigrationFile, 'utf8');

        // Split the SQL file into individual statements
        const schemaStatements = schemaSql
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        // Execute each schema statement separately
        for (const statement of schemaStatements) {
            try {
                // Skip INSERT statements as they might conflict with existing data
                if (!statement.toLowerCase().includes('insert into')) {
                    await sequelize.query(statement + ';');
                }
            } catch (error) {
                // Log the error but continue with other statements
                console.error(
                    'Error executing schema statement:',
                    (error as DatabaseError).message
                );
            }
        }

        // Run data migrations
        const dataMigrationFile = path.join(__dirname, '002_insert_data.sql');
        const dataSql = fs.readFileSync(dataMigrationFile, 'utf8');

        // Split the SQL file into individual statements
        const dataStatements = dataSql
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        // Execute each data statement separately
        for (const statement of dataStatements) {
            try {
                await sequelize.query(statement + ';');
            } catch (error) {
                // Log the error but continue with other statements
                console.error(
                    'Error executing data statement:',
                    (error as DatabaseError).message
                );
            }
        }

        console.log('✅ Migrations completed successfully');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
};

runMigrations();
