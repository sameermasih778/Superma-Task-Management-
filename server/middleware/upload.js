const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_ROOT = path.join(__dirname, '../uploads');
const AVATAR_DIR = path.join(UPLOAD_ROOT, 'avatars');

// Best-effort: the dirs are only needed in local-storage mode. On a
// read-only serverless filesystem (Vercel) creating them must not crash.
for (const dir of [UPLOAD_ROOT, AVATAR_DIR]) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* read-only filesystem - cloud mode does not need the dirs */
  }
}

/**
 * The extension allow-list is derived from BOTH the declared MIME type and the
 * file extension, and both must be acceptable.
 *
 * Relying on `file.mimetype` alone is not safe: it is supplied by the client
 * and can be forged, so an executable or an HTML file can be posted as
 * "image/png". Pairing it with the extension closes that gap, and nothing is
 * ever written to disk until both checks pass.
 */
const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const DOCUMENT_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip'
]);

const IMAGE_MIMES = new Set(Object.keys(EXT_BY_MIME));

function extOf(filename) {
  return path.extname(filename || '').toLowerCase();
}

/* ─────────────────── General attachments (task files) ─────────────────── */

/**
 * Both uploaders keep files IN MEMORY - nothing is written to disk here.
 *
 * - The MIME/extension fileFilter runs first and the byte-signature check
 *   runs in the controller, so an invalid file can never persist anywhere.
 * - The buffer is what config/assetStorage ships to Cloudinary in
 *   production; in local dev it writes the same bytes to disk afterwards.
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = extOf(file.originalname);
    const mime = (file.mimetype || '').toLowerCase();

    const imageOk = IMAGE_MIMES.has(mime) && Object.values(EXT_BY_MIME).includes(ext);
    const docOk = DOCUMENT_MIMES.has(mime) && !IMAGE_MIMES.has(mime) && ext !== '' && ext !== '.html' && ext !== '.htm' && ext !== '.js' && ext !== '.svg';

    if (imageOk || docOk) return cb(null, true);

    cb(new Error(
      `File type not allowed: ${file.originalname}. ` +
      'Accepted: images (png, jpg, gif, webp) and documents (pdf, txt, csv, doc, xls, xlsx, zip).'
    ));
  }
});

/* ──────────────────────────── Avatars ──────────────────────────── */

/**
 * Stricter than the general uploader on purpose:
 *  - images only
 *  - 2MB cap, since an avatar is displayed in every sidebar and table row
 *
 * Storage is the same in-memory one; the final file name is chosen later by
 * config/assetStorage (Cloudinary public id, or the local disk name).
 */
const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = extOf(file.originalname);
    const mime = (file.mimetype || '').toLowerCase();
    const expectedExt = EXT_BY_MIME[mime];

    if (!expectedExt || ext !== expectedExt) {
      return cb(new Error(
        `Avatar must be a PNG, JPEG, GIF or WEBP image (got ${file.originalname}).`
      ));
    }
    cb(null, true);
  }
});

/**
 * Magic-byte signatures.
 *
 * The declared MIME type and the file extension are both supplied by the
 * client, so they can be forged together: an HTML document containing script
 * can be posted as `sneaky.png` with `Content-Type: image/png` and passes a
 * naive name-based check. Comparing the real leading bytes against the known
 * signature for each format is what actually catches that.
 */
const SIGNATURES = {
  '.png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  '.jpg': [[0xff, 0xd8, 0xff]],
  '.gif': [[0x47, 0x49, 0x46, 0x38]],
  // WEBP is a RIFF container: "RIFF" .... "WEBP"
  '.webp': null // handled specially below
};

/**
 * Verify that a file really is the image type its extension claims.
 * Works on the in-memory buffer - files are never written to disk before
 * this passes. Returns true/false; never throws.
 */
function verifyImageBuffer(buffer, extension) {
  if (!buffer || buffer.length < 12) return false;
  const handle = buffer.slice(0, 12);

  const ext = (extension || '').toLowerCase();

  if (ext === '.webp') {
    return handle.slice(0, 4).toString('ascii') === 'RIFF' &&
           handle.slice(8, 12).toString('ascii') === 'WEBP';
  }

  const candidates = SIGNATURES[ext];
  if (!candidates) return false;

  return candidates.some((sig) => sig.every((byte, i) => handle[i] === byte));
}

module.exports = { upload, avatarUpload, verifyImageBuffer, UPLOAD_ROOT, AVATAR_DIR };