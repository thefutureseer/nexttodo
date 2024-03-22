// Bring in mongoose
const mongoose = require('mongoose');

// Define the schema with types and best practices
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{ collection: 'todo' });

// Create the model
const Todo = mongoose.model('Todo', todoSchema);

// Export the model
module.exports = Todo;
