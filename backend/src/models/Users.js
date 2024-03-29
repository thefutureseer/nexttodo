const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'user' });

const User = mongoose.model('User', userSchema);

module.exports = User;
