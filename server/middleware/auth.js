const jwt = require('jsonwebtoken');

/**
 * Middleware: Verify JWT Bearer Token
 * Extracts token from 'Authorization: Bearer <token>' header
 * Attaches decoded user payload to req.user
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No Authentication Token Provided'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'suprema_jwt_super_secret_key_2026_dev_mode', (err, user) => {
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(403).json({
        success: false,
        message: isExpired ? 'Authentication Token Expired' : 'Invalid or Tampered Authentication Token',
        error: err.message
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware: Role-Based Access Control (RBAC)
 * @param {...string} allowedRoles Allowed user roles (e.g. 'super_admin', 'admin', 'member', 'viewer')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
