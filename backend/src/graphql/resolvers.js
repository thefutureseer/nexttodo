const { User, Todo } = require('../models/index.js');
const { generateToken } = require('../util/jwtUtils');
const { hashPassword, comparePassword } = require('../util/bcryptUtils');
const { isValidEmail } = require('./validations/isValid.js');
const { authenticate } = require('../middleware/authMiddleware.js');

const resolvers = {
  Query: {
    currentUser: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
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

      try {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = generateToken({ userId: newUser._id });
        return { user: newUser, token };
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
  
    signIn: async (_, args) => {
      const { email, password } = args.input;
      console.log("signIn email taken to run: ", email)

      if (!email || !password) {
        throw new Error('Email and password are required fields.');
      }

      if (!isValidEmail(email)) {
        throw new Error('Invalid email format.');
      }


      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not found');
        }
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
          throw new Error('Invalid password');
        }
        const token = generateToken({ userId: user.id });
        console.log("this is userID signIn line 95 ", user.id);
        console.log("TOKEN GENERATED this is token resolver line 96: ", token)
        console.log("this is user whole line 97 ", user);
        
        return { user, token };
      } catch (error) {
        throw new Error(`Failed to sign in: ${error.message}`);
      }
    },

    addTodo: async (_, args) => {
      console.log("this is to addtodo:args ", args.input)
      const {title, text, completed} = args.input

      try {
        
        const newTodo = new Todo({title: title,text: text,completed: completed});
        console.log("this is to addtodo newTodos: ", newTodo)
        // Save the new todo to the database
        await newTodo.save();

        return newTodo;
      } catch (error) {
        console.error('Failed to add todo:', error.message);
        throw new Error('Failed to add todo line 150');
      }
    },
    
  }
};

module.exports = resolvers;
