const pool = require('../config/db');

/**
 * Changelog manager — staff CRUD over the table the public changelog reads.
 *
 * The public read endpoint already exists and orders by release_date DESC, which
 * is why release_date is required here rather than optional: an entry with no
 * release date sorts to the bottom, which is exactly the "oldest entry shown
 * first" bug migration 007 fixed for existing rows.
 */

const BADGE_COLORS = [
  'text-emerald-400',
  'text-blue-400',
  'text-amber-400',
  'text-purple-400',
  'text-rose-400',
  'text-zinc-400'
];

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Accept either a JSON array, an array, or one bullet per line.
 * Editors type one bullet per line; storing JSON keeps the column shape the
 * public endpoint already expects.
 */
const normaliseBullets = (input) => {
  if (Array.isArray(input)) {
    return JSON.stringify(input.map((b) => String(b).trim()).filter(Boolean));
  }
  if (typeof input === 'string' && input.trim()) {
    const trimmed = input.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return JSON.stringify(parsed.map((b) => String(b).trim()).filter(Boolean));
        }
      } catch {
        // Not valid JSON - fall through and treat it as one bullet per line.
      }
    }
    return JSON.stringify(trimmed.split('\n').map((b) => b.trim()).filter(Boolean));
  }
  return null;
};

/**
 * GET /api/v1/admin/changelogs
 */
const getAdminChangelogs = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, tag_id, date, release_date, badge, badge_color, title, description,
              sub_item_title, sub_item_description, tag, banner_title, bullets, note, created_at
         FROM changelogs
        ORDER BY release_date DESC, id DESC`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      changelogs: rows.map((r) => ({
        ...r,
        bullets: parseJsonArray(r.bullets)
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Shared validation for create and update.
 * Returns an error message, or null when the payload is usable.
 */
const validate = (body) => {
  const tagId = String(body.tagId || body.tag_id || '').trim();
  const title = String(body.title || '').trim();
  const releaseDate = String(body.releaseDate || body.release_date || '').trim();

  if (!tagId) return 'A version tag is required (for example v1.4.0).';
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(tagId)) {
    return 'The version tag may only contain letters, numbers, dots, dashes and underscores.';
  }
  if (!title) return 'A title is required.';
  if (!releaseDate) return 'A release date is required so the entry sorts correctly.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return 'The release date must be in YYYY-MM-DD format.';
  }
  if (new Date(releaseDate).toString() === 'Invalid Date') {
    return 'That release date is not a real date.';
  }

  const badgeColor = String(body.badgeColor || body.badge_color || 'text-emerald-400').trim();
  if (!BADGE_COLORS.includes(badgeColor)) {
    return `Badge colour must be one of: ${BADGE_COLORS.join(', ')}`;
  }

  return null;
};

/**
 * POST /api/v1/admin/changelogs
 */
const createChangelog = async (req, res, next) => {
  try {
    const body = req.body || {};

    const invalid = validate(body);
    if (invalid) {
      return res.status(400).json({ success: false, message: invalid });
    }

    const tagId = String(body.tagId || body.tag_id).trim();

    // tag_id is UNIQUE, so check first to return a clear message instead of a
    // raw ER_DUP_ENTRY bubbling through as a 500.
    const [existing] = await pool.query('SELECT id FROM changelogs WHERE tag_id = ?', [tagId]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Version ${tagId} is already in the changelog. Edit that entry instead.`
      });
    }

    const releaseDate = String(body.releaseDate || body.release_date).trim();

    // `date` is the human-readable label shown on the card; default it to the
    // release date formatted, so an editor only fills it in to override.
    const label = String(body.date || '').trim() ||
      new Date(releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    await pool.query(
      `INSERT INTO changelogs
         (tag_id, date, release_date, badge, badge_color, title, description,
          sub_item_title, sub_item_description, tag, banner_title, bullets, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tagId,
        label,
        releaseDate,
        String(body.badge || 'New').trim() || 'New',
        String(body.badgeColor || body.badge_color || 'text-emerald-400').trim(),
        String(body.title).trim(),
        body.description ? String(body.description).trim() : null,
        body.subItemTitle ? String(body.subItemTitle).trim() : null,
        body.subItemDescription ? String(body.subItemDescription).trim() : null,
        body.tag ? String(body.tag).trim() : null,
        body.bannerTitle ? String(body.bannerTitle).trim() : null,
        normaliseBullets(body.bullets),
        body.note ? String(body.note).trim() : null
      ]
    );

    res.status(201).json({
      success: true,
      message: `${tagId} added to the changelog.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/admin/changelogs/:tagId
 */
const updateChangelog = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    const body = req.body || {};

    const invalid = validate({ ...body, tagId });
    if (invalid) {
      return res.status(400).json({ success: false, message: invalid });
    }

    const [existing] = await pool.query('SELECT id FROM changelogs WHERE tag_id = ?', [tagId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No changelog entry found for ${tagId}.`
      });
    }

    const releaseDate = String(body.releaseDate || body.release_date).trim();
    const label = String(body.date || '').trim() ||
      new Date(releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    await pool.query(
      `UPDATE changelogs SET
         date = ?, release_date = ?, badge = ?, badge_color = ?, title = ?, description = ?,
         sub_item_title = ?, sub_item_description = ?, tag = ?, banner_title = ?,
         bullets = ?, note = ?
       WHERE tag_id = ?`,
      [
        label,
        releaseDate,
        String(body.badge || 'New').trim() || 'New',
        String(body.badgeColor || body.badge_color || 'text-emerald-400').trim(),
        String(body.title).trim(),
        body.description ? String(body.description).trim() : null,
        body.subItemTitle ? String(body.subItemTitle).trim() : null,
        body.subItemDescription ? String(body.subItemDescription).trim() : null,
        body.tag ? String(body.tag).trim() : null,
        body.bannerTitle ? String(body.bannerTitle).trim() : null,
        normaliseBullets(body.bullets),
        body.note ? String(body.note).trim() : null,
        tagId
      ]
    );

    res.status(200).json({
      success: true,
      message: `${tagId} updated.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/admin/changelogs/:tagId
 */
const deleteChangelog = async (req, res, next) => {
  try {
    const { tagId } = req.params;

    const [result] = await pool.query('DELETE FROM changelogs WHERE tag_id = ?', [tagId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `No changelog entry found for ${tagId}.`
      });
    }

    res.status(200).json({
      success: true,
      message: `${tagId} removed from the changelog.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminChangelogs,
  createChangelog,
  updateChangelog,
  deleteChangelog,
  BADGE_COLORS
};