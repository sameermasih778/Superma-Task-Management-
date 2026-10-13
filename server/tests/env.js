/**
 * Runs in every Jest worker before the first test file is loaded.
 *
 * config/db.js builds its pool from process.env at require time, so this file
 * has to set the environment before a test file is allowed to import anything.
 */
const { applyTestEnv, assertTestEnv } = require('./testEnv');

applyTestEnv();
assertTestEnv();
