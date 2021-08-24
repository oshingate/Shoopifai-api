const mongoose = require('mongoose');

let Schema = mongoose.Schema;

userSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  bio: String,
  image: { type: String, default: null },
});

let User = mongoose.model('User', userSchema);

module.exports = User;
