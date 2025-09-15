import React from 'react';

const TradingViewWidget = ({ symbol = 'BTCUSD', height = 400 }) => {
  return (
    <div style={{
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>📈</span>
        <span>Advanced Chart - {symbol}</span>
      </div>
      
      {/* Simulated candlestick chart */}
      <div style={{
        height: height,
        backgroundColor: '#000',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-around',
        padding: '20px'
      }}>
        {/* Grid lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 30px'
        }} />
        
        {/* Simulated candlesticks */}
        {Array.from({ length: 20 }, (_, i) => {
          const isGreen = Math.random() > 0.5;
          const height = Math.random() * 60 + 20;
          return (
            <div
              key={i}
              style={{
                width: '8px',
                height: `${height}%`,
                backgroundColor: isGreen ? '#00ff88' : '#ff4757',
                borderRadius: '1px',
                position: 'relative',
                opacity: 0.8 + (i / 20) * 0.2
              }}
            >
              {/* Wick */}
              <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: `${Math.random() * 20 + 10}px`,
                backgroundColor: isGreen ? '#00ff88' : '#ff4757',
                top: `-${Math.random() * 10 + 5}px`
              }} />
            </div>
          );
        })}
        
        {/* Price line */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          <path
            d={`M 0 ${height * 0.6} Q ${height * 0.25} ${height * 0.4} ${height * 0.5} ${height * 0.5} T ${height} ${height * 0.3}`}
            stroke="#00ff88"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
        </svg>
        
        {/* Price indicator */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '20px',
          backgroundColor: '#00ff88',
          color: '#000',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'monospace'
        }}>
          $43,250.00
        </div>
      </div>
      
      {/* Chart controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        padding: '10px 0'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
            <button
              key={timeframe}
              style={{
                padding: '6px 12px',
                backgroundColor: timeframe === '1h' ? '#00ff88' : 'transparent',
                color: timeframe === '1h' ? '#000' : '#8b949e',
                border: '1px solid #30363d',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {timeframe}
            </button>
          ))}
        </div>
        
        <div style={{
          color: '#8b949e',
          fontSize: '12px',
          display: 'flex',
          gap: '15px'
        }}>
          <span>Vol: 1.2M</span>
          <span>24h: +2.45%</span>
        </div>
      </div>
    </div>
  );
};

export default TradingViewWidget;
