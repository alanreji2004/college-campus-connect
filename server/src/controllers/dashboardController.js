const createError = require('http-errors');

async function getDashboard(req, res, next) {
  try {
    if (!req.user) {
      throw createError(401, 'Not authenticated');
    }

    // Basic example that returns widgets based on the first role.
    const primaryRole = (req.user.roles || [])[0] || 'UNKNOWN';

    const roleWidgets = {
      SUPER_ADMIN: ['College overview', 'User & role management', 'Billing'],
      PRINCIPAL: ['Department performance', 'Attendance summary', 'Exam schedules'],
      HOD: ['Class performance', 'Faculty load', 'Course planning'],
      STAFF: ['My timetable', 'Class attendance', 'Assignments'],
      STUDENT: ['Today\'s classes', 'Attendance', 'Grades'],
      LAB_ASSISTANT: ['Lab schedule', 'Equipment status', 'AI attendance devices'],
      ACCOUNTANT: ['Fee collection', 'Dues', 'Financial reports'],
      LIBRARIAN: ['Issue/return summary', 'Overdue books', 'Inventory'],
      IT_ADMIN: ['System health', 'User accounts', 'Devices', 'API keys']
    };

    return res.json({
      role: primaryRole,
      widgets: roleWidgets[primaryRole] || []
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDashboard
};

