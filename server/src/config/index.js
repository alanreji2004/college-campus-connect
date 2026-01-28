const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'CHANGE_ME_REFRESH_IN_PRODUCTION',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  },
  db: {
    connectionString:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/campus_connect'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
};

// Fail fast if secrets are not configured in production
if (config.env === 'production') {
  if (!process.env.JWT_SECRET || config.jwt.secret.startsWith('CHANGE_ME')) {
    throw new Error('JWT_SECRET must be set in production');
  }
  if (!process.env.REFRESH_TOKEN_SECRET || config.refreshToken.secret.startsWith('CHANGE_ME')) {
    throw new Error('REFRESH_TOKEN_SECRET must be set in production');
  }
}

module.exports = config;

