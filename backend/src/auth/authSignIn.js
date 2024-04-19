const { User } = require('../models/index');
const { isValidEmail } = require('../graphql/validations/isValid');
// const { comparePassword } = require('../util/bcryptUtils')
const { generateToken } = require('../util/jwtUtils');

const authSignIn = async (email, password) => {
  console.log("this is signIn email taken to run: ", email)

  // Check if email and password are provided
  // if (req.email){
  //   if (!email || !password) {
  //     throw new Error('Email and password are required fields.');
  //   }
  // }

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
        console.log("this is userID authSignIn line 35 ", user.id);
        console.log("TOKEN GENERATED authSignIn line 36: ", token)
        console.log("this is user whole authsignin line 37 ", user);
        
        // Return the user object and token
        return { user, token };
        // Return the user object if authentication succeed
      } catch (error) {
        // Throw an error if sign-in fails
        throw new Error(`Failed to sign in: ${error.message}`);
      }
};

module.exports = { authSignIn };