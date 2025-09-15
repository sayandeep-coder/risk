import React, { useState, useEffect } from 'react';

const History = ({ accountId, selectedDate, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    if (accountId && selectedDate) {
      loadHistoricalData();
    }
  }, [accountId, selectedDate]);

  const loadHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock historical data - replace with actual API call
      const mockData = {
        account: {
          accountId: accountId,
          name: `Account ${accountId}`,
          date: selectedDate,
          balance: 10000 + Math.random() * 5000,
          collateral: 8000 + Math.random() * 3000,
          totalAssets: 15000 + Math.random() * 7000,
          realizedPnl: (Math.random() - 0.5) * 2000,
          unrealizedPnl: (Math.random() - 0.5) * 1500,
        },
        positions: [
          {
            symbol: 'BTCUSDT',
            side: 'Buy',
            size: 0.5 + Math.random() * 0.5,
            entryPrice: 45000 + Math.random() * 5000,
            markPrice: 46000 + Math.random() * 4000,
            pnl: (Math.random() - 0.5) * 1000,
            timestamp: new Date(selectedDate + 'T10:30:00Z').toISOString()
          },
          {
            symbol: 'ETHUSDT',
            side: 'Sell',
            size: 2 + Math.random() * 3,
            entryPrice: 3000 + Math.random() * 500,
            markPrice: 2950 + Math.random() * 400,
            pnl: (Math.random() - 0.5) * 500,
            timestamp: new Date(selectedDate + 'T14:15:00Z').toISOString()
          }
        ],
        pnlHistory: [
          {
            date: selectedDate,
            totalAssets: 15000 + Math.random() * 7000,
            realizedPnl: (Math.random() - 0.5) * 2000,
            unrealizedPnl: (Math.random() - 0.5) * 1500,
            balance: 10000 + Math.random() * 5000,
            collateral: 8000 + Math.random() * 3000
          }
        ]
      };
      
      // Calculate total PnL
      mockData.account.totalPnl = mockData.account.realizedPnl + mockData.account.unrealizedPnl;
      mockData.pnlHistory[0].totalPnl = mockData.pnlHistory[0].realizedPnl + mockData.pnlHistory[0].unrealizedPnl;
      
      setHistoryData(mockData);
    } catch (err) {
      setError(`Failed to load historical data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;
  const formatNumber = (value, decimals = 4) => Number(value || 0).toFixed(decimals);
  
  const getPnlColor = (value) => {
    const num = Number(value || 0);
    if (num > 0) return '#28a745';
    if (num < 0) return '#dc3545';
    return '#007bff';
  };

  const SummaryCard = ({ label, value, isAmount = true }) => (
    <div style={{
      background: '#f8f9fa',
      padding: '15px',
      borderRadius: '6px',
      borderLeft: '4px solid #667eea'
    }}>
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '5px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: getPnlColor(value)
      }}>
        {isAmount ? formatCurrency(value) : formatNumber(value)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ color: 'black' }}>Loading historical data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <strong>Error:</strong> {error}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          background: 'black',
          color: 'white',
          padding: '20px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Account History</h2>
            <div style={{ opacity: 0.9, marginTop: '5px' }}>
              Account: {historyData?.account?.name} | Date: {selectedDate}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '25px' }}>
          {/* Account Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: 'black',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              Account Summary for Selected Date
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <SummaryCard label="Total Assets" value={historyData?.account?.totalAssets} />
              <SummaryCard label="Balance" value={historyData?.account?.balance} />
              <SummaryCard label="Collateral" value={historyData?.account?.collateral} />
              <SummaryCard label="Realized PnL" value={historyData?.account?.realizedPnl} />
              <SummaryCard label="Unrealized PnL" value={historyData?.account?.unrealizedPnl} />
              <SummaryCard label="Total PnL" value={historyData?.account?.totalPnl} />
            </div>
          </div>

          {/* Historical Positions */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: 'black',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              Historical Positions
            </h3>
            {historyData?.positions?.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '15px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Symbol</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Side</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Size</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Entry Price</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Mark Price</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>PnL</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.positions.map((position, index) => (
                      <tr key={index} style={{ ':hover': { backgroundColor: '#f8f9fa' } }}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          <strong>{position.symbol}</strong>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: position.side === 'Buy' ? '#28a745' : '#dc3545' }}>
                            {position.side}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {formatNumber(position.size)}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {formatCurrency(position.entryPrice)}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {formatCurrency(position.markPrice)}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: getPnlColor(position.pnl) }}>
                            {formatCurrency(position.pnl)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {new Date(position.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'black',
                fontStyle: 'italic'
              }}>
                No positions found for the selected date.
              </div>
            )}
          </div>

          {/* PnL History */}
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              marginBottom: '20px',
              color: 'black',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              PnL History
            </h3>
            {historyData?.pnlHistory?.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '15px'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Total Assets</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Realized PnL</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Unrealized PnL</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Total PnL</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Balance</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', color: 'black' }}>Collateral</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.pnlHistory.map((record, index) => (
                      <tr key={index}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: '#007bff' }}>{formatCurrency(record.totalAssets)}</span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: getPnlColor(record.realizedPnl) }}>
                            {formatCurrency(record.realizedPnl)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: getPnlColor(record.unrealizedPnl) }}>
                            {formatCurrency(record.unrealizedPnl)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          <span style={{ color: getPnlColor(record.totalPnl) }}>
                            {formatCurrency(record.totalPnl)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {formatCurrency(record.balance)}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', color: 'black' }}>
                          {formatCurrency(record.collateral)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'black',
                fontStyle: 'italic'
              }}>
                No PnL history found for the selected date.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
