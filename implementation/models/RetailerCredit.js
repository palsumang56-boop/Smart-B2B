const mongoose = require('mongoose');

const retailerCreditSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditLimit: { type: Number, required: true },
  outstandingBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('RetailerCredit', retailerCreditSchema);