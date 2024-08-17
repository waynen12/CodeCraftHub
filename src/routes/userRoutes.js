// Import necessary modules and controllers
const express = require('express'); // Express for handling routes
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController'); // User controller functions
const authMiddleware = require('../middlewares/authMiddleware'); // Authentication middleware

// Initialize a new Express router
const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 * This route allows a new user to register. It calls the registerUser controller.
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 * This route allows a user to log in. It calls the loginUser controller.
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 * This route returns the authenticated user's profile. It is protected by the authMiddleware.
 */
router.get('/profile', authMiddleware, getUserProfile);

// Export the router to be used in the main application
module.exports = router;
