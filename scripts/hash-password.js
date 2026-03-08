const { hash } = require('bcryptjs');

async function hashPassword(password) {
  try {
    const hashedPassword = await hash(password, 10);
    console.log(`Password: ${password}`);
    console.log(`Hashed: ${hashedPassword}`);
    console.log('\nYou can use this hashed password in your database.');
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.log('Usage: node hash-password.js <password>');
  console.log('Example: node hash-password.js 1234');
  process.exit(1);
}

hashPassword(password);
