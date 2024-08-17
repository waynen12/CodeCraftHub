// Import necessary modules and models
const jwt = require('jsonwebtoken'); // For verifying JSON Web Tokens (JWT)
const User = require('../models/User'); // User model for interacting with the users collection

/**
 * Authentication middleware
 * This middleware protects routes by ensuring that the request contains a valid JWT.
 * If the token is valid, the user's information is attached to the request object.
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify the token and decode the user ID from it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password'); // Attach the user to the request object

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Handle token expiration or verification errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    // If no token is provided, return an error
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Export the middleware function to be used in protected routes
module.exports = authMiddleware;
