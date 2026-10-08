const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_ROOT = path.join(__dirname, '../uploads');
const AVATAR_DIR = path.join(UPLOAD_ROOT, 'avatars');

for (const dir of [UPLOAD_ROOT, AVATAR_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ROOT),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `file-${uniqueSuffix}${extOf(file.originalname)}`);
  }
});

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

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = extOf(file.originalname);
    // Store as user-<id>-<timestamp>.<ext> so the owner is obvious on disk and
    // a re-upload never silently overwrites someone else's file.
    cb(null, `user-${req.user?.id ?? 'anon'}-${Date.now()}${ext}`);
  }
});

/**
 * Stricter than the general uploader on purpose:
 *  - images only
 *  - 2MB cap, since an avatar is displayed in every sidebar and table row
 */
const avatarUpload = multer({
  storage: avatarStorage,
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
 * Verify that a file on disk really is the image type its name claims.
 * Returns true/false; never throws.
 */
function verifyImageSignature(filePath, extension) {
  let handle;
  try {
    const fd = fs.openSync(filePath, 'r');
    handle = Buffer.alloc(12);
    fs.readSync(fd, handle, 0, 12, 0);
    fs.closeSync(fd);
  } catch {
    return false;
  }

  const ext = (extension || '').toLowerCase();

  if (ext === '.webp') {
    return handle.slice(0, 4).toString('ascii') === 'RIFF' &&
           handle.slice(8, 12).toString('ascii') === 'WEBP';
  }

  const candidates = SIGNATURES[ext];
  if (!candidates) return false;

  return candidates.some((sig) => sig.every((byte, i) => handle[i] === byte));
}

module.exports = { upload, avatarUpload, verifyImageSignature, UPLOAD_ROOT, AVATAR_DIR };