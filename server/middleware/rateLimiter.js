const rateLimit = require('express-rate-limit');

// Global API Rate Limiter (Bypassed for localhost / dev mode)
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10000', 10), // High limit for dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Permanently bypass rate limiting in development or for localhost IPs
    if (process.env.NODE_ENV !== 'production') return true;
    const clientIp = req.ip || req.connection?.remoteAddress || '';
    return clientIp.includes('127.0.0.1') || clientIp.includes('::1') || clientIp.includes('localhost');
  },
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});

// Strict Public Form Rate Limiter (Contact & Waitlist)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // 5 submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Submission limit reached for your IP address. Please try again in an hour.'
  }
});

/**
 * Waitlist signups get a larger budget than the contact form: the contact form
 * is one-off per enquiry, while a waitlist legitimately collects several
 * addresses from the same office or campus NAT (one public IP, many people).
 */
const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many signups from this network. Please try again later.'
  }
});

/**
 * Credential endpoints (password login, OTP verification, Google sign-in).
 * Deliberately much stricter than the global API limiter: these are the doors
 * into an account, so 20 failed attempts per 15 minutes per IP is plenty for a
 * human and useless to a guesser. The global limiter allows 10,000 so normal
 * app browsing never trips it.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only failed attempts count
  message: {
    success: false,
    message: 'Too many sign-in attempts. Please try again in 15 minutes.'
  }
});

module.exports = { apiLimiter, formLimiter, leadLimiter, authRateLimiter };
