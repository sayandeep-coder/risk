import React from 'react';
import { motion } from 'framer-motion';

const ModernTable = ({ data, columns, title, onRowClick }) => {
  const formatValue = (value, type) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(value);
    }
    if (type === 'number') {
      return new Intl.NumberFormat('en-US').format(value);
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    return value;
  };

  const getCellColor = (value, column) => {
    if (column.colorize && typeof value === 'number') {
      return value > 0 ? '#00ff88' : value < 0 ? '#ff4757' : '#8b949e';
    }
    return '#fff';
  };

  // Check if we're on mobile
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Mobile card layout
    return (
      <div style={{
        display: 'grid',
        gap: '12px'
      }}>
        {title && (
          <h3 style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0'
          }}>
            {title}
          </h3>
        )}
        {data.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.05 }}
            onClick={() => onRowClick && onRowClick(row)}
            style={{
              backgroundColor: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '12px',
              padding: '16px',
              cursor: onRowClick ? 'pointer' : 'default'
            }}
          >
            {columns.map((column, colIndex) => {
              const value = row[column.key];
              const formattedValue = formatValue(value, column.type);
              const cellColor = getCellColor(value, column);
              
              return (
                <div key={colIndex} style={{ marginBottom: '8px' }}>
                  <div style={{
                    color: '#8b949e',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    {column.header}
                  </div>
                  <div style={{
                    color: cellColor,
                    fontSize: '14px',
                    fontWeight: column.bold ? '600' : '400',
                    fontFamily: column.type === 'currency' || column.type === 'number' ? 'monospace' : 'inherit'
                  }}>
                    {column.render ? column.render(value, row) : formattedValue}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div style={{
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {title && (
        <div style={{
          padding: '20px 24px 0',
          borderBottom: '1px solid #30363d'
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 20px 0'
          }}>
            {title}
          </h3>
        </div>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#161b22' }}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    padding: '12px 16px',
                    textAlign: column.align || 'left',
                    color: '#8b949e',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid #30363d',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                whileHover={{
                  backgroundColor: '#161b22',
                  transition: { duration: 0.2 }
                }}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid #21262d'
                }}
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key];
                  const formattedValue = formatValue(value, column.type);
                  const cellColor = getCellColor(value, column);
                  
                  return (
                    <td
                      key={colIndex}
                      style={{
                        padding: '12px 16px',
                        textAlign: column.align || 'left',
                        color: cellColor,
                        fontSize: '13px',
                        fontWeight: column.bold ? '600' : '400',
                        fontFamily: column.type === 'currency' || column.type === 'number' ? 'monospace' : 'inherit',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {column.render ? column.render(value, row) : formattedValue}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModernTable;
