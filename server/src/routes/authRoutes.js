const express = require('express');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimit');
const {
  loginSchema,
  login,
  me,
  refreshSchema,
  refresh,
  logoutSchema,
  logout
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', authMiddleware, validate(logoutSchema), logout);
router.get('/me', authMiddleware, me);

module.exports = router;

