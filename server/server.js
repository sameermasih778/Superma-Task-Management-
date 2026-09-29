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
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Rate Limiting
app.use('/api/', apiLimiter);

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
