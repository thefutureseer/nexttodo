//validate email format
function isValidEmail(email) {
  // Regular expression to match email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Test the email against the regex
  return emailRegex.test(email);
}

// Validate a name
function isValidName(name) {
  // Check if the name is truthy and is not just whitespace
  return !!name && name.trim().length > 0;
}

module.exports = {isValidEmail, isValidName};