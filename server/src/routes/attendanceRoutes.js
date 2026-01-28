const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validate');
const {
  markAttendanceSchema,
  markAttendance,
  overrideSchema,
  requestOverride,
  approveCorrection
} = require('../controllers/attendanceController');

const router = express.Router();

// Subject-wise manual attendance marking (staff / HOD)
router.post(
  '/',
  authMiddleware,
  requireRole('STAFF', 'HOD'),
  validate(markAttendanceSchema),
  markAttendance
);

// Manual override request (student or staff can raise, but here we restrict to STAFF/STUDENT roles if present)
router.post(
  '/corrections',
  authMiddleware,
  requireRole('STAFF', 'STUDENT'),
  validate(overrideSchema),
  requestOverride
);

// Only HOD can approve staff attendance corrections
router.post(
  '/corrections/:correctionId/approve',
  authMiddleware,
  requireRole('HOD'),
  approveCorrection
);

module.exports = router;

