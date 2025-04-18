const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Encryption settings
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

// Encrypt a string
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt a string
function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Sensitive variables that should be encrypted
const SENSITIVE_VARS = [
    'JWT_SECRET',
    'GOOGLE_CLIENT_SECRET',
    'SENDGRID_API_KEY',
    'TWILIO_AUTH_TOKEN'
];

function encryptEnvFile(inputFile, outputFile) {
    // Read the input .env file
    const envContent = fs.readFileSync(inputFile, 'utf8');
    const lines = envContent.split('\n');
    
    // Process each line
    const processedLines = lines.map(line => {
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=');
            
            if (SENSITIVE_VARS.includes(key.trim())) {
                // Encrypt sensitive values
                const encryptedValue = encrypt(value.trim());
                return `${key}=${encryptedValue}`;
            }
        }
        return line;
    });
    
    // Write the processed content to the output file
    fs.writeFileSync(outputFile, processedLines.join('\n'));
    console.log(`Encrypted sensitive variables in ${outputFile}`);
}

// Generate a new encryption key
function generateEncryptionKey() {
    const key = crypto.randomBytes(32);
    const keyHex = key.toString('hex');
    
    // Save the key to a secure file
    fs.writeFileSync(
        path.join(__dirname, '..', '.encryption-key'),
        keyHex,
        { mode: 0o600 } // Read/write for owner only
    );
    
    console.log('Generated new encryption key');
    return key;
}

// Main function
function secureEnvironments() {
    // Generate encryption key if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '..', '.encryption-key'))) {
        generateEncryptionKey();
    }
    
    // Encrypt each environment file
    const envFiles = ['.env', '.env.test', '.env.production'];
    envFiles.forEach(file => {
        const inputPath = path.join(__dirname, '..', file);
        const outputPath = path.join(__dirname, '..', `${file}.encrypted`);
        
        if (fs.existsSync(inputPath)) {
            encryptEnvFile(inputPath, outputPath);
        }
    });
    
    console.log('\nEnvironment files secured!');
    console.log('Remember to:');
    console.log('1. Keep .encryption-key file secure and backed up');
    console.log('2. Never commit encrypted files or encryption key to version control');
    console.log('3. Share the encryption key securely with team members');
}

secureEnvironments();
