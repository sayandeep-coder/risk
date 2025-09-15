import React from 'react';
import { motion } from 'framer-motion';

const ModernCard = ({ 
  title, 
  value, 
  change, 
  changePercent, 
  icon, 
  trend = 'neutral',
  children,
  className = '',
  onClick
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#00ff88';
      case 'down': return '#ff4757';
      default: return '#888';
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${getTrendColor()}, transparent)`
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{
              color: '#8b949e',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {title}
            </div>
          )}
          
          {value && (
            <div style={{
              color: '#fff',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '4px',
              fontFamily: 'monospace'
            }}>
              {value}
            </div>
          )}
          
          {(change || changePercent) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: getTrendColor()
            }}>
              <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
              {change && <span>{change}</span>}
              {changePercent && <span>({changePercent}%)</span>}
            </div>
          )}
        </div>
        
        {icon && (
          <div style={{
            color: getTrendColor(),
            fontSize: '24px',
            opacity: 0.7
          }}>
            {icon}
          </div>
        )}
      </div>
      
      {children}
    </motion.div>
  );
};

export default ModernCard;
