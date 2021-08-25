const mongoose = require('mongoose');
const slugger = require('slugger');

let Schema = mongoose.Schema;

ProductSchema = new Schema({
  name: { type: String, unique: true, require: true },
  slug: { type: String },
  description: { type: String },
  image: { type: String },
  vendor: { type: String },
  tags: [{ type: String }],
  collections: [{ type: String }],
  category_id: { type: mongoose.Types.ObjectId, ref: 'Category' },
});

ProductSchema.pre('save', async function (req, res, next) {
  try {
    this.slug = slugger(this.name);

    next();
  } catch (error) {
    return next(error);
  }
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
