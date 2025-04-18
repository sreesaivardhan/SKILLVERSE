const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';
let token;
let userId;
let sessionId;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/skillverse_test');
});

afterAll(async () => {
  // Disconnect from test database
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  test('Should register a new user', async () => {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'instructor'
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
    token = response.data.token;
  });

  test('Should login user', async () => {
    const email = `test${Date.now()}@example.com`;
    
    // Register user first
    await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Login Test User',
      email,
      password: 'password123'
    });
    
    // Then login
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });
});

describe('User Profile API', () => {
  test('Should get current user profile', async () => {
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: { 'x-auth-token': token }
    });

    expect(response.status).toBe(200);
    expect(response.data._id).toBeDefined();
    userId = response.data._id;
  });

  test('Should update user profile', async () => {
    const response = await axios.put(
      `${API_URL}/api/users/me`,
      {
        name: 'Updated Test User',
        skills: [{ name: 'JavaScript', level: 'advanced' }]
      },
      {
        headers: { 'x-auth-token': token }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('Updated Test User');
  });
});

describe('Session Management API', () => {
  test('Should book a session', async () => {
    // Create a second user for booking
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Student User',
      email: `student${Date.now()}@example.com`,
      password: 'password123',
      role: 'learner'
    });
    
    const studentToken = registerResponse.data.token;
    
    // Book session with instructor
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 7); // 1 week from now
    
    const response = await axios.post(
      `${API_URL}/api/sessions/book`, 
      {
        instructorId: userId,
        skill: 'JavaScript',
        startTime: startTime.toISOString(),
        duration: 60
      },
      {
        headers: { 'x-auth-token': studentToken }
      }
    );

    expect(response.status).toBe(201);
    expect(response.data._id).toBeDefined();
    sessionId = response.data._id;
  });

  test('Should get upcoming sessions', async () => {
    const response = await axios.get(`${API_URL}/api/sessions/upcoming`, {
      headers: { 'x-auth-token': token }
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('Should complete a session', async () => {
    // Need to confirm session first
    await axios.put(
      `${API_URL}/api/sessions/${sessionId}/confirm`, 
      {},
      { headers: { 'x-auth-token': token } }
    );
    
    const response = await axios.post(
      `${API_URL}/api/sessions/complete/${sessionId}`,
      {},
      { headers: { 'x-auth-token': token } }
    );

    expect(response.status).toBe(200);
    expect(response.data.status).toBe('completed');
  });
});

describe('AI Features API', () => {
  test('Should get skill recommendations', async () => {
    const response = await axios.get(
      `${API_URL}/api/ai/skills/recommended`,
      { headers: { 'x-auth-token': token } }
    );

    expect(response.status).toBe(200);
    expect(response.data.recommendations).toBeDefined();
    expect(Array.isArray(response.data.recommendations)).toBe(true);
  });

  test('Should get instructor recommendations', async () => {
    const response = await axios.get(
      `${API_URL}/api/ai/instructors/recommended/JavaScript`,
      { headers: { 'x-auth-token': token } }
    );

    expect(response.status).toBe(200);
    expect(response.data.recommendations).toBeDefined();
    expect(Array.isArray(response.data.recommendations)).toBe(true);
  });

  test('Should get learning path', async () => {
    const response = await axios.get(
      `${API_URL}/api/ai/path/JavaScript`,
      { headers: { 'x-auth-token': token } }
    );

    expect(response.status).toBe(200);
    expect(response.data.learningPath).toBeDefined();
    expect(Array.isArray(response.data.learningPath)).toBe(true);
  });
});
