const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Generate a secure random string for JWT_SECRET
function generateSecureSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Create environment files with secure values
function createEnvFile(filename, variables) {
  const content = Object.entries(variables)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(filename, content + '\n');
  console.log(`Created ${filename}`);
}

// Setup different environments
function setupEnvironments() {
  const jwtSecret = generateSecureSecret();
  const testJwtSecret = generateSecureSecret();
  
  // Development environment
  const devEnv = {
    PORT: 5000,
    MONGODB_URI: 'mongodb://localhost:27017/skillverse',
    JWT_SECRET: jwtSecret,
    GOOGLE_CLIENT_ID: 'your_google_client_id',
    GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
    GOOGLE_REDIRECT_URI: 'http://localhost:5000/api/calendar/callback',
    SENDGRID_API_KEY: 'your_sendgrid_api_key',
    FROM_EMAIL: 'your_verified_sender_email',
    TWILIO_ACCOUNT_SID: 'your_twilio_account_sid',
    TWILIO_AUTH_TOKEN: 'your_twilio_auth_token',
    TWILIO_PHONE_NUMBER: 'your_twilio_phone_number',
    FRONTEND_URL: 'http://localhost:3000'
  };

  // Test environment
  const testEnv = {
    PORT: 5001,
    MONGO_URI_TEST: 'mongodb://localhost:27017/skillverse_test',
    JWT_SECRET: testJwtSecret,
    API_URL: 'http://localhost:5001',
    SENDGRID_API_KEY: 'test_sendgrid_key',
    TWILIO_ACCOUNT_SID: 'test_twilio_sid',
    TWILIO_AUTH_TOKEN: 'test_twilio_token',
    TWILIO_PHONE_NUMBER: '+1234567890',
    FROM_EMAIL: 'test@example.com',
    GOOGLE_CLIENT_ID: 'test_client_id',
    GOOGLE_CLIENT_SECRET: 'test_client_secret',
    GOOGLE_REDIRECT_URI: 'http://localhost:5001/api/calendar/callback',
    FRONTEND_URL: 'http://localhost:3000'
  };

  // Production environment template
  const prodEnvTemplate = {
    PORT: 80,
    MONGODB_URI: 'your_production_mongodb_uri',
    JWT_SECRET: 'your_production_jwt_secret',
    GOOGLE_CLIENT_ID: 'your_production_google_client_id',
    GOOGLE_CLIENT_SECRET: 'your_production_google_client_secret',
    GOOGLE_REDIRECT_URI: 'https://your-domain.com/api/calendar/callback',
    SENDGRID_API_KEY: 'your_production_sendgrid_key',
    FROM_EMAIL: 'your_production_email',
    TWILIO_ACCOUNT_SID: 'your_production_twilio_sid',
    TWILIO_AUTH_TOKEN: 'your_production_twilio_token',
    TWILIO_PHONE_NUMBER: 'your_production_phone_number',
    FRONTEND_URL: 'https://your-domain.com'
  };

  // Create environment files
  createEnvFile(path.join(__dirname, '..', '.env'), devEnv);
  createEnvFile(path.join(__dirname, '..', '.env.test'), testEnv);
  createEnvFile(path.join(__dirname, '..', '.env.production.template'), prodEnvTemplate);
  
  // Create .env.example without sensitive values
  const exampleEnv = Object.keys(devEnv)
    .map(key => `${key}=your_${key.toLowerCase()}_here`)
    .join('\n');
  fs.writeFileSync(path.join(__dirname, '..', '.env.example'), exampleEnv + '\n');
  
  // Add .env files to .gitignore
  const gitignore = path.join(__dirname, '..', '.gitignore');
  const gitignoreContent = `
# Environment variables
.env
.env.test
.env.production
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# Build output
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
`;
  fs.writeFileSync(gitignore, gitignoreContent.trim() + '\n');
  
  console.log('\nEnvironment setup complete!');
  console.log('Remember to:');
  console.log('1. Never commit .env files to version control');
  console.log('2. Keep your production secrets secure');
  console.log('3. Update the production environment variables on your server');
}

setupEnvironments();
