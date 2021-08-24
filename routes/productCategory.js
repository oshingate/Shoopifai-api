var express = require('express');
var ProductCategory = require('../models/ProductCategory');

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  let categories = await ProductCategory.find({});
  res.json({ success: true, productCategories: categories });
});

//create category
router.post('/', async function (req, res, next) {
  try {
    let data = req.body;
    let createdCategory = await ProductCategory.create(data);

    res.json({ isSucess: true, productCategory: createdCategory });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
