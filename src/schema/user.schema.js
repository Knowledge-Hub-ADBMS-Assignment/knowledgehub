const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    }
  },
  password: {
    type: String,
    required: true
  }
}, {versionKey: false});

const User = mongoose.model('User', userSchema);
module.exports = {userSchema, User};
