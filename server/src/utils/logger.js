const morgan = require('morgan');

// Simple console logger using morgan. You can swap in Winston later.

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms');

// Basic application-level logger wrapper
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[DEBUG]', ...args);
    }
  }
};

module.exports = {
  requestLogger,
  logger
};

