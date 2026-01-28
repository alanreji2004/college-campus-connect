const Joi = require('joi');
const createError = require('http-errors');
const {
  validateUserCredentials,
  generateAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken
} = require('../services/authService');
const { logAudit } = require('../services/auditService');

// Validation schema for login
const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required()
  }).required(),
  query: Joi.object({}).unknown(true),
  params: Joi.object({}).unknown(true)
});

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await validateUserCredentials(email, password);
    const accessToken = generateAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    await logAudit({
      actorUserId: user.id,
      actorRoles: user.roles,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: user.id,
      metadata: { email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // For improved security in production, set HTTP-only cookie instead of returning token in body
    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        roles: user.roles
      }
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }

    return res.json({
      user: req.user
    });
  } catch (err) {
    return next(err);
  }
}

const refreshSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().uuid().required()
  }).required(),
  query: Joi.object({}).unknown(true),
  params: Joi.object({}).unknown(true)
});

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const { userId, newToken } = await rotateRefreshToken(refreshToken);

    const userResult = await require('../models/db').query(
      `SELECT u.id,
              u.email,
              u.full_name,
              COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       WHERE u.id = $1 AND u.deleted_at IS NULL
       GROUP BY u.id`,
      [userId]
    );

    const user = userResult.rows[0];
    if (!user) {
      throw createError(401, 'User not found for refresh token');
    }

    const accessToken = generateAccessToken(user);

    await logAudit({
      actorUserId: user.id,
      actorRoles: user.roles,
      action: 'REFRESH_TOKEN',
      entityType: 'USER',
      entityId: user.id,
      metadata: {},
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    return res.json({
      accessToken,
      refreshToken: newToken
    });
  } catch (err) {
    return next(err);
  }
}

const logoutSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().uuid().required()
  }).required(),
  query: Joi.object({}).unknown(true),
  params: Joi.object({}).unknown(true)
});

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await revokeRefreshToken(refreshToken);

    if (req.user) {
      await logAudit({
        actorUserId: req.user.sub,
        actorRoles: req.user.roles,
        action: 'LOGOUT',
        entityType: 'USER',
        entityId: req.user.sub,
        metadata: {},
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  loginSchema,
  login,
  me,
  refreshSchema,
  refresh,
  logoutSchema,
  logout
};

