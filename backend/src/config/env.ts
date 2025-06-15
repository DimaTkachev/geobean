import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment variable schema
const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('5001'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('3306'),
  DB_NAME: z.string().default('geobean'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('password'),

  // JWT
  JWT_SECRET: z.string().default('your_jwt_secret_key'),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // API Keys
  GOOGLE_MAPS_API_KEY: z.string().optional(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Export typed environment configuration
export const config = {
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  server: {
    port: env.PORT,
  },

  database: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  google: {
    mapsApiKey: env.GOOGLE_MAPS_API_KEY,
  },
} as const;
