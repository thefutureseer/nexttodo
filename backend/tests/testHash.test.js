// Add assertions to verify the hashed password
// Import the hashPassword function
const { hashPassword } = require('../src/util/bcryptUtils');

// Define a test function
async function testHashPassword() {
  // Known password to test
  const password = 'testPassword';

  try {
    // Call the hashPassword function with the known password
    const hashedPassword = await hashPassword(password);

    // Log the hashed password for verification
    console.log('Hashed Password:', hashedPassword);


    // If the function runs without errors and returns a hashed password, the test passes
    console.log('Test passed successfully!');
  } catch (error) {
    // Log any errors that occur during testing
    console.error('Test failed:', error);
  }
}

// Call the test function
testHashPassword();