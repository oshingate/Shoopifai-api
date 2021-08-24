const mongoose = require('mongoose');
const slugger = require('slugger');

let Schema = mongoose.Schema;

productCategorySchema = new Schema({
  name: { type: String, unique: true, lowercase: true },
  slug: { type: String, unique: true },
  tax_percentage: Number,
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
});

productCategorySchema.pre('save', function (req, res, next) {
  this.slug = slugger(this.name);
  next();
});

let ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
