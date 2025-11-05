import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/logger';

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
