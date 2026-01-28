const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middlewares/authMiddleware');
const deviceAuthMiddleware = require('../middlewares/deviceAuthMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const { registerDevice, reportHealth } = require('../controllers/deviceController');

const router = express.Router();

const registerDeviceSchema = Joi.object({
  body: Joi.object({
    deviceCode: Joi.string().max(100).required(),
    name: Joi.string().max(255).required(),
    location: Joi.string().max(255).optional(),
    ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
    allowedIp: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional()
  }).required(),
  query: Joi.object({}).unknown(true),
  params: Joi.object({}).unknown(true)
});

// Only SUPER_ADMIN or IT_ADMIN can register hardware devices
router.post(
  '/',
  authMiddleware,
  requireRole('SUPER_ADMIN', 'IT_ADMIN'),
  validate(registerDeviceSchema),
  registerDevice
);

// Device health check (called by Raspberry Pi)
router.post('/health', deviceAuthMiddleware, reportHealth);

module.exports = router;

