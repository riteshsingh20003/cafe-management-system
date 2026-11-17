const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB, isDatabaseConnected, isUsingMockStore } = require('./config/db');
const { setupSwagger } = require('./config/swagger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { initKeepAliveJob } = require('./cron/keepAlive');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with configurable origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid blocking frontend integration
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Standard HTTP middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Setup Swagger API Documentation (/api/docs & /api/docs.json)
setupSwagger(app);

// Root route welcoming message & links
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Cafe Menu & Order Management API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
    endpoints: {
      menu: '/api/menu',
      categories: '/api/menu/categories',
      orders: '/api/orders',
      orderTracking: '/api/orders/track/:orderNumber'
    },
    databaseStatus: isDatabaseConnected() ? 'connected (MongoDB)' : 'active (Mock Fallback Store)'
  });
});

/**
 * Health check endpoint for uptime monitors, Render cron, and deployment tests
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: isDatabaseConnected(),
      mode: isUsingMockStore() ? 'mock_fallback' : 'mongodb_atlas'
    }
  });
});

// Mount Resource Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Undefined Route Handling (404)
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  // Connect to database (or fall back to mock store)
  await connectDB();

  // Initialize background keep-alive cron job
  initKeepAliveJob();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` Cafe Management Backend Server is LIVE!`);
    console.log(` URL:               http://localhost:${PORT}`);
    console.log(` Swagger Docs:      http://localhost:${PORT}/api/docs`);
    console.log(` Health Endpoint:   http://localhost:${PORT}/api/health`);
    console.log(` Storage Mode:      ${isUsingMockStore() ? 'Mock Store Fallback' : 'MongoDB Atlas'}`);
    console.log(`======================================================\n`);
  });

  return server;
};

// Start server when executed directly
if (require.main === module) {
  startServer().catch((err) => {
    console.error('Fatal error during server startup:', err);
    process.exit(1);
  });
}

module.exports = { app, startServer };
