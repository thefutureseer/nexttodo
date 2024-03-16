const { User, Todo } = require('../models');
const { generateToken } = require('../util/jwtUtils');
const { hashPassword, comparePassword } = require('../util/bcryptUtils');

const resolvers = {
  Query: {
    userTodos: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Unauthorized: User not authenticated');
      }
      // Retrieve todos associated with the authenticated user
      const todos = await Todo.find({ userId: user.id });
      return todos;
    },
    todosByUserId: async (_, { userId }) => {
      // Retrieve todos associated with a specific user
      const todos = await Todo.find({ userId });
      return todos;
    },
    todos: async () => {
      // Retrieve all todos
      const todos = await Todo.find();
      return todos;
    },
    users: async () => {
      // Retrieve all users
      const users = await User.find();
      return users;
    },
    userById: async (_, { id }) => {
      try {
        // Retrieve the user by ID from the database
        const user = await User.findById(id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
  },

  Mutation: {
    signUp: async (_, { username, email, password }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('Email already exists');
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT token for the new user
        const token = generateToken({ userId: newUser._id });

        return {
          user: newUser,
          token,
        };
      } catch (error) {
        throw new Error(`Failed to sign up: ${error.message}`);
      }
    },
    signIn: async (_, { email, password }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not found');
        }

        // Compare passwords
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
          throw new Error('Invalid password');
        }

        // Generate JWT token for the user
        const token = generateToken({ userId: user._id });

        return {
          user,
          token,
        };
      } catch (error) {
        throw new Error(`Failed to sign in: ${error.message}`);
      }
    },
    addTodo: async (_, { text, userId }) => {
      try {
        // Create a new todo using the Todo model
        const todo = new Todo({
          text,
          completed: false,
          userId, // Assign the todo to the user
        });
        // Save the new todo to the database
        await todo.save();
        return todo;
      } catch (err) {
        // Handle errors
        throw new Error('Failed to add todo');
      }
    },
    updateTodo: async (_, { id, text, completed }, { user }) => {
      if (!user) {
        throw new Error('Unauthorized: User not authenticated');
      }

      try {
        // Check if the todo belongs to the authenticated user
        const todo = await Todo.findById(id);
        if (!todo) {
          throw new Error('Todo not found');
        }
        if (todo.userId !== user.id) {
          throw new Error('Unauthorized: Access denied');
        }

        // Update the todo with the provided data
        if (text !== undefined) {
          todo.text = text;
        }
        if (completed !== undefined) {
          todo.completed = completed;
        }

        // Save the updated todo to the database
        await todo.save();

        return todo;
      } catch (error) {
        throw new Error(`Failed to update todo: ${error.message}`);
      }
    },

      // Resolver function for deleting an existing todo
      deleteTodo: async (_, { id }, context) => {
        // Check authentication before proceeding
        authenticate(context);
  
        try {
          // Find the todo by ID and delete it
          const todo = await Todo.findByIdAndDelete(id);
          return todo;
        } catch (err) {
          // Handle errors if deleting todo fails
          throw new Error('Failed to delete todo');
        }
      },
    }
}    

module.exports = resolvers;