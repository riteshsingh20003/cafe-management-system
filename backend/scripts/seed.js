const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { MenuItem } = require('../models/MenuItem');
const seedMenuItems = require('../data/seedData');

const runSeed = async () => {
  const uri = process.env.MONGODB_URI;

  console.log('\n========================================');
  console.log(' Cafe Management System - Database Seeder');
  console.log('========================================\n');

  if (!uri) {
    console.error('ERROR: MONGODB_URI is not set in backend/.env');
    console.log('Please provide a valid MongoDB connection string to seed the database.');
    console.log('Note: The backend mock store automatically provides these 20 items in-memory during local development.\n');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB URI...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB successfully.');

    // Clear existing menu items
    const deleted = await MenuItem.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing menu items.`);

    // Insert seed items
    const inserted = await MenuItem.insertMany(seedMenuItems);
    console.log(`Successfully seeded ${inserted.length} cafe menu items!`);

    // Category summary
    const categories = {};
    inserted.forEach((item) => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });

    console.log('\nCategory breakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(` - ${cat}: ${count} items`);
    });

    console.log('\nSeeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`\nFailed to seed database: ${error.message}`);
    console.log('\nTip: If you do not have a live MongoDB Atlas cluster, the server will');
    console.log('run in Mock Mode with all 20 seed items pre-loaded automatically!\n');
    await mongoose.disconnect();
    process.exit(1);
  }
};

runSeed();
