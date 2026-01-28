const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const {
  dailyAttendance,
  monthlyAttendance,
  departmentReports,
  studentRiskAlerts
} = require('../controllers/analyticsController');

const router = express.Router();

// All analytics endpoints require authentication and typically higher-privilege roles
router.use(authMiddleware);

// Daily / monthly attendance (Principal, HOD, Super Admin)
router.get(
  '/attendance/daily',
  requireRole('SUPER_ADMIN', 'PRINCIPAL', 'HOD'),
  dailyAttendance
);
router.get(
  '/attendance/monthly',
  requireRole('SUPER_ADMIN', 'PRINCIPAL', 'HOD'),
  monthlyAttendance
);

// Department-wise reports (Principal, HOD)
router.get(
  '/departments',
  requireRole('SUPER_ADMIN', 'PRINCIPAL', 'HOD'),
  departmentReports
);

// Student risk alerts (Principal, HOD, Staff, Counsellors if modeled as STAFF)
router.get(
  '/students/risk',
  requireRole('SUPER_ADMIN', 'PRINCIPAL', 'HOD', 'STAFF'),
  studentRiskAlerts
);

module.exports = router;

