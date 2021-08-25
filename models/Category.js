const mongoose = require('mongoose');
const slugger = require('slugger');

let Schema = mongoose.Schema;

CategorySchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String },
  tax_percentage: Number,
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
});

CategorySchema.pre('save', async function (req, res, next) {
  try {
    this.slug = await slugger(this.name);
    next();
  } catch (error) {
    next(error);
  }
});

let Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
