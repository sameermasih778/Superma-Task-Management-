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
    // teams.created_by - who created each team.
    //
    // Without it there is no ownership record, so every authenticated user
    // could add/remove/delete members on ANY team. This column lets a member
    // manage only the teams they created, while staff can still manage any.
    //
    // Existing teams are backfilled from their first team member: createTeam
    // auto-inserts the creator as a leader immediately, so the earliest
    // (joined_at, id) is the creator. Teams with no members keep NULL, which
    // safely means "only staff can manage".
    name: '005-teams-created-by',
    async up(pool) {
      const detailParts = [];
      let touched = false;

      const [cols] = await pool.query("SHOW COLUMNS FROM teams LIKE 'created_by'");
      if (cols.length === 0) {
        await pool.query(
          'ALTER TABLE teams ADD COLUMN created_by INT DEFAULT NULL AFTER description'
        );
        detailParts.push('added teams.created_by column');
        touched = true;
      }

      const [idx] = await pool.query(
        "SHOW INDEX FROM teams WHERE Key_name = 'idx_teams_created_by'"
      );
      if (idx.length === 0) {
        await pool.query('CREATE INDEX idx_teams_created_by ON teams (created_by)');
        detailParts.push('added index idx_teams_created_by');
        touched = true;
      }

      const [backfill] = await pool.query(
        `UPDATE teams t
         SET t.created_by = (
           SELECT tm.user_id FROM team_members tm
           WHERE tm.team_id = t.id
           ORDER BY tm.joined_at ASC, tm.id ASC
           LIMIT 1
         )
         WHERE t.created_by IS NULL
           AND EXISTS (SELECT 1 FROM team_members tm2 WHERE tm2.team_id = t.id)`
      );
      if (backfill.affectedRows > 0) {
        detailParts.push(`backfilled creator on ${backfill.affectedRows} team(s)`);
        touched = true;
      }

      if (!touched) {
        return { status: 'current', detail: 'teams.created_by already present' };
      }
      return { status: 'applied', detail: detailParts.join('; ') };
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