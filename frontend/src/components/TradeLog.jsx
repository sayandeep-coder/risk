import React from 'react';
import { motion } from 'framer-motion';

const TradeLog = ({ trades, title = "Trade Log" }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'filled': return '#00ff88';
      case 'partial': return '#ffa500';
      case 'cancelled': return '#ff4757';
      case 'pending': return '#8b949e';
      default: return '#fff';
    }
  };

  const getSideColor = (side) => {
    return side?.toLowerCase() === 'buy' ? '#00ff88' : '#ff4757';
  };

  return (
    <div style={{
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #30363d',
        background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)'
      }}>
        <h3 style={{
          color: '#fff',
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 {title}
          <span style={{
            backgroundColor: '#00ff88',
            color: '#000',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: '500'
          }}>
            {trades.length}
          </span>
        </h3>
      </div>
      
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto',
        overflowX: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#161b22', zIndex: 1 }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Time
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Trader
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Symbol
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Side
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Size
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Price
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Value
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', color: '#8b949e', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #30363d' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <motion.tr
                key={trade.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{
                  backgroundColor: '#161b22',
                  transition: { duration: 0.2 }
                }}
                style={{
                  borderBottom: '1px solid #21262d'
                }}
              >
                <td style={{ padding: '12px 16px', color: '#8b949e', fontSize: '12px', fontFamily: 'monospace' }}>
                  {formatTimestamp(trade.timestamp)}
                </td>
                <td style={{ padding: '12px 16px', color: '#fff', fontSize: '13px', fontWeight: '500' }}>
                  {trade.trader}
                </td>
                <td style={{ padding: '12px 16px', color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                  {trade.symbol}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    color: getSideColor(trade.side),
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${getSideColor(trade.side)}15`,
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {trade.side}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
                  {trade.size}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
                  {formatCurrency(trade.price)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontSize: '13px', fontFamily: 'monospace', fontWeight: '600' }}>
                  {formatCurrency(trade.value)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    color: getStatusColor(trade.status),
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: `${getStatusColor(trade.status)}15`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {trade.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {trades.length === 0 && (
        <div style={{
          padding: '40px 24px',
          textAlign: 'center',
          color: '#8b949e',
          fontSize: '14px'
        }}>
          No trades found
        </div>
      )}
    </div>
  );
};

export default TradeLog;
