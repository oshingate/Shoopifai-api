var express = require('express');
var Category = require('../models/Category');
var Auth = require('../middlewares/Auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Collection = require('../models/Collections');

var router = express.Router();

//get list of all collections

router.get('/', async function (req, res, next) {
  try {
    let collections = await Collection.find({});
    return res.status(200).json({ collections });
  } catch (error) {
    next(error);
  }
});

//create new collection

router.post('/', Auth.isLoggedIn, async function (req, res, next) {
  let data = req.body;
  data.createdBy = req.user._id;

  if (data.name === '') {
    return res.json({ error: 'name of collection is required' });
  }
  let newCollection = await Collection.create(data);

  return res.status(200).json({ collection: newCollection });
});

module.exports = router;
