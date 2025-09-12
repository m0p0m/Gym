import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/gym-management',
  jwtSecret: process.env.JWT_SECRET || 'a-very-secret-key'
};

export default config;
