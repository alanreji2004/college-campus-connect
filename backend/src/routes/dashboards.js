const express = require('express');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { ROLES } = require('../roles');

const router = express.Router();

// All dashboard routes are behind auth
router.use(auth);

// Each route is restricted to specific roles.

router.get('/super-admin', requireRole(ROLES.SUPER_ADMIN), (req, res) => {
  return res.json({
    role: ROLES.SUPER_ADMIN,
    widgets: [
      'College overview',
      'Multi-campus metrics',
      'User & role management',
      'Billing & subscriptions'
    ]
  });
});

router.get('/principal', requireRole(ROLES.PRINCIPAL, ROLES.SUPER_ADMIN), (req, res) => {
  return res.json({
    role: ROLES.PRINCIPAL,
    widgets: ['Department performance', 'Attendance summary', 'Exam schedules']
  });
});

router.get(
  '/hod',
  requireRole(ROLES.HOD, ROLES.PRINCIPAL, ROLES.SUPER_ADMIN),
  (req, res) => {
    return res.json({
      role: ROLES.HOD,
      widgets: ['Class performance', 'Faculty load', 'Course planning']
    });
  }
);

router.get(
  '/staff',
  requireRole(ROLES.STAFF, ROLES.HOD, ROLES.PRINCIPAL, ROLES.SUPER_ADMIN),
  (req, res) => {
    return res.json({
      role: ROLES.STAFF,
      widgets: ['My timetable', 'My attendance', 'Class attendance', 'Assignments']
    });
  }
);

router.get('/student', requireRole(ROLES.STUDENT), (req, res) => {
  return res.json({
    role: ROLES.STUDENT,
    widgets: ['Today\'s classes', 'Attendance', 'Grades', 'Library dues']
  });
});

router.get(
  '/lab-assistant',
  requireRole(ROLES.LAB_ASSISTANT, ROLES.IT_ADMIN, ROLES.SUPER_ADMIN),
  (req, res) => {
    return res.json({
      role: ROLES.LAB_ASSISTANT,
      widgets: ['Lab schedule', 'Equipment status', 'AI attendance devices']
    });
  }
);

router.get(
  '/accountant',
  requireRole(ROLES.ACCOUNTANT, ROLES.SUPER_ADMIN),
  (req, res) => {
    return res.json({
      role: ROLES.ACCOUNTANT,
      widgets: ['Fee collection', 'Dues', 'Payouts', 'Financial reports']
    });
  }
);

router.get('/librarian', requireRole(ROLES.LIBRARIAN), (req, res) => {
  return res.json({
    role: ROLES.LIBRARIAN,
    widgets: ['Issue/return summary', 'Overdue books', 'Inventory']
  });
});

router.get(
  '/it-admin',
  requireRole(ROLES.IT_ADMIN, ROLES.SUPER_ADMIN),
  (req, res) => {
    return res.json({
      role: ROLES.IT_ADMIN,
      widgets: ['System health', 'User accounts', 'Raspberry Pi devices', 'API keys']
    });
  }
);

module.exports = router;

