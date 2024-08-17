// Import necessary modules and dependencies
const request = require('supertest'); // For making HTTP requests in tests
const app = require('../src/app'); // Import the Express app
const User = require('../src/models/User'); // Import the User model
const mongoose = require('mongoose'); // Mongoose for database connection

/**
 * Test Suite for User API
 * This suite tests the User API endpoints including registration, login, and profile retrieval.
 */
describe('User API', () => {

  /**
   * Before all tests run, connect to the database.
   * This ensures that we have an active database connection for our tests.
   */
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  /**
   * Before each test, clear the User collection.
   * This prevents tests from interfering with each other by ensuring a clean state.
   */
  beforeEach(async () => {
    await User.deleteMany({}); // Delete all users before each test
  });

  /**
   * After all tests run, close the database connection.
   * This is important to release resources and prevent any lingering connections.
   */
  afterAll(async () => {
    await mongoose.connection.close(); // Close the database connection after tests
  });

  /**
   * Test Case: User Registration
   * It should register a new user with a unique email and return a JWT token.
   */
  test('It should register a new user', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`; // Generate a unique email for the test
    const res = await request(app).post('/api/users/register').send({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    // Assert that the response status is 201 (Created)
    expect(res.statusCode).toBe(201);

    // Assert that the response body contains a token
    expect(res.body).toHaveProperty('token');
  });

  /**
   * Test Case: Duplicate Email Registration
   * It should not allow registration with an email that is already in use.
   */
  test('It should not register a user with an existing email', async () => {
    const email = `duplicate@example.com`; // Use a fixed email to test duplication

    // Register the first user
    await request(app).post('/api/users/register').send({
      name: 'Test User',
      email,
      password: 'password123',
    });

    // Attempt to register another user with the same email
    const res = await request(app).post('/api/users/register').send({
      name: 'Another User',
      email,
      password: 'password123',
    });

    // Assert that the response status is 400 (Bad Request)
    expect(res.statusCode).toBe(400);

    // Assert that the response body contains the appropriate error message
    expect(res.body).toHaveProperty('message', 'Email already in use');
  });

  /**
   * Test Case: User Login
   * It should log in a registered user and return a JWT token.
   */
  test('It should log in a user and return a token', async () => {
    const email = `loginuser@example.com`; // Unique email for login test
    const password = 'password123';

    // First, register the user
    await request(app).post('/api/users/register').send({
      name: 'Test User',
      email,
      password,
    });

    // Then, attempt to log in with the same credentials
    const res = await request(app).post('/api/users/login').send({
      email,
      password,
    });

    // Assert that the response status is 200 (OK)
    expect(res.statusCode).toBe(200);

    // Assert that the response body contains a token
    expect(res.body).toHaveProperty('token');
  });
});
