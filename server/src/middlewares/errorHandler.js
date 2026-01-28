const { logger } = require('../utils/logger');

// Not-found handler
function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'Route not found' });
}

// Central error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('Error handler:', {
    status,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : { stack: err.stack, details: err.details || undefined })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

