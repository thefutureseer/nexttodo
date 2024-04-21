const { authSignIn } = require('../auth/authSignIn.js');

const contextCreation = ({ req }) => {
let user = null; // Initialize user to null

// Check if user information exists in the request object
if (req && req.user) {
  // If user information exists, assign it to the user variable
  console.log("this is context.req.user line9 ", req.user);
  user = req.user;
};

  // Return the context object containing any necessary data
  return {
    // Include the authenticated user in the context user: user.
    user,
    // Include the signIn function in the context
    signIn: async (email, password) => {
      try {
        // Call the authentication function
        const userInfo = await authSignIn(email, password);
        req.user = userInfo;
        console.log("this is context.req.user line22 ", req.user);
        // Return the user info
        return req.user;
      } catch (error) {
        // Handle any errors
        console.error('Error during sign-in:', error);
        throw new Error('Failed to sign in');
      }
    },
  };
};

module.exports = { contextCreation };