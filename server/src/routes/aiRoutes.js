const express = require('express');
const validate = require('../middlewares/validate');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');
const { deviceLimiter } = require('../middlewares/rateLimit');
const {
  deviceAttendanceSchema,
  handleDeviceAttendance,
  bulkAttendanceSchema,
  handleBulkAttendance
} = require('../controllers/aiAttendanceController');

const router = express.Router();

// Endpoint called by Raspberry Pi devices for AI-based attendance events.
// Protected via device API key authentication and rate limiting.
router.post(
  '/attendance',
  deviceLimiter,
  deviceAuthMiddleware,
  validate(deviceAttendanceSchema),
  handleDeviceAttendance
);

// Offline sync: batch attendance submissions from device when it regains connectivity.
router.post(
  '/attendance/bulk',
  deviceLimiter,
  deviceAuthMiddleware,
  validate(bulkAttendanceSchema),
  handleBulkAttendance
);

module.exports = router;

