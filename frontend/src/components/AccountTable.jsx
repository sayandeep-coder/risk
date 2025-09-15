import React from 'react';

const accountStyles = `
  @media (max-width: 768px) {
    .account-table .table {
      display: none !important;
    }
    .account-table .mobile-accounts {
      display: block !important;
    }
  }
  @media (min-width: 769px) {
    .account-table .table {
      display: table !important;
    }
    .account-table .mobile-accounts {
      display: none !important;
    }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('account-table-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'account-table-styles';
  styleSheet.textContent = accountStyles;
  document.head.appendChild(styleSheet);
}

export default function AccountTable({ accounts = [], onSelectAccount, selectedAccount }) {
  return (
    <div className="card account-table" style={{
      background: 'rgba(13, 17, 23, 0.8)',
      border: '1px solid #30363d',
      borderRadius: '12px',
      padding: '24px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 20px 0',
        background: 'linear-gradient(45deg, #00ff88, #0099ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>📊 Select Account</h2>
      <div style={{overflowX: 'auto', width: '100%'}}>
        <table className="table" style={{width: '100%', minWidth: '1000px', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{borderBottom: '2px solid #30363d'}}>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>ACCOUNT ID</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>NAME</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>BALANCE</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>COLLATERAL</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>REALIZED PNL</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>UNREALIZED PNL</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>TOTAL PNL</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>TOTAL ASSETS</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>RISK</th>
            <th style={{color: '#8b949e', fontSize: '12px', fontWeight: '600', padding: '12px', textAlign: 'left'}}>LAST ACTIVE</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(a => (
            <tr 
              key={a.accountId} 
              onClick={() => onSelectAccount && onSelectAccount(a.accountId)} 
              style={{
                cursor: 'pointer',
                backgroundColor: selectedAccount?.accountId === a.accountId ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                borderBottom: '1px solid #21262d',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.05)'
                }
              }}
              onMouseEnter={(e) => {
                if (selectedAccount?.accountId !== a.accountId) {
                  e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAccount?.accountId !== a.accountId) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <td style={{color: '#fff', padding: '12px', fontFamily: 'monospace', fontWeight: '600'}}>{a.accountId}</td>
              <td style={{color: '#fff', padding: '12px'}}>{a.name || 'N/A'}</td>
              <td style={{color: '#fff', padding: '12px', fontFamily: 'monospace'}}>${(a.balance || 0).toLocaleString()}</td>
              <td style={{color: '#fff', padding: '12px', fontFamily: 'monospace'}}>${(a.collateral || 0).toLocaleString()}</td>
              <td style={{color: (a.realizedPnl || 0) >= 0 ? '#00ff88' : '#ff4757', padding: '12px', fontFamily: 'monospace', fontWeight: '600'}}>
                ${(a.realizedPnl || 0).toLocaleString()}
              </td>
              <td style={{color: (a.unrealizedPnl || 0) >= 0 ? '#00ff88' : '#ff4757', padding: '12px', fontFamily: 'monospace', fontWeight: '600'}}>
                ${(a.unrealizedPnl || 0).toLocaleString()}
              </td>
              <td style={{color: ((a.realizedPnl || 0) + (a.unrealizedPnl || 0)) >= 0 ? '#00ff88' : '#ff4757', padding: '12px', fontFamily: 'monospace', fontWeight: '600'}}>
                ${((a.realizedPnl || 0) + (a.unrealizedPnl || 0)).toLocaleString()}
              </td>
              <td style={{color: '#0099ff', padding: '12px', fontFamily: 'monospace', fontWeight: '600'}}>${(a.totalAssets || 0).toLocaleString()}</td>
              <td style={{
                padding: '12px',
                color: a.riskLevel === 'High' ? '#ff4757' : 
                       a.riskLevel === 'Medium' ? '#ffa502' : '#00ff88',
                fontWeight: '600',
                textTransform: 'uppercase',
                fontSize: '12px',
                letterSpacing: '0.5px'
              }}>{a.riskLevel || 'Low'}</td>
              <td style={{
                color: '#8b949e',
                padding: '12px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {a.lastActive ? new Date(a.lastActive).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      
      {/* Mobile-friendly card layout */}
      <div className="mobile-accounts" style={{display: 'none'}}>
        {accounts.map(a => (
          <div key={a.accountId} 
               onClick={() => onSelectAccount && onSelectAccount(a.accountId)} 
               style={{
                 border: selectedAccount?.accountId === a.accountId ? '2px solid #00ff88' : '1px solid #30363d',
                 borderRadius: '12px',
                 padding: '16px',
                 marginBottom: '12px',
                 background: selectedAccount?.accountId === a.accountId ? 'rgba(0, 255, 136, 0.1)' : 'rgba(13, 17, 23, 0.8)',
                 backdropFilter: 'blur(10px)',
                 color: '#fff',
                 cursor: 'pointer',
                 boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                 transition: 'all 0.2s ease'
               }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <strong style={{color: '#fff', fontFamily: 'monospace', fontSize: '16px'}}>{a.accountId}</strong>
              <span style={{fontSize: '14px', color: '#8b949e'}}>{a.name || 'N/A'}</span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px'}}>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>BALANCE</div>
                <div style={{color: '#fff', fontFamily: 'monospace', fontWeight: '600'}}>${(a.balance || 0).toLocaleString()}</div>
              </div>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>COLLATERAL</div>
                <div style={{color: '#fff', fontFamily: 'monospace', fontWeight: '600'}}>${(a.collateral || 0).toLocaleString()}</div>
              </div>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>REALIZED PNL</div>
                <div style={{color: (a.realizedPnl || 0) >= 0 ? '#00ff88' : '#ff4757', fontFamily: 'monospace', fontWeight: '600'}}>
                  ${(a.realizedPnl || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>UNREALIZED PNL</div>
                <div style={{color: (a.unrealizedPnl || 0) >= 0 ? '#00ff88' : '#ff4757', fontFamily: 'monospace', fontWeight: '600'}}>
                  ${(a.unrealizedPnl || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>TOTAL PNL</div>
                <div style={{color: ((a.realizedPnl || 0) + (a.unrealizedPnl || 0)) >= 0 ? '#00ff88' : '#ff4757', fontFamily: 'monospace', fontWeight: '600'}}>
                  ${((a.realizedPnl || 0) + (a.unrealizedPnl || 0)).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{color: '#8b949e', fontSize: '12px', marginBottom: '4px'}}>TOTAL ASSETS</div>
                <div style={{color: '#0099ff', fontFamily: 'monospace', fontWeight: '600'}}>${(a.totalAssets || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
