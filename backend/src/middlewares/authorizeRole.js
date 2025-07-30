// src/middlewares/authorizeRole.js

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // assume req.user is set by verifyToken middleware
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};
