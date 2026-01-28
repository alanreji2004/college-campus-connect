const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const db = require('../models/db');

// Authenticates a Raspberry Pi device using headers:
// - X-Device-Id: UUID of the device
// - X-Device-Token: API key issued at registration time
// Optional IP check against devices.allowed_ip.

async function deviceAuthMiddleware(req, res, next) {
  try {
    const deviceId = req.header('X-Device-Id');
    const deviceToken = req.header('X-Device-Token');

    if (!deviceId || !deviceToken) {
      throw createError(401, 'Missing device credentials');
    }

    const result = await db.query(
      `SELECT id, device_code, name, api_key_hash, allowed_ip, is_active
         FROM devices
        WHERE id = $1 AND deleted_at IS NULL`,
      [deviceId]
    );

    const device = result.rows[0];
    if (!device || !device.is_active) {
      throw createError(401, 'Unknown or inactive device');
    }

    if (!device.api_key_hash) {
      throw createError(401, 'Device is not configured for API key auth');
    }

    const tokenMatch = await bcrypt.compare(deviceToken, device.api_key_hash);
    if (!tokenMatch) {
      throw createError(401, 'Invalid device token');
    }

    // Optional IP whitelisting
    if (device.allowed_ip) {
      // req.ip can be in different formats (e.g. "::ffff:1.2.3.4"), normalize if needed.
      const requestIp = (req.ip || '').replace('::ffff:', '');
      if (requestIp !== device.allowed_ip) {
        throw createError(403, 'IP not allowed for this device');
      }
    }

    req.device = {
      id: device.id,
      deviceCode: device.device_code,
      name: device.name
    };

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = deviceAuthMiddleware;

