const Account = require('../models/Account');
const Position = require('../models/Position');
const bybitClient = require('../api/bybitClient');

async function syncFromExchange(apiKey, apiSecret) {
  const balances = await bybitClient.fetchAccountBalances(apiKey, apiSecret);
  const positions = await bybitClient.fetchOpenPositions(apiKey, apiSecret);

  for (const b of balances) {
    await Account.findOneAndUpdate(
      { accountId: b.accountId },
      {
        accountId: b.accountId,
        name: b.name,
        balance: b.balance,
        collateral: b.collateral,
        realizedPnl: b.realizedPnl,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  }


  for (const p of positions) {
    const unrealizedPnl = (p.currentPrice - p.entryPrice) * p.size;
    
    await Position.findOneAndUpdate(
      { accountId: p.accountId, symbol: p.symbol, isOpen: true },
      {
        accountId: p.accountId,
        symbol: p.symbol,
        size: p.size,
        entryPrice: p.entryPrice,
        currentPrice: p.currentPrice,
        margin: p.margin,
        unrealizedPnl: unrealizedPnl,
        isOpen: true,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  }
  

  const currentSymbols = positions.map(p => `${p.accountId}-${p.symbol}`);
  await Position.updateMany(
    { 
      $expr: { 
        $not: { 
          $in: [{ $concat: ["$accountId", "-", "$symbol"] }, currentSymbols] 
        } 
      },
      isOpen: true 
    },
    { isOpen: false, updatedAt: new Date() }
  );

  return { accounts: balances.length, positions: positions.length };
}

module.exports = { syncFromExchange };
