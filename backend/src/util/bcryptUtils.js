const bcrypt = require('bcrypt');

async function hashPassword(password) {
  
  try {
    // Generate salt rounds
    const saltRounds = 10; // You can adjust this value as needed
    
    // Hash the password with the specified salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("passw hash ", hashedPassword)
    
    return hashedPassword;
  } catch (error) {
    // Handle any errors
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
