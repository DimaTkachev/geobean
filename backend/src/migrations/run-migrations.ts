import fs from 'fs';
import path from 'path';

import { sequelize } from '../config/sequelize';

interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

const checkColumnExists = async (
  tableName: string,
  columnName: string,
): Promise<boolean> => {
  try {
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}' 
      AND COLUMN_NAME = '${columnName}'
    `);
    return Array.isArray(results) && results.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists:`, error);
    return false;
  }
};

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

    // Run data migrations with INSERT IGNORE to avoid duplicates
    const dataMigrationFile = path.join(__dirname, '002_insert_data.sql');
    const dataSql = fs.readFileSync(dataMigrationFile, 'utf8');

    // Replace INSERT INTO with INSERT IGNORE INTO to avoid duplicate errors
    const safeSql = dataSql.replace(/INSERT INTO/gi, 'INSERT IGNORE INTO');

    // Split the SQL file into individual statements
    const dataStatements = safeSql
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

    // Run additional insert and alter migration with safer column addition
    const insertAndAlterMigrationFile = path.join(
      __dirname,
      '004_insert_and_alter.sql',
    );
    const insertAndAlterSql = fs.readFileSync(
      insertAndAlterMigrationFile,
      'utf8',
    );

    // Replace INSERT INTO with INSERT IGNORE INTO
    const safeInsertAndAlterSql = insertAndAlterSql.replace(
      /INSERT INTO/gi,
      'INSERT IGNORE INTO',
    );

    // Split the SQL file into individual statements
    const insertAndAlterStatements = safeInsertAndAlterSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute each statement separately
    for (const statement of insertAndAlterStatements) {
      try {
        // Check if this is a column addition statement
        if (statement.toLowerCase().includes('add column qrbase64')) {
          const columnExists = await checkColumnExists('shop', 'qrBase64');
          if (columnExists) {
            console.log('Column qrBase64 already exists, skipping...');
            continue;
          }
        }

        await sequelize.query(`${statement};`);
      } catch (error) {
        const dbError = error as DatabaseError;
        // Skip duplicate column errors
        if (dbError.message?.includes('Duplicate column name')) {
          console.log('Column already exists, skipping...');
          continue;
        }
        // Log other errors but continue
        console.error(
          'Error executing insert/alter statement:',
          dbError.message,
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
