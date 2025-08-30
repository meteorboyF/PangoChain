const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and extract user information
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (optional - for fresh user data)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is valid but user not found.' 
      });
    }

    // Add user info to request object
    req.user = user;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid token.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expired.' 
      });
    } else {
      return res.status(500).json({ 
        message: 'Token verification failed.',
        error: error.message 
      });
    }
  }
};

// Middleware to check if user has specific role(s)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.' 
      });
    }

    // Ensure roles is an array
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }
    
    next();
  };
};

// Optional middleware - allows requests with or without tokens
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
        req.userId = decoded.id;
        req.userRole = decoded.role;
      }
    }
    
    // Continue regardless of token presence/validity
    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth
};