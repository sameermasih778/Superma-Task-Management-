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

module.exports = { apiLimiter, formLimiter };
