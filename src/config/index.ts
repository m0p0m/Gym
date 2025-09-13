import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/gym-management',
  jwtSecret: process.env.JWT_SECRET || 'a-very-secret-key',
  apiKey: process.env.API_KEY || 'a-very-secret-api-key', // A default for development
  zarinpalMerchantId: process.env.ZARINPAL_MERCHANT_ID || 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // Placeholder
};

export default config;
