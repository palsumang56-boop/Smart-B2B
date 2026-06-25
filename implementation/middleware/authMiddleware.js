// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// First, verify the user is logged in (has a valid token)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) return res.status(403).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_fallback_key');
    req.user = decoded; // Attach the decoded payload (id, role) to the request object
    next(); // Pass control to the next function
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Second, verify the user has the exact required role
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        error: `Forbidden. This route requires ${requiredRole} access.` 
      });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };