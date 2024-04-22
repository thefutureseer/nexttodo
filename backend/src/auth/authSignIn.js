const { User } = require('../models/index');
const { isValidEmail } = require('../graphql/validations/isValid');
const { generateToken } = require('../util/jwtUtils');

const authSignIn = async (email, password) => {
  console.log("this is signIn email taken to run: ", email)

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format.');
  }

  try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          throw new Error('User not found');
      }

      // Generate authentication token
      const token = generateToken({ userId: user.id });
      console.log("this is userID authSignIn line 22", user.id);
      console.log("TOKEN GENERATED authSignIn line 23: ", token)
      console.log("this is user whole authsignin line 26 ", user);
      // Return the user object and token if authentication succeed
      return { user, token };
    } catch (error) {
      // Throw an error if sign-in fails
      throw new Error(`Failed to sign in: ${error}`);
    }
};

module.exports = { authSignIn };