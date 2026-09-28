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

// Create a connection pool instead of a single connection.
// Why a pool? Opening a fresh MySQL connection for every HTTP request
// is slow and wasteful. A pool keeps up to 10 connections open and
// reuses them, so concurrent requests share the same connections and
// the server stays fast under load.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '13976973081@Lsp',
  database: 'charityevents_db',
  waitForConnections: true,   // if all 10 connections are busy, queue the request instead of failing
  connectionLimit: 10,        // maximum simultaneous connections to MySQL
  queueLimit: 0,              // 0 = unlimited queue size (wait as long as needed)
  namedPlaceholders: true     // allow :name style placeholders in addition to ?
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
