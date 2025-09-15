import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ModernChart = ({ data, type = 'line', title, color = '#00ff88', height = 300 }) => {
  const chartProps = {
    width: '100%',
    height,
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id={`gradient-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#gradient-${color.slice(1)})`}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div style={{
      backgroundColor: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      {title && (
        <h3 style={{
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px',
          marginTop: '0'
        }}>
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ModernChart;
