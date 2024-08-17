// Import necessary modules and models
const User = require('../models/User'); // User model for interacting with the users collection
const jwt = require('jsonwebtoken'); // For generating and verifying JSON Web Tokens (JWT)

/**
 * Register a new user
 * This controller handles the registration of a new user.
 * It checks for existing users, hashes the password, saves the user, and returns a JWT.
 */
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create and save the new user
    const user = await User.create({ name, email, password });

    // Generate a JWT for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return the token and user data (excluding the password)
    res.status(201).json({ token, user });
  } catch (error) {
    // Handle any errors during registration
    res.status(400).json({ error: error.message });
  }
};

/**
 * Authenticate user and return token
 * This controller handles user login by validating the credentials
 * and returning a JWT if the credentials are correct.
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and if the password matches
    if (user && (await user.matchPassword(password))) {
      // Generate a JWT for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Return the token and user data
      res.json({ token, user });
    } else {
      // If credentials are invalid, return an error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // Handle any errors during login
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get user profile
 * This controller retrieves the profile of the currently authenticated user.
 * It requires the user to be authenticated.
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Find the user by ID and exclude the password field
    const user = await User.findById(req.user.id).select('-password');

    // If the user exists, return the user data
    if (user) {
      res.json(user);
    } else {
      // If the user is not found, return an error
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Handle any errors during profile retrieval
    res.status(400).json({ error: error.message });
  }
};
