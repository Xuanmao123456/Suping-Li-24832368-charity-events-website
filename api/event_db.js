/**
 * event_db.js
 * ------------------------------------------------------------
 * Database connection module for the Charity Events website.
 * Uses mysql2/promise so we can use async/await and Promises.
 *
 * Adjust the host / user / password to match your local MySQL setup.
 * ------------------------------------------------------------
 */

const mysql = require('mysql2/promise');

// Create a connection pool (more efficient than a single connection)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '13976973081@Lsp',
  database: 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

/**
 * Test the database connection.
 * Called once when the server starts.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('[DB] Connected to MySQL database: charityevents_db');
    connection.release();
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
