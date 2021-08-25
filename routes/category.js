var express = require('express');
var Category = require('../models/Category');
var Auth = require('../middlewares/Auth');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  let categories = await Category.find({});
  res.json({ success: true, productCategories: categories });
});

//create category
router.post('/', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let data = req.body;
    let createdCategory = await Category.create(data);

    res.json({ isSucess: true, productCategory: createdCategory });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
