import mongoose from 'mongoose';
import config from '../config';

const connectDB = async () => {
  // The test environment handles its own database connection
  if (config.env === 'test') {
    return;
  }
  try {
    await mongoose.connect(config.databaseUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
