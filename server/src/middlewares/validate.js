const Joi = require('joi');

// Generic Joi-based request validation middleware

function validate(schema) {
  return (req, res, next) => {
    const toValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    const { value, error } = schema.validate(toValidate, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((d) => d.message)
      });
    }

    req.body = value.body;
    req.query = value.query;
    req.params = value.params;
    return next();
  };
}

module.exports = validate;

