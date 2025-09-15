const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PnlSnapshotSchema = new Schema({
  accountId: { type: String },
  timestamp: { type: Date, default: Date.now },
  realizedPnl: Number,
  unrealizedPnl: Number,
  totalAssets: Number
});

module.exports = mongoose.model('PnlSnapshot', PnlSnapshotSchema);
