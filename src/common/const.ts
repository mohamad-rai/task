import * as dotenv from 'dotenv';
dotenv.config();

export const DB = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT) || 3306,
  USERNAME: process.env.DB_USERNAME || 'root',
  PASSWORD: process.env.DB_PASSWORD || 'admin',
  NAME: process.env.DB_NAME || 'task',
};

export const PRODUCTION_MODE = process.env.PRODUCTION_MODE === 'true';

export const JWT_SECRET = process.env.JWT_SECRET || 'adlojiuvhgfr938';

export const UPLOAD_PATH = './uploads';
