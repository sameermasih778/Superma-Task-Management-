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
  },
  {
    // Marketing tables (Milestone 6) - the public Contact / Waitlist /
    // Changelog / Pricing endpoints.
    //
    // These tables were created directly during development, so the only thing
    // a migration can still add is the INTEGRITY GUARANTEE the app relies on:
    // one row per waitlist email. Without a UNIQUE index, two concurrent
    // requests for the same address could both pass the "already registered?"
    // check and insert duplicates, which would hand two people the same queue
    // position. Adding the index is skipped (with a warning) if duplicates
    // already exist, because fixing data is a manual decision.
    name: '006-marketing-tables',
    async up(pool) {
      const detail = [];
      let touched = false;

      const TABLES = [
        `CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            subject VARCHAR(200) DEFAULT 'Website Inquiry',
            message TEXT NOT NULL,
            status ENUM('unread','read','replied') NOT NULL DEFAULT 'unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_contact_status (status),
            INDEX idx_contact_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

        `CREATE TABLE IF NOT EXISTS waitlist_leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(150) NOT NULL,
            queue_position INT DEFAULT NULL,
            referral_code VARCHAR(50) DEFAULT NULL,
            status ENUM('pending','invited','active') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_waitlist_position (queue_position)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

        `CREATE TABLE IF NOT EXISTS changelogs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tag_id VARCHAR(100) NOT NULL,
            date VARCHAR(50) NOT NULL,
            badge VARCHAR(50) DEFAULT 'New',
            badge_color VARCHAR(50) DEFAULT 'text-emerald-400',
            title VARCHAR(255) NOT NULL,
            description TEXT,
            sub_item_title VARCHAR(255) DEFAULT NULL,
            sub_item_description TEXT,
            tag VARCHAR(100) DEFAULT NULL,
            banner_title VARCHAR(255) DEFAULT NULL,
            bullets JSON DEFAULT NULL,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_changelog_badge (badge)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

        `CREATE TABLE IF NOT EXISTS pricing_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            plan_id VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            price_monthly VARCHAR(50) DEFAULT NULL,
            price_yearly VARCHAR(50) DEFAULT NULL,
            period VARCHAR(50) DEFAULT 'per user / month',
            subtext VARCHAR(100) DEFAULT NULL,
            popular TINYINT(1) DEFAULT 0,
            popular_badge VARCHAR(50) DEFAULT NULL,
            has_toggle TINYINT(1) DEFAULT 1,
            btn_variant VARCHAR(50) DEFAULT 'dark',
            btn_text VARCHAR(50) DEFAULT 'Get Started',
            features JSON DEFAULT NULL,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_plan_sort (sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
      ];

      for (const ddl of TABLES) {
        await pool.query(ddl);
      }

      // Unique email on the waitlist, but only when the data allows it.
      const [dupes] = await pool.query(
        'SELECT email, COUNT(*) n FROM waitlist_leads GROUP BY email HAVING n > 1'
      );
      if (dupes.length > 0) {
        return {
          status: 'skipped',
          detail:
            `waitlist_leads contains ${dupes.length} duplicate email(s), so the UNIQUE ` +
            'index was not added. De-duplicate the table and re-run to enforce it.'
        };
      }

      const [indexes] = await pool.query(
        "SELECT COUNT(*) AS c FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'waitlist_leads' AND index_name = 'uq_waitlist_email'"
      );
      if (indexes[0].c === 0) {
        await pool.query('ALTER TABLE waitlist_leads ADD UNIQUE KEY uq_waitlist_email (email)');
        detail.push('added UNIQUE index on waitlist_leads.email');
        touched = true;
      }

      if (!touched) {
        return { status: 'current', detail: 'marketing tables present, waitlist email already unique' };
      }
      return { status: 'applied', detail: detail.join('; ') };
    }
  },
  {
    // changelogs.release_date - a REAL date column for ordering.
    //
    // The table stores `date` as a display string ('Oct 12, 2024'). Sorting
    // lexicographically puts 'Sep 15, 2024' after 'Oct 12, 2024', so the
    // changelog rendered oldest-first. Adding a proper DATE column and
    // backfilling it from that string fixes the ordering without changing what
    // the page displays.
    name: '007-changelog-release-date',
    async up(pool) {
      const detail = [];
      let touched = false;

      const [cols] = await pool.query(
        "SELECT COUNT(*) AS c FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'changelogs' AND column_name = 'release_date'"
      );

      if (cols[0].c === 0) {
        await pool.query('ALTER TABLE changelogs ADD COLUMN release_date DATE DEFAULT NULL AFTER tag_id');
        // %b = abbreviated month name, %d = day, %Y = 4-digit year.
        const [backfill] = await pool.query(
          `UPDATE changelogs
           SET release_date = STR_TO_DATE(date, '%b %d, %Y')
           WHERE release_date IS NULL`
        );
        const [indexes] = await pool.query(
          "SELECT COUNT(*) AS c FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'changelogs' AND index_name = 'idx_changelog_release_date'"
        );
        if (indexes[0].c === 0) {
          await pool.query('ALTER TABLE changelogs ADD INDEX idx_changelog_release_date (release_date)');
        }
        detail.push(`added changelogs.release_date, backfilled ${backfill.affectedRows} row(s)`);
        touched = true;
      }

      // Keep parity with schema.sql: one changelog row per tag.
      const [dupes] = await pool.query(
        'SELECT tag_id, COUNT(*) n FROM changelogs GROUP BY tag_id HAVING n > 1'
      );
      if (dupes.length === 0) {
        const [existing] = await pool.query(
          "SELECT COUNT(*) AS c FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'changelogs' AND index_name = 'uq_changelog_tag'"
        );
        if (existing[0].c === 0) {
          await pool.query('ALTER TABLE changelogs ADD UNIQUE KEY uq_changelog_tag (tag_id)');
          detail.push('added UNIQUE index on changelogs.tag_id');
          touched = true;
        }
      }

      if (!touched) {
        return { status: 'current', detail: 'changelog release_date + unique tag already present' };
      }
      return { status: 'applied', detail: detail.join('; ') };
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