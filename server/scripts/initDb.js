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

async function initializeDatabase() {
  console.log('\n🚀 Starting Suprema MySQL Database Initialization...\n');
  let connection;

  try {
    // 1. Connect without selecting a DB first
    connection = await mysql.createConnection(dbConfig);
    console.log(`🔌 Connected to MySQL server at ${dbConfig.host}:${dbConfig.port}`);

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
