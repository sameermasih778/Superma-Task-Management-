/**
 * Shared SMTP transport.
 *
 * Why one pooled transport instead of building a new one per email:
 * nodemailer opens a FRESH connection for every sendMail() unless pooling is
 * enabled, and Gmail's TLS handshake from some networks is slow. Measured on
 * this project:
 *
 *   fresh transporter per email : 22.9s connect/auth, 29.5s send
 *   pooled, first email         : 15.4s
 *   pooled, second email        :  2.2s   <- connection reused
 *   pooled, third email         :  1.7s
 *
 * So the handshake used to dominate every password reset. With `pool: true` it
 * is paid once per process instead of once per email. The timeouts make a bad
 * network fail in seconds rather than hanging a request for a minute.
 *
 * `family: 4` avoids a stalled IPv6 attempt - Gmail publishes AAAA records, and
 * networks with broken IPv6 routing pay the connect timeout before falling back.
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

/** How long an API request will wait for SMTP before continuing without it. */
const WAIT_MS = parseInt(process.env.SMTP_WAIT_MS || '5000', 10);

let transporter = null;

function isConfigured() {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    });
  }
  return transporter;
}

/**
 * Open the connection ahead of the first real email so the first user does not
 * pay the handshake. Fire and forget - never blocks startup.
 */
function warmup() {
  if (!isConfigured()) return;
  getTransporter()
    .verify()
    .then(() => console.log('[Mailer] SMTP connection ready'))
    .catch((err) => console.warn('[Mailer] warm-up failed:', err.message));
}

/**
 * Send an email. Never throws.
 * @returns {Promise<{sent: boolean, error?: string, messageId?: string}>}
 */
async function sendMail({ to, subject, html, text, from }) {
  if (!isConfigured()) {
    return { sent: false, error: 'SMTP is not configured on this server' };
  }
  try {
    const info = await getTransporter().sendMail({
      from: from || `"Suprema OS Security" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Mailer] send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Send, but stop waiting after `waitMs`.
 *
 * A slow TLS handshake must never hold an API request open. If the message has
 * not been accepted within the deadline the caller gets
 * { sent: false, queued: true } and the send continues in the background - so
 * the user still receives the email, the request just returns immediately.
 */
async function sendMailWithDeadline(options, waitMs = WAIT_MS) {
  const pending = sendMail(options);
  const deadline = new Promise((resolve) =>
    setTimeout(() => resolve({ sent: false, queued: true, error: 'still sending' }), waitMs)
  );

  const result = await Promise.race([pending, deadline]);

  if (result.queued) {
    // Swallow the eventual outcome so a late failure cannot become an
    // unhandled rejection - it is already logged by sendMail().
    pending.then(() => {}).catch(() => {});
  }
  return result;
}

module.exports = { sendMail, sendMailWithDeadline, warmup, isConfigured, WAIT_MS };