const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const { runMigrations } = require('../database/migrate');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'suprema_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

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

testConnection();

module.exports = pool;
