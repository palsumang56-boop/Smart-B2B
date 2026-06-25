const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  stockQuantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true },
  reservedStock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);