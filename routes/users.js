var express = require('express');
const auth = require('../middlewares/Auth');
const User = require('../models/User');
var router = express.Router();

/* User registeration */
router.post('/signup', async function (req, res, next) {
  let data = req.body;
  if (!data.username || !data.password || !data.email) {
    return res.json({
      error: {
        username: 'username cant be empty',
        email: 'email cant be empty',
        password: 'password cant be empty',
      },
    });
  }

  try {
    let user = await User.findOne({ email: data.email });
    if (user) {
      return res.json({
        error: { email: 'User already exists', username: '', password: '' },
      });
    }

    let newUser = await User.create(data);

    res.json({ user: newUser });
  } catch (error) {
    next(error);
  }
});

//user sign in

router.post('/login', async function (req, res, next) {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      error: { email: 'Email is required', password: 'Password is required' },
    });
  }
  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ error: { email: 'No User found !!!', password: '' } });
    }
    let result = await user.verifyPassword(password);
    if (!result) {
      return res.json({
        error: { email: '', password: 'Password is incorrect !!!' },
      });
    }

    let token = await user.createToken();

    return res.status(200).json({ user: user, token: token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', auth.isLoggedIn, async function (req, res, next) {
  res.json({ user: req.user });
});

module.exports = router;
