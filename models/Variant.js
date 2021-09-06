const mongoose = require('mongoose');
const slugger = require('slugger');

let Schema = mongoose.Schema;

VariantSchema = new Schema(
  {
    productName: { type: String, require: true },
    size: { type: String, default: null },
    colour: { type: String, default: null },
    style: { type: String, default: null },
    material: { type: String, default: null },

    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true }
);

let Variant = mongoose.model('Variant', VariantSchema);

module.exports = Variant;
