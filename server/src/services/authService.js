const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../config');
const db = require('../models/db');

async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT u.id,
            u.email,
            u.password_hash,
            u.full_name,
            u.is_active,
            COALESCE(json_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '[]') AS roles
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     WHERE u.email = $1 AND u.deleted_at IS NULL
     GROUP BY u.id`,
    [email]
  );
  return result.rows[0] || null;
}

async function validateUserCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user || !user.is_active) {
    throw createError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw createError(401, 'Invalid credentials');
  }

  return user;
}

function generateAccessToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.full_name,
    roles: user.roles
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  return token;
}

async function createRefreshToken(userId) {
  const tokenId = await db.query('SELECT gen_random_uuid() AS id');
  const token = tokenId.rows[0].id;

  const expiresAtResult = await db.query(
    "SELECT NOW() + $1::interval AS expires_at",
    [config.refreshToken.expiresIn]
  );

  const expiresAt = expiresAtResult.rows[0].expires_at;

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );

  return token;
}

async function rotateRefreshToken(oldToken) {
  const result = await db.query(
    `SELECT * FROM refresh_tokens
     WHERE token = $1
       AND is_revoked = FALSE
       AND expires_at > NOW()`,
    [oldToken]
  );

  const existing = result.rows[0];

  if (!existing) {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const newTokenId = await db.query('SELECT gen_random_uuid() AS id');
  const newToken = newTokenId.rows[0].id;

  const expiresAtResult = await db.query(
    "SELECT NOW() + $1::interval AS expires_at",
    [config.refreshToken.expiresIn]
  );
  const expiresAt = expiresAtResult.rows[0].expires_at;

  await db.query(
    `UPDATE refresh_tokens
       SET is_revoked = TRUE,
           replaced_by_token = $2
     WHERE id = $1`,
    [existing.id, newToken]
  );

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [existing.user_id, newToken, expiresAt]
  );

  return { userId: existing.user_id, newToken };
}

async function revokeRefreshToken(token) {
  await db.query(
    `UPDATE refresh_tokens
       SET is_revoked = TRUE
     WHERE token = $1`,
    [token]
  );
}

module.exports = {
  validateUserCredentials,
  generateAccessToken,
  createRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken
};

