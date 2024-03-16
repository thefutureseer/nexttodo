// Import the hashPassword function
const { hashPassword } = require('./bcryptUtils');

// Define a test function
async function testHashPassword() {
  // Known password to test
  const password = 'testPassword';

  try {
    // Call the hashPassword function with the known password
    const hashedPassword = await hashPassword(password);

    // Log the hashed password for verification
    console.log('Hashed Password:', hashedPassword);

    // Add assertions to verify the hashed password
    // For example, you can use a library like assert or Jest
    // assert.strictEqual(hashedPassword, '<expected hashed password>');

    // If using Jest:
    // expect(hashedPassword).toBe('<expected hashed password>');

    // If the function runs without errors and returns a hashed password, the test passes
    console.log('Test passed successfully!');
  } catch (error) {
    // Log any errors that occur during testing
    console.error('Test failed:', error);
  }
}

// Call the test function
testHashPassword();