const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const { runMigrations } = require('../database/migrate');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Hosted MySQL providers (Aiven, Railway, PlanetScale, ...) require TLS on
// external connections. DB_SSL=true enables encryption; CA verification stays
// off because managed providers rotate certs/CAs that are not bundled with
// Node - the traffic is still encrypted, just not CA-pinned.
const useSsl = /^(1|true|yes)$/i.test(String(process.env.DB_SSL || ''));

// Optional per-session sql_mode. Hosted providers default to strict modes
// (STRICT_ALL_TABLES / ANSI / ONLY_FULL_GROUP_BY) that this app was never
// built against - it was developed and verified on MariaDB's non-strict mode,
// where invalid ENUM values coerce silently instead of throwing. Setting
// DB_SQL_MODE pins every new pooled connection to the expected mode so
// behaviour is identical on any host (set automatically for production).
const SESSION_SQL_MODE = process.env.DB_SQL_MODE || '';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'suprema_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

if (SESSION_SQL_MODE) {
  // Issued synchronously on connection creation, so it is queued ahead of
  // any application query that later uses this connection.
  pool.on('connection', (connection) => {
    connection.query(`SET SESSION sql_mode = ${connection.escape(SESSION_SQL_MODE)}`, (err) => {
      if (err) console.warn('⚠️  Could not set session sql_mode:', err.message);
    });
  });
}

// Verify initial DB connection on server startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connection Established Successfully');
    console.log(`📌 Connected to Database: '${process.env.DB_NAME}' on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();

    // Bring an older database up to the current schema. Safe on every boot:
    // migrations are idempotent and additive only.
    await runMigrations(pool);
  } catch (error) {
    console.warn('⚠️  MySQL Database Connection Warning:', error.message);
    console.warn('   (Ensure MySQL server is running and database "suprema_db" exists before executing queries)');
  }
}

/**
 * Resolves once the connection check and any pending migrations have finished.
 *
 * The server itself does not need to wait - it can start accepting requests
 * while the schema catches up. Tests do need to wait: querying before a
 * migration lands would assert against the OLD schema, which is a flaky and
 * misleading failure. Nothing here ever rejects, so awaiting it is always safe.
 */
const ready = testConnection();

module.exports = pool;
module.exports.ready = ready;
