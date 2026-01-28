const { ROLES } = require('../roles');

// Generic role guard: require at least one of the allowed roles
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
}

// Example: fine-grained helpers if you want them in routes
const requireSuperAdmin = requireRole(ROLES.SUPER_ADMIN);

module.exports = {
  requireRole,
  requireSuperAdmin
};

