const rateLimit = require('express-rate-limit');

// Generic API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for login to slow down brute force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' }
});

// Device-facing endpoints limiter (keyed by device id when possible)
const deviceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.header('X-Device-Id') || req.ip
});

module.exports = {
  apiLimiter,
  authLimiter,
  deviceLimiter
};

