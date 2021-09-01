const mongoose = require('mongoose');
const slugger = require('slugger');

let Schema = mongoose.Schema;

CollectionSchema = new Schema({
  name: { type: String, unique: true },
  slug: { type: String },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
});

CollectionSchema.pre('save', async function (req, res, next) {
  try {
    this.slug = await slugger(this.name);
    next();
  } catch (error) {
    next(error);
  }
});

let Collection = mongoose.model('Collection', CollectionSchema);

module.exports = Collection;
