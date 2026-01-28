// Simple input sanitization middleware.
// - Trims string values
// - Removes control characters that should not appear in normal text
// This is complementary to Joi validation and parameterized SQL queries.

function cleanValue(value) {
  if (typeof value === 'string') {
    // Remove ASCII control chars and trim
    return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map((v) => cleanValue(v));
  }
  if (value && typeof value === 'object') {
    const cleaned = {};
    Object.keys(value).forEach((k) => {
      cleaned[k] = cleanValue(value[k]);
    });
    return cleaned;
  }
  return value;
}

function sanitize(req, res, next) {
  if (req.body) req.body = cleanValue(req.body);
  if (req.query) req.query = cleanValue(req.query);
  if (req.params) req.params = cleanValue(req.params);
  next();
}

module.exports = sanitize;

