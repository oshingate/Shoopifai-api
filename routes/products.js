var express = require('express');
var Category = require('../models/Category');
var Auth = require('../middlewares/Auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Collection = require('../models/Collections');

var router = express.Router();

// list of all products
router.get('/getList', Auth.isLoggedIn, async function (req, res, next) {
  let { selectedView } = req.query;
  console.log(req.query);
  let username = req.user.username;

  if (
    selectedView === 'draft' ||
    selectedView === 'active' ||
    selectedView === 'archived'
  ) {
    let activeProducts = await Product.find({
      product_status: selectedView,
      vendor: username,
    }).populate('category_id');
    return res.status(200).json({ products: activeProducts });
  }

  let allProducts = await Product.find({}).populate('category_id');
  return res.status(200).json({ products: allProducts, vendor: username });
});

/* create new Product */
router.post('/', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let data = req.body;
    if (data.name === '') {
      return res.json({ error: 'name is required' });
    }
    data.tags = data.tags.split(',').map((ele) => {
      return ele.trim().toLowerCase();
    });

    let product = await Product.findOne({ name: data.name });
    if (product) {
      return res.json({ error: 'Product already exists' });
    }

    // if (!data.has_variants) {
    //   delete data.variants;
    // } else {
    // }

    let newProduct = await Product.create(data);

    let updatedCategory = await Category.findByIdAndUpdate(
      {
        _id: data.category_id,
      },
      { $push: { products: newProduct._id } }
    );
    let updatedCollection = await Collection.findOneAndUpdate(
      {
        name: data.collections,
      },
      { $push: { products: newProduct._id } }
    );

    let updatedVendor = await User.findOneAndUpdate(
      { username: newProduct.vendor },
      { $push: { listedProducts: newProduct._id } }
    );

    res.status(200).json({ product: newProduct });
  } catch (error) {
    next(error);
  }
});

//delete product

router.delete('/:slug', Auth.isLoggedIn, async function (req, res, next) {
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
    let updatedCollection = await Collection.findByIdAndUpdate(
      {
        name: deletedProduct.collections,
      },
      { $pull: { products: deletedProduct._id } }
    );

    let updatedVendor = await User.findOneAndUpdate(
      { username: deletedProduct.vendor },
      { $pull: { listedProducts: deletedProduct._id } }
    );

    return res.status(200).json({ product: deletedProduct });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
