var express = require('express');

var auth = require('../middlewares/Auth');
const Category = require('../models/Category');

var router = express.Router();

/* get all categories. */
router.get('/', async function (req, res, next) {
  let categories = await Category.find({});
  res.json({ success: true, productCategories: categories });
});

//create category
router.post('/', auth.isLoggedIn, async function (req, res, next) {
  try {
    let data = req.body;
    data.name = data.name.toLowerCase();

    let category = await Category.findOne({ name: data.name });
    if (category) {
      return res.json({ error: 'Category already exists' });
    }

    let createdCategory = await Category.create(data);

    return res.json({ isSucess: true, productCategory: createdCategory });
  } catch (error) {
    next(error);
  }
});

//delete Category

router.delete('/:slug', auth.isLoggedIn, async function (req, res, next) {
  let slug = req.params.slug;
  try {
    let category = await Category.findOne({ slug });
    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }
    let deletedCategory = await Category.findOneAndDelete({ slug });

    res.status(200).json({ category: deletedCategory });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
