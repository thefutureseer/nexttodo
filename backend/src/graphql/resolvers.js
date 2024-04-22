const { User, Todo } = require('../models/index.js');
const { generateToken } = require('../util/jwtUtils');
const { isValidEmail } = require('./validations/isValid.js');
const { nowVerify } = require('../util/nowVerify.js');
// const { authenticate, AuthenticationError } = require('../middleware/authMiddleware.js');

const resolvers = {
  Query: {

    todos: async () => {
      const todos = await Todo.find();
      return todos;
    },
  },

  Mutation: {
    signUp: async (_, args, {req, signIn}) => {
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
        //after signing up imediately sign in user
        await signIn(email, password);


        // Return the user along with the token
        return { user: newUser.toObject({ getters: true }), token };
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },

    //signIn function coming from context
    signIn: async (_, args, {req, signIn}) => {
      console.log("req from resolver line73 ", req );
      // Destructure email and password from args.input
      const { email, password } = args.input;

      try {
        //Do sign in from ContextCreation
        const userInput = signIn(email, password);

        //After signing in the info comes 
        //back to the resolver for further processing

        //return user input after signin
        return userInput;
      } catch(error) {
        console.error('Error during sign-in:', error);
         throw new Error('bad sign in line88');
      }
    },

  }
};

module.exports = resolvers;
