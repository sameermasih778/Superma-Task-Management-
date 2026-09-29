const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/v1/health
router.get('/', async (req, res) => {
  let dbStatus = 'UNKNOWN';
  try {
    const [rows] = await pool.query('SELECT 1 as val');
    if (rows && rows[0].val === 1) {
      dbStatus = 'CONNECTED';
    }
  } catch (err) {
    dbStatus = 'DISCONNECTED';
  }

  res.status(200).json({
    success: true,
    status: 'UP',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

module.exports = router;
