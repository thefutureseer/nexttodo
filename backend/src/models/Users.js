const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
}, { 
  collection: 'user',
});

userSchema.pre('save', async function(next){
  if(this.isNew || this.isModified(password)) {
    const salt = 10;
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isCorrectPassoword = async function(password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;
