//validate email format
function isValidEmail(email) {
  // Regular expression to match email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Test the email against the regex
  return emailRegex.test(email);
}
module.exports = isValidEmail;