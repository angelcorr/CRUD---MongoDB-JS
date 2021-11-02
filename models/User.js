const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    minlength: [4, 'username is required to have at least 4 characters'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: {
      validator: (email) => isEmail(email),
      message: props => `${props.value} is not a valid email`,
    }
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    validate: {
      validator: (password) => isStrongPassword(password),
      message: props => `${props.value} is not an strong password`,
    }
  },
  posts: [{
    content: {
      type: String,
      required: [true, 'content is required'],
      maxlength: [240, 'content is too long, max is 240'],
    },
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', schema);
