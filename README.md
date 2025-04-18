# SKILLVERSE

SKILLVERSE is a comprehensive platform designed to help users develop, showcase, and connect through their skills. This repository contains both the frontend and backend code for the SKILLVERSE application.

## Project Structure

The project is organized into two main directories:

- `frontend/` - Next.js-based web application
- `backend/` - Node.js/Express API server

## Frontend (Next.js)

The frontend is built with Next.js, React, and Tailwind CSS, providing a modern and responsive user interface.

### Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Key Features

- Modern React with Next.js framework
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Interactive UI components

## Backend (Node.js/Express)

The backend provides RESTful API services built with Node.js, Express, and MongoDB.

### Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillverse
   ```

4. Make sure MongoDB is running on your local machine

5. Start the server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### API Endpoints

- User management
- Skill tracking and development
- Authentication and authorization
- WebRTC communication

## Running the Full Stack Application

1. Start the backend server first (on port 5000)
2. Start the frontend development server (on port 3000)
3. The frontend will communicate with the backend API

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/sreesaivardhan/SKILLVERSE](https://github.com/sreesaivardhan/SKILLVERSE)
