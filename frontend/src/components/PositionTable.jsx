import React from 'react';

const styles = `
  @media (max-width: 768px) {
    .table {
      display: none !important;
    }
    .mobile-positions {
      display: block !important;
    }
  }
  @media (min-width: 769px) {
    .table {
      display: table !important;
    }
    .mobile-positions {
      display: none !important;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('position-table-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'position-table-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function PositionTable({ positions = [] }) {
  if (!positions.length) return <div className="card">No open positions</div>;
  return (
    <div className="card">
      <h3>Positions</h3>
      <div style={{overflowX: 'auto', width: '100%'}}>
        <table className="table" style={{width: '100%', minWidth: '600px'}}>
        <thead>
          <tr>
            <th>Account</th>
            <th>Symbol</th>
            <th>Size</th>
            <th>Entry Price</th>
            <th>Current Price</th>
            <th>Position Value</th>
            <th>Unrealized PnL</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p, i) => {
            const unrealized = (p.unrealizedPnl !== undefined) ? p.unrealizedPnl : ((p.currentPrice - p.entryPrice) * p.size);
            const positionValue = p.positionValue || (Math.abs(p.size) * p.currentPrice);
            return (
              <tr key={i}>
                <td>{p.accountId}</td>
                <td><strong>{p.symbol}</strong></td>
                <td style={{color: p.size >= 0 ? 'green' : 'red'}}>
                  {p.size > 0 ? '+' : ''}{Number(p.size).toFixed(4)}
                </td>
                <td>${Number(p.entryPrice).toFixed(2)}</td>
                <td>${Number(p.currentPrice).toFixed(2)}</td>
                <td>${Number(positionValue).toFixed(2)}</td>
                <td style={{color: unrealized >= 0 ? 'green' : 'red'}}>
                  ${Number(unrealized).toFixed(2)}
                </td>
                <td>${Number(p.margin || 0).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
      
      {/* Mobile-friendly card layout for small screens */}
      <div className="mobile-positions" style={{display: 'none'}}>
        {positions.map((p, i) => {
          const unrealized = (p.unrealizedPnl !== undefined) ? p.unrealizedPnl : ((p.currentPrice - p.entryPrice) * p.size);
          const positionValue = p.positionValue || (Math.abs(p.size) * p.currentPrice);
          return (
            <div key={i} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: '#ffffff',
              color: '#333333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <strong style={{color: '#333'}}>{p.symbol}</strong>
                <span style={{fontSize: '0.9em', color: '#666'}}>{p.accountId}</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9em', color: '#333'}}>
                <div>
                  <strong style={{color: '#333'}}>Size:</strong> <span style={{color: p.size >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold'}}>
                    {p.size > 0 ? '+' : ''}{Number(p.size).toFixed(4)}
                  </span>
                </div>
                <div>
                  <strong style={{color: '#333'}}>Entry:</strong> <span style={{color: '#333'}}>${Number(p.entryPrice).toFixed(2)}</span>
                </div>
                <div>
                  <strong style={{color: '#333'}}>Current:</strong> <span style={{color: '#333'}}>${Number(p.currentPrice).toFixed(2)}</span>
                </div>
                <div>
                  <strong style={{color: '#333'}}>Value:</strong> <span style={{color: '#007bff', fontWeight: 'bold'}}>${Number(positionValue).toFixed(2)}</span>
                </div>
                <div>
                  <strong style={{color: '#333'}}>PnL:</strong> <span style={{color: unrealized >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold'}}>
                    ${Number(unrealized).toFixed(2)}
                  </span>
                </div>
                <div>
                  <strong style={{color: '#333'}}>Margin:</strong> <span style={{color: '#333'}}>${Number(p.margin || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
