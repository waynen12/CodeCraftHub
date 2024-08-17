// Import necessary modules and configurations
const express = require('express'); // Express for handling HTTP requests
const dotenv = require('dotenv'); // For loading environment variables from .env file
const connectDB = require('./config/db'); // Database connection function
const userRoutes = require('./routes/userRoutes'); // User routes

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Initialize the Express application
const app = express();

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Define the routes for user-related API endpoints
app.use('/api/users/', userRoutes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Export the app to be used in the server.js file
module.exports = app;
