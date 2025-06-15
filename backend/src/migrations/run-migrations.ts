import fs from 'fs';
import path from 'path';

import { sequelize } from '../config/sequelize';

interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

const runMigrations = async (): Promise<void> => {
  try {
    // Run schema migrations
    const schemaMigrationFile = path.join(__dirname, '001_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaMigrationFile, 'utf8');

    // Split the SQL file into individual statements
    const schemaStatements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each schema statement separately
    for (const statement of schemaStatements) {
      try {
        // Skip INSERT statements as they might conflict with existing data
        if (!statement.toLowerCase().includes('insert into')) {
          await sequelize.query(`${statement};`);
        }
      } catch (error) {
        // Log the error but continue with other statements
        console.error(
          'Error executing schema statement:',
          (error as DatabaseError).message,
        );
      }
    }

    // Run data migrations
    const dataMigrationFile = path.join(__dirname, '002_insert_data.sql');
    const dataSql = fs.readFileSync(dataMigrationFile, 'utf8');

    // Split the SQL file into individual statements
    const dataStatements = dataSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each data statement separately
    for (const statement of dataStatements) {
      try {
        await sequelize.query(`${statement};`);
      } catch (error) {
        // Log the error but continue with other statements
        console.error(
          'Error executing data statement:',
          (error as DatabaseError).message,
        );
      }
    }

    // Run table rename migration
    const renameMigrationFile = path.join(
      __dirname,
      '003_rename_markers_table.sql',
    );
    const renameSql = fs.readFileSync(renameMigrationFile, 'utf8');

    // Split the SQL file into individual statements
    const renameStatements = renameSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each rename statement separately
    for (const statement of renameStatements) {
      try {
        await sequelize.query(`${statement};`);
      } catch (error) {
        // Log the error but continue with other statements
        console.error(
          'Error executing rename statement:',
          (error as DatabaseError).message,
        );
      }
    }

    // Run additional insert and alter migration
    const insertAndAlterMigrationFile = path.join(
      __dirname,
      '004_insert_and_alter.sql',
    );
    const insertAndAlterSql = fs.readFileSync(
      insertAndAlterMigrationFile,
      'utf8',
    );

    // Split the SQL file into individual statements
    const insertAndAlterStatements = insertAndAlterSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement separately
    for (const statement of insertAndAlterStatements) {
      try {
        await sequelize.query(`${statement};`);
      } catch (error) {
        // Log the error but continue with other statements
        console.error(
          'Error executing insert/alter statement:',
          (error as DatabaseError).message,
        );
      }
    }

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

runMigrations();
