/**
 * server.js
 * ------------------------------------------------------------
 * Main Express server for the Charity Events website API.
 *
 * Usage:
 *   1. npm install
 *   2. Make sure MySQL is running and charityevents_db exists
 *   3. node server.js
 *
 * API runs on http://localhost:3000
 * ------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./event_db');
const eventsRouter = require('./routes/events');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());                       // allow cross-origin from frontend
app.use(express.json());               // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Charity Events API is running',
    endpoints: [
      'GET /api/events',
      'GET /api/events/search?date=&location=&category_id=',
      'GET /api/events/:id',
      'GET /api/categories',
      'POST /api/events',
      'DELETE /api/events/:id',
      'POST /api/categories',
      'DELETE /api/categories/:id'
    ]
  });
});

// 404 handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start server
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`[Server] Charity Events API running on http://localhost:${PORT}`);
  });
}

startServer();
