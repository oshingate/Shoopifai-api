const mongoose = require('mongoose');

let Schema = mongoose.Schema;

ProductSchema = new Schema({
  category: { type: String, require: true },
  name: { type: String, unique: true, lowercase: true },
  slug: { type: String, unique: true },
  tax_percentage: Number,
  products: [{ type: mongoose.Types.ObjectId, ref: Product }],
});

let Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
