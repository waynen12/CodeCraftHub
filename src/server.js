// Import the Express application
const app = require('./app');

// Define the port to run the server on, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5000;

/**
 * Start the server
 * This will start the Express server on the specified port and log a message to the console.
 */
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

/**
 * Graceful shutdown
 * This handles server shutdown on termination signals, ensuring that all connections are closed properly.
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
