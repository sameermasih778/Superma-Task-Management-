/**
 * Rebuilds the test database from scratch before every run.
 *
 * Runs once in Jest's main process. The contract is:
 *
 *   - DROP only ever targets the literal string 'suprema_test'
 *   - production (.env's DB_NAME) is checked against it and refused if equal
 *   - SMTP is confirmed dead, so no test can send a real email
 *
 * Nothing here reads a database name from the environment to decide what to
 * drop; a variable that could be repointed at production is exactly how test
 * suites eat real data.
 *
 * This file deliberately manages its own pool rather than requiring
 * config/db.js. That module fires migrations asynchronously on require, which
 * would race the migration run below and could interleave two ALTER TABLEs on
 * the same column. Workers still load config/db.js afterwards, but by then
 * every migration is already applied and their re-run is a no-op.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const { TEST_DB, applyTestEnv, assertTestEnv, readConfiguredDbName } = require('./testEnv');

// Must happen before this file reads .env.
applyTestEnv();
assertTestEnv();

dotenv.config({ path: path.join(__dirname, '../.env') });

// Hardcoded on purpose - never process.env.DB_NAME.
const TARGET_DB = TEST_DB;

const useSsl = /^(1|true|yes)$/i.test(String(process.env.DB_SSL || ''));

const fixtures = {
  users: {},
  workspaceId: null,
  projectId: null,
  taskId: null,
  attachmentId: null
};

async function createConnection(extra = {}) {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    multipleStatements: true,
    ...extra
  });
}

async function dropAndCreate(conn) {
  await conn.query(`DROP DATABASE IF EXISTS \`${TARGET_DB}\``);
  await conn.query(
    `CREATE DATABASE \`${TARGET_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.query(`USE \`${TARGET_DB}\``);

  const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
  await conn.query(schema);
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  const [[where]] = await conn.query('SELECT DATABASE() AS db');
  if (where.db !== TARGET_DB) {
    throw new Error(`Test database resolved to '${where.db}', expected '${TARGET_DB}'.`);
  }
}

/**
 * Minimal world the suites rely on: five users across every role that matters,
 * one workspace with real membership rows, a project, a task, and an
 * attachment. Authorization tests need those membership rows to be genuine -
 * mocking them would test the mock rather than the query.
 */
async function seed(conn) {
  // Cost 4 rather than 10: this rebuilds before every run, and the strength of
  // a throwaway hash is not what any of these tests assert.
  const hash = await bcrypt.hash('TestPass123!', 4);

  const users = [
    { key: 'superAdmin', name: 'Super Admin', email: 'superadmin@suprema.test', role: 'super_admin' },
    { key: 'admin', name: 'Admin User', email: 'admin@suprema.test', role: 'admin' },
    { key: 'developer', name: 'Dev User', email: 'dev@suprema.test', role: 'developer' },
    { key: 'member', name: 'Regular Member', email: 'member@suprema.test', role: 'member' },
    { key: 'uploader', name: 'File Uploader', email: 'uploader@suprema.test', role: 'member' }
  ];

  for (const u of users) {
    const [result] = await conn.query(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      [u.name, u.email, hash, u.role, 'active']
    );
    fixtures.users[u.key] = { id: result.insertId, ...u };
  }

  const owner = fixtures.users.superAdmin;

  const [ws] = await conn.query(
    'INSERT INTO workspaces (name, slug, owner_id, plan) VALUES (?, ?, ?, ?)',
    ['Test Workspace', `test-ws-${Date.now().toString(36)}`, owner.id, 'free']
  );
  fixtures.workspaceId = ws.insertId;

  const memberships = [
    [fixtures.workspaceId, owner.id, 'owner'],
    [fixtures.workspaceId, fixtures.users.admin.id, 'admin'],
    [fixtures.workspaceId, fixtures.users.member.id, 'member'],
    [fixtures.workspaceId, fixtures.users.uploader.id, 'member']
  ];
  for (const m of memberships) {
    await conn.query(
      'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES (?, ?, ?)',
      m
    );
  }

  const [project] = await conn.query(
    'INSERT INTO projects (workspace_id, name, created_by) VALUES (?, ?, ?)',
    [fixtures.workspaceId, 'Test Project', owner.id]
  );
  fixtures.projectId = project.insertId;

  const [task] = await conn.query(
    'INSERT INTO tasks (project_id, title, created_by) VALUES (?, ?, ?)',
    [fixtures.projectId, 'Test Task', owner.id]
  );
  fixtures.taskId = task.insertId;

  const [attachment] = await conn.query(
    `INSERT INTO task_attachments
       (task_id, user_id, filename, original_name, file_path, file_size, mime_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      fixtures.taskId,
      fixtures.users.uploader.id,
      'probe.png',
      'probe.png',
      'https://example.invalid/probe.png',
      1024,
      'image/png'
    ]
  );
  fixtures.attachmentId = attachment.insertId;
}

module.exports = async () => {
  const configured = readConfiguredDbName();

  if (configured === TARGET_DB) {
    throw new Error('Refusing to run: .env DB_NAME equals the test database name.');
  }

  console.log(`\n🧪 Rebuilding test database '${TARGET_DB}' (production is '${configured || 'unset'}')`);

  const conn = await createConnection();
  await dropAndCreate(conn);
  console.log('   schema loaded');

  const { runMigrations } = require('../database/migrate');
  await runMigrations(conn);

  await seed(conn);
  console.log(
    `   seeded ${Object.keys(fixtures.users).length} users, 1 workspace/project/task/attachment\n`
  );

  await conn.end();
};
