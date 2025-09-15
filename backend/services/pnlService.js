const Position = require('../models/Position');
const Account = require('../models/Account');
const PnlSnapshot = require('../models/PnlSnapshot');

function computeUnrealized(position) {
  const diff = (position.currentPrice - position.entryPrice);
  return diff * position.size;
}

function computePositionValue(position) {
  return Math.abs(position.size) * position.currentPrice;
}

async function computeAccountPnL(accountId) {
  const account = await Account.findOne({ accountId }).lean();
  if (!account) {
    throw new Error(`Account ${accountId} not found`);
  }
  
  const positions = await Position.find({ accountId, isOpen: true }).lean();

  let unrealized = 0;
  let positionsValue = 0;
  let cumulativePositionSize = {};
  
  
  for (const pos of positions) {
    const u = computeUnrealized(pos);
    const posValue = computePositionValue(pos);
    
    unrealized += u;
    positionsValue += posValue;
    
  
    if (!cumulativePositionSize[pos.symbol]) {
      cumulativePositionSize[pos.symbol] = 0;
    }
    cumulativePositionSize[pos.symbol] += pos.size;
    
    
    await Position.findByIdAndUpdate(pos._id, { unrealizedPnl: u });
  }

  const balance = account.balance || 0;
  const collateral = account.collateral || 0;
  const realized = account.realizedPnl || 0;
  
  
  const totalAssets = balance + collateral + positionsValue;
  const totalPnl = realized + unrealized;

  
  await Account.findOneAndUpdate(
    { accountId },
    {
      unrealizedPnl: unrealized,
      totalAssets: totalAssets,
      totalPnl: totalPnl,
      updatedAt: new Date()
    }
  );

  
  const snap = new PnlSnapshot({
    accountId,
    realizedPnl: realized,
    unrealizedPnl: unrealized,
    totalAssets
  });
  await snap.save();

  return {
    accountId,
    name: account.name,
    balance,
    collateral,
    realizedPnl: realized,
    unrealizedPnl: unrealized,
    totalPnl,
    totalAssets,
    openPositions: positions.map(pos => ({
      ...pos,
      unrealizedPnl: computeUnrealized(pos),
      positionValue: computePositionValue(pos)
    })),
    cumulativePositionSize,
    positionsValue
  };
}

async function computeCumulative() {
  const accounts = await Account.find().lean();
  const allPositions = await Position.find({ isOpen: true }).lean();

  let totalBalance = 0;
  let totalCollateral = 0;
  let totalRealized = 0;
  let totalUnrealized = 0;
  let totalPositionsValue = 0;
  let groupedPositions = {};
  let accountSummaries = [];

  
  for (const acct of accounts) {
    const balance = acct.balance || 0;
    const collateral = acct.collateral || 0;
    const realized = acct.realizedPnl || 0;
    
    totalBalance += balance;
    totalCollateral += collateral;
    totalRealized += realized;
    
   
    const accountPositions = allPositions.filter(p => p.accountId === acct.accountId);
    let accountUnrealized = 0;
    let accountPositionsValue = 0;
    
    for (const pos of accountPositions) {
      const unrealized = computeUnrealized(pos);
      const posValue = computePositionValue(pos);
      accountUnrealized += unrealized;
      accountPositionsValue += posValue;
    }
    
    accountSummaries.push({
      accountId: acct.accountId,
      name: acct.name,
      balance,
      collateral,
      realizedPnl: realized,
      unrealizedPnl: accountUnrealized,
      totalPnl: realized + accountUnrealized,
      totalAssets: balance + collateral + accountPositionsValue,
      positionsValue: accountPositionsValue,
      positionCount: accountPositions.length
    });
  }

  
  for (const p of allPositions) {
    const unrealized = computeUnrealized(p);
    const posValue = computePositionValue(p);
    
    totalUnrealized += unrealized;
    totalPositionsValue += posValue;
    
   
    if (!groupedPositions[p.symbol]) {
      groupedPositions[p.symbol] = {
        totalSize: 0,
        totalValue: 0,
        totalUnrealized: 0,
        positions: []
      };
    }
    
    groupedPositions[p.symbol].totalSize += p.size;
    groupedPositions[p.symbol].totalValue += posValue;
    groupedPositions[p.symbol].totalUnrealized += unrealized;
    groupedPositions[p.symbol].positions.push({
      accountId: p.accountId,
      size: p.size,
      entryPrice: p.entryPrice,
      currentPrice: p.currentPrice,
      unrealizedPnl: unrealized,
      positionValue: posValue
    });
  }

  const totalAssets = totalBalance + totalCollateral + totalPositionsValue;
  const totalPnl = totalRealized + totalUnrealized;

  return {
    summary: {
      totalAssets,
      totalBalance,
      totalCollateral,
      totalPositionsValue,
      totalRealized,
      totalUnrealized,
      totalPnl,
      accountCount: accounts.length,
      totalPositions: allPositions.length
    },
    accounts: accountSummaries,
    groupedPositionSizes: Object.fromEntries(
      Object.entries(groupedPositions).map(([symbol, data]) => [symbol, data.totalSize])
    ),
    detailedPositions: groupedPositions,
    openPositions: allPositions.map(pos => ({
      ...pos,
      unrealizedPnl: computeUnrealized(pos),
      positionValue: computePositionValue(pos)
    }))
  };
}

module.exports = { computeUnrealized, computePositionValue, computeAccountPnL, computeCumulative };
