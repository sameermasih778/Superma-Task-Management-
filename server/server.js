const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const apiRouter = require('./routes');

const app = express();

// Security Middlewares
app.use(helmet());

/**
 * CORS configuration.
 *
 * `origin` is a resolver rather than a fixed string because Vite does NOT
 * always run on 5173 - if that port is still held by a previous dev process it
 * silently falls back to 5174, 5175, ... A hardcoded CLIENT_ORIGIN then
 * rejects every API call: the server still processes the request and logs
 * "200", but the browser discards the response because the
 * Access-Control-Allow-Origin header does not match the page's origin. That
 * surfaces in the UI as an authentication failure with nothing wrong with the
 * credentials, which is very hard to debug.
 *
 * CLIENT_ORIGIN accepts a comma-separated list for multiple real origins. In
 * development we additionally allow any loopback host on any port, which is
 * safe (nothing outside this machine can present such an Origin) and removes
 * the port-mismatch trap entirely. Production stays restricted to the
 * explicitly configured origins - it never gets the loopback wildcard.
 */
const configuredOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOOPBACK_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // Non-browser clients (curl, Postman, server-to-server) send no Origin.
    if (!origin) return callback(null, true);

    if (configuredOrigins.includes(origin)) return callback(null, true);

    if (isDevelopment && LOOPBACK_ORIGIN.test(origin)) return callback(null, true);

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Rate Limiting
app.use('/api/', apiLimiter);

// Static Uploads Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check at root level
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', server: 'Suprema Backend API', timestamp: new Date() });
});

// API Routes Mount
app.use('/api/v1', apiRouter);

// 404 Unhandled Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource endpoint '${req.originalUrl}' not found on Suprema server.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Suprema Express Backend Server running on port ${PORT}`);
    console.log(`📡 Environment: [${process.env.NODE_ENV || 'development'}]`);
    console.log(`🌐 Allowed Client Origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
  });
}

module.exports = app;
