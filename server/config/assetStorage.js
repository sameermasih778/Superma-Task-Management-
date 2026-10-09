/**
 * Asset storage for avatars and task attachments - cloud-aware.
 *
 * Two modes, decided by credentials in the environment:
 *
 *   1. CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) present
 *      -> files are uploaded to Cloudinary and the DB stores the absolute
 *         https://res.cloudinary.com/... URL. This is what production
 *         (Vercel) must use: the serverless filesystem is read-only, so
 *         writing uploads to disk there fails.
 *
 *   2. no credentials (local development default)
 *      -> files are written to server/uploads exactly like before and the DB
 *         stores the root-relative /uploads/... path. Nothing changes for
 *         day-to-day dev work.
 *
 * Callers never branch on the mode themselves: saveAvatar()/saveAttachment()
 * return { url, publicId } and removeStoredAsset() accepts either style of URL.
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { v2: cloudinary } = require('cloudinary');

dotenv.config({ path: path.join(__dirname, '../.env') });

const UPLOAD_ROOT = path.join(__dirname, '../uploads');
const AVATAR_DIR = path.join(UPLOAD_ROOT, 'avatars');

/** Mimes whose bytes Cloudinary stores as an image resource (PDF included). */
const IMAGE_RESOURCE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf'
]);

function parseCloudinaryCredentials(url) {
  // cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  try {
    const parsed = new URL(url);
    return {
      cloud_name: parsed.hostname,
      api_key: decodeURIComponent(parsed.username),
      api_secret: decodeURIComponent(parsed.password)
    };
  } catch {
    return null;
  }
}

const explicitCreds =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const urlCreds = process.env.CLOUDINARY_URL
  ? parseCloudinaryCredentials(process.env.CLOUDINARY_URL)
  : null;

const credentials = explicitCreds
  ? {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    }
  : urlCreds;

if (credentials && credentials.cloud_name) {
  cloudinary.config(credentials);
}

/** True when files will go to Cloudinary instead of the local disk. */
function usingCloudStorage() {
  return !!(credentials && credentials.cloud_name);
}

/** Best-effort: uploads dirs must exist in local mode. Never throws. */
function ensureUploadDirs() {
  for (const dir of [UPLOAD_ROOT, AVATAR_DIR]) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      // Read-only filesystem (serverless): only matters in local mode, where
      // the write below will surface a clearer error anyway.
      console.warn('[Storage] Could not ensure upload dir:', err.message);
    }
  }
}

function randomSuffix() {
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

/** Upload a buffer to Cloudinary; resolves with the API result. */
function uploadBuffer(buffer, { folder, publicId, resourceType }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

/**
 * Store a profile-picture buffer.
 * @param {Buffer} buffer raw file bytes (already signature-checked by caller)
 * @param {string} ext lower-case extension including the dot ('.png')
 * @param {number} userId owning user id, used in the file name
 * @returns {Promise<{url: string, publicId: string}>}
 */
async function saveAvatar(buffer, ext, userId) {
  ensureUploadDirs();
  const base = `user-${userId}-${randomSuffix()}`;

  if (usingCloudStorage()) {
    const result = await uploadBuffer(buffer, {
      folder: 'suprema/avatars',
      publicId: base,
      resourceType: 'image'
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  const filename = `${base}${ext}`;
  try {
    fs.writeFileSync(path.join(AVATAR_DIR, filename), buffer);
  } catch (err) {
    throw new Error(
      `Local avatar storage failed (${err.message}). ` +
      'Set CLOUDINARY_URL to use cloud storage - the local filesystem is ' +
      'read-only on serverless hosts like Vercel.'
    );
  }
  return { url: `/uploads/avatars/${filename}`, publicId: filename };
}

/**
 * Store a task-attachment buffer.
 * Documents that are not images/PDF go to Cloudinary as a 'raw' resource so
 * they download byte-for-byte with their original extension.
 *
 * @param {Buffer} buffer raw file bytes
 * @param {{ext: string, mime: string}} meta
 * @returns {Promise<{url: string, publicId: string}>}
 */
async function saveAttachment(buffer, { ext, mime }) {
  ensureUploadDirs();
  const base = `file-${randomSuffix()}`;

  if (usingCloudStorage()) {
    const asImage = IMAGE_RESOURCE_MIMES.has((mime || '').toLowerCase());
    const result = await uploadBuffer(buffer, {
      folder: 'suprema/attachments',
      // raw resources keep their extension in the public id so downloads
      // still end in .docx/.zip/etc; image resources never carry one.
      publicId: asImage ? base : base + ext,
      resourceType: asImage ? 'image' : 'raw'
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  const filename = `${base}${ext}`;
  try {
    fs.writeFileSync(path.join(UPLOAD_ROOT, filename), buffer);
  } catch (err) {
    throw new Error(
      `Local attachment storage failed (${err.message}). ` +
      'Set CLOUDINARY_URL to use cloud storage - the local filesystem is ' +
      'read-only on serverless hosts like Vercel.'
    );
  }
  return { url: `/uploads/${filename}`, publicId: filename };
}

/**
 * Extract { resourceType, publicId } from one of OUR Cloudinary URLs:
 *   https://res.cloudinary.com/<cloud>/<type>/upload/v123/<public_id>.<ext>
 * Returns null for anything else (legacy local paths, dicebear, ...).
 */
function parseCloudinaryUrl(url) {
  if (typeof url !== 'string' || !/^https?:\/\/res\.cloudinary\.com\//i.test(url)) {
    return null;
  }
  const match = url.match(/\/([^/?]+)\/upload\/(?:v\d+\/)?([^?]+)$/);
  if (!match) return null;

  const resourceType = match[1];
  let publicId = match[2];
  // Image/video URLs may carry a delivery extension (.png) that is not part
  // of the public id; raw resources were uploaded WITH their extension.
  if (resourceType !== 'raw') {
    publicId = publicId.replace(/\.[^./]+$/, '');
  }
  return { resourceType, publicId };
}

/**
 * Best-effort removal of a previously stored asset. Never throws.
 * Accepts an absolute Cloudinary URL or a legacy /uploads/... path.
 */
async function removeStoredAsset(urlOrPath) {
  if (!urlOrPath) return;

  const cloud = parseCloudinaryUrl(urlOrPath);
  if (cloud) {
    try {
      await cloudinary.uploader.destroy(cloud.publicId, {
        resource_type: cloud.resourceType
      });
    } catch (err) {
      console.warn('[Storage] Could not remove Cloudinary asset:', err.message);
    }
    return;
  }

  if (urlOrPath.startsWith('/uploads/')) {
    const relative = urlOrPath.replace(/^\/uploads\//, '');
    const target = path.resolve(UPLOAD_ROOT, relative);
    // Traversal guard: never touch anything outside server/uploads.
    if (target !== UPLOAD_ROOT && !target.startsWith(UPLOAD_ROOT + path.sep)) return;
    try {
      if (fs.existsSync(target)) fs.unlinkSync(target);
    } catch (err) {
      console.warn('[Storage] Could not remove local asset:', err.message);
    }
  }
}

module.exports = {
  saveAvatar,
  saveAttachment,
  removeStoredAsset,
  parseCloudinaryUrl,
  usingCloudStorage,
  UPLOAD_ROOT,
  AVATAR_DIR
};
