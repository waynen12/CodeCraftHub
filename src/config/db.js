// Import necessary modules

const dotenv = require('dotenv'); // For loading environment variables from .env file

// Load environment variables from .env file
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI); // This should print the URI or undefined
const mongoose = require('mongoose'); // Mongoose for MongoDB interaction

/**
 * Connect to MongoDB
 * This function establishes a connection to the MongoDB database using Mongoose.
 * It logs a success message if the connection is successful or an error message if it fails.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    // Log any connection errors and exit the process with a failure code
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handler for terminating the database connection cleanly
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;
