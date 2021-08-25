var express = require('express');
var Category = require('../models/Category');
var Auth = require('../middlewares/Auth');
const Product = require('../models/Product');

var router = express.Router();

/* create new Product */
router.post('/', async function (req, res, next) {
  try {
    let data = req.body;
    data.tags = data.tags.split(',').map((ele) => {
      return ele.trim().toLowerCase();
    });

    let product = await Product.findOne({ name: data.name });
    if (product) {
      return res.status(400).json({ error: 'Product already exists' });
    }

    let newProduct = await Product.create(data);

    let updatedCategory = await Category.findByIdAndUpdate(
      {
        _id: data.category_id,
      },
      { $push: { products: newProduct._id } }
    );

    res.status(200).json({ product: newProduct });
  } catch (error) {
    next(error);
  }
});

//delete product

router.delete('/:slug', async function (req, res, next) {
  let slug = req.params.slug;

  try {
    let product = await Product.findOne({ slug });
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    deletedProduct = await Product.findOneAndDelete({ slug });

    let updatedCategory = await Category.findByIdAndUpdate(
      {
        _id: deletedProduct.category_id,
      },
      { $pull: { products: deletedProduct._id } }
    );

    return res.status(200).json({ product: deletedProduct });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
