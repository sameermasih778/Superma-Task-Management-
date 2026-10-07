/**
 * Manual migration runner:  npm run db:migrate
 *
 * The same migrations also run automatically when the server boots, so this is
 * only needed if you want to apply them without starting the API (or to
 * confirm the current schema state from a terminal).
 *
 * This builds its own connection on purpose: importing config/db.js would
 * trigger its own startup migration run, so two runners would race and the
 * output would be duplicated/interleaved.
 */
const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');
const { runMigrations } = require('../database/migrate');

dotenv.config({ path: path.join(__dirname, '../.env') });

(async () => {
  console.log('\n🔧 Running Suprema schema migrations...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'suprema_db'
  });

  console.log(`📌 Connected to Database: '${process.env.DB_NAME}' on ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);

  await runMigrations(connection);

  console.log('\n✅ Migration run complete.\n');
  await connection.end();
  process.exit(0);
})().catch((error) => {
  console.error('❌ Migration runner crashed:', error.message);
  process.exit(1);
});