import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface DbConfig extends Options {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dialect: 'mysql';
    logging: boolean;
}

interface PoolConfig {
    max: number;
    min: number;
    acquire: number;
    idle: number;
}

const dbConfig: DbConfig = {
    database: process.env.DB_NAME || 'geobean',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
};

const poolConfig: PoolConfig = {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 10000,
};

export const sequelize = new Sequelize({
    ...dbConfig,
    pool: poolConfig,
});
