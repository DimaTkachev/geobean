import { Sequelize } from 'sequelize';

import { config } from './env';

import type { Options as SequelizeOptions } from 'sequelize';

interface DbConfig extends SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: 'mysql';
  logging: boolean | ((sql: string, timing?: number) => void);
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
