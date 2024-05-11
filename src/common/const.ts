export const DB = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT) || 3306,
  USERNAME: process.env.DB_USERNAME || 'root',
  PASSWORD: process.env.DB_PASSWORD || 'admin',
  NAME: process.env.DB_NAME || 'task',
};

export const PRODUCTION_MODE = process.env.PRODUCTION_MODE === 'true';