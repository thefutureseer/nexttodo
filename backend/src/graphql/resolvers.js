const Todo = require('../models/Todo'); // Assuming Todo model is defined in Todo.js
const { authenticate } = require('./auth');

// Define resolver functions
const resolvers = {
  Query: {
    // Resolver function for querying todos
    todos: async (_, { userId }, context) => {
      // Check authentication before proceeding
      authenticate(context);

      try {
        // Fetch todos associated with the authenticated user
        const todos = await Todo.find({ userId });
        return todos;
      } catch (err) {
        // Handle errors if fetching todos fails
        throw new Error('Failed to fetch todos');
      }
    },
  },

  Mutation: {
    // Resolver function for adding a new todo
    addTodo: async (_, { text }, context) => {
      // Check authentication before proceeding
      authenticate(context);

      try {
        // Create a new todo instance with provided text and associate it with the authenticated user
        const todo = new Todo({
          text,
          completed: false,
          userId: context.user.id, // Associate todo with authenticated user
        });
        // Save the new todo to the database
        await todo.save();
        return todo;
      } catch (err) {
        // Handle errors if adding todo fails
        throw new Error('Failed to add todo');
      }
    },
    updateTodo: async (_, { id, text, completed }, context) => {
      // Check authentication
      authenticate(context);
    
      try {
        // Initialize an empty object to store update fields
        const updateFields = {};
    
        // Check if 'text' parameter is provided in the mutation input
        // If provided, add it to the updateFields object
        if (text !== undefined) {
          updateFields.text = text;
        }
    
        // Check if 'completed' parameter is provided in the mutation input
        // If provided, add it to the updateFields object
        if (completed !== undefined) {
          updateFields.completed = completed;
        }
    
        // Use the updateFields object to update the corresponding fields of the todo in the database
        // The 'new: true' option ensures that the updated todo is returned after the update operation
        const todo = await Todo.findByIdAndUpdate(id, updateFields, { new: true });
    
        // Return the updated todo
        return todo;
      } catch (err) {
        // Throw an error if the update operation fails
        throw new Error('Failed to update todo');
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
  },
};

module.exports = resolvers;
