import { Sequelize } from 'sequelize';
import type { Options as SequelizeOptions } from 'sequelize';

import { config } from './env';

interface DbConfig extends SequelizeOptions {
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
    database: config.database.name,
    username: config.database.user,
    password: config.database.password,
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: !config.isProduction,
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
