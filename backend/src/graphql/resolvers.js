const { User, Todo } = require('../models/index.js');
const { generateToken } = require('../util/jwtUtils');
const { hashPassword, comparePassword } = require('../util/bcryptUtils');
const { isValidEmail } = require('./validations/isValid.js');
const { nowVerify } = require('../util/nowVerify.js');
const { authSignIn } = require('../middleware/authMiddleware.js');
const { authenticate, AuthenticationError } = require('../middleware/authMiddleware.js');

const resolvers = {
  Query: {

    todos: async () => {
      const todos = await Todo.find();
      return todos;
    },
  },

  Mutation: {
    signUp: async (_, args) => {
      const { username, email, password } = args.input;

      if (!username || !email || !password) {
        throw new Error('Username, email, and password are required fields.');
      }

      if (!isValidEmail(email)) {
        throw new Error('Invalid email format.');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      const newUser = new User({ username, email, password });
      
      try {
        // const hashedPassword = await hashPassword(password);
        await newUser.save();
        const token = generateToken({ userId: newUser._id });
        // Return the user along with the token
      return { user: newUser.toObject({ getters: true }), token };
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
  
    signIn: async (_, args) => {
      // Destructure email and password from args.input
      const { email, password } = args.input;
      console.log("resolver handing authsignIn email password to run: ", email);
      const userSignedIn = await authSignIn(email, password);
      return userSignedIn;
    }, 
  }
};

module.exports = resolvers;
