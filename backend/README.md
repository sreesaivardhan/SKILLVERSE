# Node.js Express MongoDB Backend

This is a RESTful API backend built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mydb
   ```

3. Make sure MongoDB is running on your local machine

4. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Project Structure

- `server.js` - Entry point of the application
- `/models` - Database models
- `/controllers` - Request handlers
- `/routes` - API routes

## API Endpoints

- GET / - Welcome message
