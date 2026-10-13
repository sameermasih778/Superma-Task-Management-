/**
 * Test environment contract.
 *
 * Shared by Jest's globalSetup (main process) and setupFiles (each worker),
 * which do NOT share process.env - so both must call applyTestEnv().
 *
 * The order of operations here is load-bearing:
 *
 *   1. Apply the overrides FIRST.
 *   2. Only then does anything call dotenv.config().
 *
 * dotenv does not overwrite keys that already exist, so every value set below
 * survives the .env load. That is why SMTP_USER is set to an empty string
 * rather than deleted - deleting the key would let dotenv put the real
 * credentials straight back, and the suite would send actual emails to actual
 * people.
 */

const fs = require('fs');
const path = require('path');

const TEST_DB = 'suprema_test';

/**
 * The production database name, read straight from the .env file rather than
 * from process.env - because process.env.DB_NAME has already been overwritten
 * by the time we can ask. Used only for the guard below.
 */
const readConfiguredDbName = () => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    const match = raw.match(/^\s*DB_NAME\s*=\s*(.*)$/m);
    if (!match) return null;
    return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch {
    return null;
  }
};

const applyTestEnv = () => {
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = TEST_DB;
  process.env.DB_CONNECTION_LIMIT = '5';

  // Empty string, not delete - see the note at the top of this file.
  // sendPasswordResetEmail falls back to returning the link when these are
  // blank, which is how tests read the token without dialling Gmail.
  process.env.SMTP_USER = '';
  process.env.SMTP_PASS = '';

  // Pinned so reset-link assertions do not depend on developer machine config.
  process.env.FRONTEND_URL = 'http://localhost:5173';

  return TEST_DB;
};

/**
 * Refuses to run anywhere but the test database.
 *
 * This is the guard that makes it structurally impossible for `npm test` to
 * write into production. It runs before any application module is required,
 * so there is no window in which the pool could be built against the wrong DB.
 */
const assertTestEnv = () => {
  const configured = readConfiguredDbName();

  if (process.env.DB_NAME !== TEST_DB) {
    throw new Error(
      `Refusing to run tests: DB_NAME is '${process.env.DB_NAME}', expected '${TEST_DB}'.`
    );
  }

  if (configured && configured === TEST_DB) {
    throw new Error(
      `Refusing to run tests: your .env points DB_NAME at '${TEST_DB}', so the ` +
      '"test" and real databases would be the same database.'
    );
  }

  if (process.env.SMTP_USER || process.env.SMTP_PASS) {
    throw new Error(
      'Refusing to run tests: SMTP credentials are configured, so tests would send real email.'
    );
  }
};

module.exports = { TEST_DB, applyTestEnv, assertTestEnv, readConfiguredDbName };
