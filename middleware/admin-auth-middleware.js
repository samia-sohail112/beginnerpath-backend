// ════════════════════════════════════════════════════════════════════════════
// ADMIN-AUTH-MIDDLEWARE.JS
// Middleware to verify user is admin
// Add this to your project
// ════════════════════════════════════════════════════════════════════════════

const jwt = require('jsonwebtoken');
const { User } = require('../mongodb-config');

// ════════════════════════════════════════════════════════════════════════════
// VERIFY TOKEN MIDDLEWARE
// ════════════════════════════════════════════════════════════════════════════

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Please login first'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-change-this'
    );

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token',
      message: error.message
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN VERIFICATION MIDDLEWARE
// ════════════════════════════════════════════════════════════════════════════

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Admin access required'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-change-this'
    );

    // Find user in database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'Invalid token'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Admin access required. You are not an admin.'
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════════════════════════════════════════

module.exports = {
  verifyToken,
  verifyAdmin
};