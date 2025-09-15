import React from 'react';

export default function CumulativeView({ cumulative }) {
  if (!cumulative) return <div className="card">Loading cumulative...</div>;
  
  const summary = cumulative.summary || cumulative;
  const totalPnl = (summary.totalRealized || 0) + (summary.totalUnrealized || 0);
  
  return (
    <div className="card">
      <h2>Portfolio Summary</h2>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
        <div>
          <p><strong>Total Assets:</strong> <span style={{color: 'blue'}}>${Number(summary.totalAssets || 0).toFixed(2)}</span></p>
          <p><strong>Total Balance:</strong> ${Number(summary.totalBalance || 0).toFixed(2)}</p>
          <p><strong>Total Collateral:</strong> ${Number(summary.totalCollateral || 0).toFixed(2)}</p>
          <p><strong>Positions Value:</strong> ${Number(summary.totalPositionsValue || 0).toFixed(2)}</p>
        </div>
        <div>
          <p><strong>Total PnL:</strong> <span style={{color: totalPnl >= 0 ? 'green' : 'red'}}>${totalPnl.toFixed(2)}</span></p>
          <p><strong>Realized PnL:</strong> <span style={{color: (summary.totalRealized || 0) >= 0 ? 'green' : 'red'}}>${Number(summary.totalRealized || 0).toFixed(2)}</span></p>
          <p><strong>Unrealized PnL:</strong> <span style={{color: (summary.totalUnrealized || 0) >= 0 ? 'green' : 'red'}}>${Number(summary.totalUnrealized || 0).toFixed(2)}</span></p>
          <p><strong>Accounts:</strong> {summary.accountCount || 0} | <strong>Positions:</strong> {summary.totalPositions || 0}</p>
        </div>
      </div>
      
      <h3>Net Position Sizes by Symbol</h3>
      <div style={{maxHeight: '150px', overflowY: 'auto'}}>
        {cumulative.groupedPositionSizes && Object.entries(cumulative.groupedPositionSizes).length > 0 ? (
          <table className="table" style={{fontSize: '0.9em'}}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Net Size</th>
                <th>Net Value</th>
                <th>Unrealized PnL</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cumulative.groupedPositionSizes).map(([symbol, size]) => {
                const details = cumulative.detailedPositions?.[symbol];
                return (
                  <tr key={symbol}>
                    <td>{symbol}</td>
                    <td style={{color: size >= 0 ? 'green' : 'red'}}>{Number(size).toFixed(4)}</td>
                    <td>${(details?.totalValue || 0).toFixed(2)}</td>
                    <td style={{color: (details?.totalUnrealized || 0) >= 0 ? 'green' : 'red'}}>
                      ${(details?.totalUnrealized || 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No open positions</p>
        )}
      </div>
    </div>
  );
}
