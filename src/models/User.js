// Import necessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interaction
const bcrypt = require('bcryptjs'); // For hashing passwords

/**
 * User Schema
 * Defines the structure and validation rules for the User documents in MongoDB.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

// Create an index on the email field to enforce uniqueness and improve query performance
userSchema.index({ email: 1 });

/**
 * Pre-save middleware
 * This middleware hashes the password before saving the user document.
 * It only hashes the password if it has been modified or is new.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
  next();
});

/**
 * Method to compare entered password with hashed password
 * This method compares the plain-text password with the hashed password stored in the database.
 * It returns true if the passwords match, otherwise false.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compile the User model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
