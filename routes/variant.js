var express = require('express');
var Category = require('../models/Category');
var Auth = require('../middlewares/Auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Collection = require('../models/Collections');
const Variant = require('../models/Variant');
const { findByIdAndDelete } = require('../models/Category');

var router = express.Router();

//get all variants created by logged User

router.get('/', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let userId = req.user._id;

    let variants = await Variant.find({ createdBy: userId });

    res.json({ variants });
  } catch (error) {
    next(error);
  }
});

//get list of variants of perticular product

router.get('/:productId', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let productId = req.params.productId;

    let product = await Product.findById(productId).populate('variants');

    res.json({ variants: product.variants });
  } catch (error) {
    next(error);
  }
});

// create new variant

router.post('/', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let data = req.body;
    let preVariant = await Variant.findOne(data);
    if (preVariant) {
      return res.json({ error: 'variant is already present !!!' });
    }
    let product = await Product.findOne({ name: data.productName });
    if (!product) {
      return res.json({ error: 'product not found !!!' });
    }
    data.product = product._id;
    data.createdBy = req.user._id;

    let variant = await Variant.create(data);

    let updatedProduct = await Product.findOneAndUpdate(
      { name: variant.productName },
      { $push: { variants: variant._id } }
    );

    return res.status(200).json({ variant });
  } catch (error) {
    next(error);
  }
});

// delete variant

router.delete('/remove/:id', Auth.isLoggedIn, async function (req, res, next) {
  try {
    let id = req.params.id;

    let variant = await Variant.findById(id);
    if (!variant) {
      return res.json({ error: 'variant not found !!!' });
    }

    let deletedVariant = await Variant.findByIdAndDelete(id);

    let updatedProduct = await Product.findOneAndUpdate(
      { name: deletedVariant.productName },
      { $pull: { variants: deletedVariant._id } }
    );

    return res.status(200).json({ variant: deletedVariant });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
