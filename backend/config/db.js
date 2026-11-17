const mongoose = require('mongoose');

let isMockMode = false;

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 * Gracefully activates in-memory Mock Store fallback if connection fails or is unconfigured.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\n========================================================================');
    console.warn(' [MONGODB NOTICE] MONGODB_URI environment variable is not defined.');
    console.warn(' Action: Add your MongoDB Atlas connection string to backend/.env:');
    console.warn('         MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/cafe_db');
    console.warn(' [FALLBACK] Activating in-memory Mock Store fallback.');
    console.warn('========================================================================\n');
    isMockMode = true;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Fail fast on connection errors
      connectTimeoutMS: 4000
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    isMockMode = false;
    return true;
  } catch (error) {
    console.warn('\n========================================================================');
    console.warn(` [MONGODB WARNING] Could not connect to MongoDB: ${error.message}`);
    console.warn(' Action: Verify your MongoDB Atlas network access IP whitelist (0.0.0.0/0)');
    console.warn('         and credentials in backend/.env.');
    console.warn(' [FALLBACK] Continuing in Mock Fallback Mode.');
    console.warn(' Backend server, Swagger docs, order workflow and APIs are fully operational!');
    console.warn('========================================================================\n');
    isMockMode = true;
    return false;
  }
};

/**
 * Check if the live database is currently connected
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1 && !isMockMode;
};

/**
 * Check if server is currently running in mock store fallback mode
 */
const isUsingMockStore = () => {
  return !isDatabaseConnected();
};

module.exports = {
  connectDB,
  isDatabaseConnected,
  isUsingMockStore
};
