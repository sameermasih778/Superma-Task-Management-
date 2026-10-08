/**
 * Additive, idempotent schema migrations.
 *
 * schema.sql is the source of truth for a FRESH database (`npm run db:init`
 * drops and recreates everything, so it always picks up the current schema).
 * But databases that were created BEFORE a schema.sql change keep the old
 * definition, and there is no automatic way to notice that.
 *
 * Each migration here must be:
 *   - IDEMPOTENT  : safe to run on every boot, no-ops when already applied
 *   - NON-DESTRUCTIVE : never drops or rewrites VALID data. It may repair data
 *                      that is already corrupt, but never intentionally valid rows.
 *
 * A migration that cannot be applied safely must not be destructive - fail
 * loudly with a manual fix instead.
 */

const migrations = [
  {
    // users.role must include 'developer'.
    // Without this, UPDATE users SET role = 'developer' fails with
    // "Data truncated for column 'role'", which breaks both the admin panel's
    // role dropdown and anyone logging into the developer portal.
    name: '001-users-role-enum-includes-developer',
    async up(pool) {
      const [rows] = await pool.query("SHOW COLUMNS FROM users LIKE 'role'");
      if (rows.length === 0) {
        return { status: 'skipped', detail: 'users.role column not found - run `npm run db:init`' };
      }

      const current = rows[0].Type;
      if (current.includes("'developer'")) {
        return { status: 'current', detail: current };
      }

      await pool.query(
        "ALTER TABLE users MODIFY role ENUM('super_admin','admin','developer','member','viewer') NOT NULL DEFAULT 'member'"
      );

      return { status: 'applied', detail: `${current} -> enum('super_admin','admin','developer','member','viewer')` };
    }
  },

  {
    // Repair users whose role was silently blanked.
    //
    // This MySQL server runs WITHOUT STRICT_TRANS_TABLES, so before migration
    // 001 existed, `UPDATE users SET role = 'developer'` did not raise an
    // error - it coerced the unknown value to '' and wrote it. Such a row is
    // invalid in every code path: authorizeRoles denies it, the sidebar treats
    // it as a non-staff user, and RoleBadge falls back to "Viewer".
    //
    // Resetting to the schema default ('member') is the safe repair - an empty
    // role is never an intentional state.
    name: '002-repair-blank-user-roles',
    async up(pool) {
      const [rows] = await pool.query(
        "SELECT id, email FROM users WHERE role IS NULL OR role = ''"
      );

      if (rows.length === 0) {
        return { status: 'current', detail: 'no blank roles found' };
      }

      const [result] = await pool.query(
        "UPDATE users SET role = 'member' WHERE role IS NULL OR role = ''"
      );

      return {
        status: 'applied',
        detail: `reset ${result.affectedRows} blank role(s) to 'member': ${rows.map((r) => r.email).join(', ')}`
      };
    }
  },

  {
    // notifications.type needs an 'announcement' value.
    //
    // The admin broadcast endpoint sends type='announcement', but the ENUM only
    // had info/task_assigned/mention/system. Because this server runs without
    // STRICT_TRANS_TABLES, MySQL silently coerced the unknown value to ''
    // instead of raising an error - so every broadcast was stored with a blank
    // type and the header dropdown could not style announcements.
    name: '003-notifications-type-enum-includes-announcement',
    async up(pool) {
      const [rows] = await pool.query("SHOW COLUMNS FROM notifications LIKE 'type'");
      if (rows.length === 0) {
        return { status: 'skipped', detail: 'notifications.type column not found - run `npm run db:init`' };
      }

      const current = rows[0].Type;
      if (current.includes("'announcement'")) {
        return { status: 'current', detail: current };
      }

      await pool.query(
        "ALTER TABLE notifications MODIFY type ENUM('info','task_assigned','mention','system','announcement') NOT NULL DEFAULT 'info'"
      );

      return { status: 'applied', detail: `${current} -> + 'announcement'` };
    }
  },

  {
    // Repair notifications whose type was silently blanked to '' by migration
    // 003's root cause. These rows were created by the admin broadcast
    // endpoint, so 'announcement' is the accurate value to restore.
    name: '004-repair-blank-notification-types',
    async up(pool) {
      const [rows] = await pool.query(
        "SELECT id FROM notifications WHERE type IS NULL OR type = ''"
      );

      if (rows.length === 0) {
        return { status: 'current', detail: 'no blank notification types found' };
      }

      const [result] = await pool.query(
        "UPDATE notifications SET type = 'announcement' WHERE type IS NULL OR type = ''"
      );

      return {
        status: 'applied',
        detail: `restored ${result.affectedRows} blank notification type(s) to 'announcement'`
      };
    }
  }
];

/**
 * Run every pending migration against the given pool.
 * Never throws - a failed migration is logged and the server still boots.
 */
async function runMigrations(pool) {
  for (const migration of migrations) {
    try {
      const result = await migration.up(pool);

      if (result.status === 'applied') {
        console.log(`🛠️  Migration applied: ${migration.name}`);
        console.log(`   ${result.detail}`);
      } else if (result.status === 'skipped') {
        console.warn(`⚠️  Migration skipped: ${migration.name} - ${result.detail}`);
      }
    } catch (error) {
      console.error(`❌ Migration failed: ${migration.name}`);
      console.error(`   ${error.message}`);
      console.error('   Server will keep running, but this feature may misbehave.');
    }
  }
}

module.exports = { runMigrations, migrations };