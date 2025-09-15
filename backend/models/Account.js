const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  accountId: { type: String, required: true, unique: true },
  name: { type: String },
  balance: { type: Number, default: 0 },
  collateral: { type: Number, default: 0 },
  realizedPnl: { type: Number, default: 0 },
  unrealizedPnl: { type: Number, default: 0 },
  totalAssets: { type: Number, default: 0 },
  totalPnl: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', AccountSchema);
