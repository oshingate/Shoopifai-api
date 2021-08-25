const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  bio: { type: String, default: null },
  image: { type: String, default: null },
});

userSchema.pre('save', async function (req, res, next) {
  try {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.SECRET)
    );
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    next(error);
  }
};

userSchema.methods.createToken = async function () {
  try {
    let payload = {
      email: this.email,
      username: this.username,
      bio: this.bio,
      image: this.image,
    };

    let token = await jwt.sign(payload, process.env.SECRET_TOKEN);
    return token;
  } catch (error) {
    return error;
  }
};

let User = mongoose.model('User', userSchema);

module.exports = User;
