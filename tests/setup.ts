import mongoose from 'mongoose';
import config from '../src/config';

// This would connect to a separate test database
const setupTestDB = () => {
  beforeAll(async () => {
    // Note: In a real scenario, you'd use a different database for tests.
    // For now, we'll point to the same one but the logic is here.
    const testDatabaseUrl = config.databaseUrl + '-test';
    await mongoose.connect(testDatabaseUrl);
  });

  afterEach(async () => {
    // Clean up the database after each test to ensure isolation
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

setupTestDB();
