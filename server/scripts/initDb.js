const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

const dbName = process.env.DB_NAME || 'suprema_db';

/**
 * Guard against destroying an existing database.
 *
 * This script DROPs the whole database, so running it out of habit (for example
 * as part of a normal `npm run dev` startup) silently deletes every registered
 * account. Newly created users then cannot log in and do not appear in the
 * admin panel, which looks exactly like a login bug but is data loss.
 *
 * If the database already contains real rows we stop and require --force.
 */
const force = process.argv.includes('--force') || process.env.SUPREMA_DB_FORCE === '1';

async function inspectExisting(connection) {
  const [dbRows] = await connection.query(
    'SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
    [dbName]
  );
  if (dbRows.length === 0) return { exists: false, userCount: 0 };

  const [tableRows] = await connection.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
    [dbName]
  );
  if (tableRows.length === 0) return { exists: true, userCount: 0 };

  const [countRows] = await connection.query(
    `SELECT COUNT(*) AS total FROM \`${dbName}\`.users`
  );
  return { exists: true, userCount: countRows[0].total };
}

async function initializeDatabase() {
  console.log('\n🚀 Starting Suprema MySQL Database Initialization...\n');
  let connection;

  try {
    // 1. Connect without selecting a DB first
    connection = await mysql.createConnection(dbConfig);
    console.log(`🔌 Connected to MySQL server at ${dbConfig.host}:${dbConfig.port}`);

    // 1b. Refuse to silently destroy an existing, populated database
    const existing = await inspectExisting(connection);
    if (existing.exists && existing.userCount > 0 && !force) {
      console.error('\n╔══════════════════════════════════════════════════════════════╗');
      console.error('║  STOPPED: this would DESTROY your existing data.              ║');
      console.error('╚══════════════════════════════════════════════════════════════╝');
      console.error(`\n   Database '${dbName}' already exists and contains ${existing.userCount} user(s).`);
      console.error('   Dropping it would permanently delete every registered account.\n');
      console.error('   To just start the app you do NOT need this - use:');
      console.error('       npm run dev\n');
      console.error('   Only run this again if you deliberately want a clean slate:');
      console.error('       npm run db:init -- --force\n');
      await connection.end();
      process.exit(1);
    }

    if (existing.exists && force) {
      console.warn(`\n⚠️  --force supplied: destroying '${dbName}' (${existing.userCount} user(s) will be lost).`);
    }

    // 2. Drop and Create Database
    console.log(`📦 Recreating database '${dbName}'...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    await connection.query(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`✅ Database '${dbName}' is ready.`);

    // 3. Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('⚙️ Executing Database Schema (schema.sql)...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ All 12 tables & indexes created successfully.');
    } else {
      console.warn('⚠️ schema.sql file not found at:', schemaPath);
    }

    // 4. Read and execute seed.sql
    const seedPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Executing Seed Data (seed.sql)...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('✅ Seed data inserted successfully (Users, Workspaces, Teams, Projects, Tasks).');
    } else {
      console.warn('⚠️ seed.sql file not found at:', seedPath);
    }

    console.log('\n🎉 MySQL Database Initialization Completed Successfully!\n');

  } catch (error) {
    console.error('\n❌ Database Initialization Failed!');
    console.error('Error Message:', error.message || error);
    console.error('Error Code:', error.code || 'N/A');
    console.error('\n💡 Troubleshooting Tips:');
    console.error(' 1. Ensure MySQL service (XAMPP / WAMP / MySQL Server) is RUNNING.');
    console.error(` 2. Verify credentials in server/.env (User: "${dbConfig.user}", Host: "${dbConfig.host}:${dbConfig.port}")`);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
