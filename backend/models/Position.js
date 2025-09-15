const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
  accountId: { type: String, required: true, index: true },
  symbol: { type: String, required: true },
  size: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },
  margin: { type: Number, default: 0 },
  unrealizedPnl: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Position', PositionSchema);
