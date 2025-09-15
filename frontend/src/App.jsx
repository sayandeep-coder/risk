import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AccountTable from './components/AccountTable';
import CumulativeView from './components/CumulativeView';
import PositionTable from './components/PositionTable';
import History from './components/History';
import ModernCard from './components/ModernCard';
import ModernChart from './components/ModernChart';
import ModernTable from './components/ModernTable';
import TradeLog from './components/TradeLog';
import TradingViewWidget from './components/TradingViewWidget';
import UltraLoadingScreen from './components/UltraLoadingScreen';
import { fetchAccounts, fetchCumulative, fetchPositions, fetchAccountView } from './api';

// Global dark theme styles
const appStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  color: '#fff',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
};

const containerStyles = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  color: '#fff',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
};

const headerStyles = {
  borderBottom: '1px solid #333',
  padding: '15px 0',
  background: 'rgba(10, 10, 10, 0.95)',
  backdropFilter: 'blur(10px)'
};

const mainContentStyles = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '20px 15px',
  display: 'grid',
  gap: '20px'
};

if (typeof document !== 'undefined' && !document.getElementById('modern-trading-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'modern-trading-styles';
  styleSheet.textContent = `
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #fff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow-x: hidden;
    }
    
    .trading-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #fff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    .dashboard-header {
      border-bottom: 1px solid #333;
      padding: 15px 10px;
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .dashboard-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 15px 10px;
      display: grid;
      gap: 15px;
    }
    
    .header-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      text-align: center;
    }
    
    .header-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
    }
    
    .grid-layout {
      display: grid;
      gap: 15px;
      grid-template-columns: 1fr;
    }
    
    .account-card {
      padding: 16px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border-radius: 12px;
      border: 1px solid #333;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .account-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }
    
    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .filter-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .filter-dropdown {
      padding: 8px 12px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      min-width: 120px;
    }
    
    /* Tablet styles */
    @media (min-width: 768px) {
      .dashboard-header {
        padding: 20px;
      }
      
      .dashboard-content {
        padding: 30px 20px;
        gap: 25px;
      }
      
      .header-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
      
      .header-actions {
        flex-direction: row;
        gap: 20px;
      }
      
      .grid-layout {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .account-card {
        padding: 24px;
        border-radius: 16px;
      }
      
      .account-stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 16px;
      }
      
      .filter-section {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      
      .filter-row {
        flex-direction: row;
        gap: 15px;
      }
    }
    
    /* Desktop styles */
    @media (min-width: 1024px) {
      .dashboard-content {
        padding: 40px 20px;
        gap: 30px;
      }
      
      .grid-layout {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      }
      
      .account-stats {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    /* Large desktop styles */
    @media (min-width: 1200px) {
      .grid-layout {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [cumulative, setCumulative] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountView, setAccountView] = useState(null);
  const [positionFilter, setPositionFilter] = useState('all');
  const [traderFilter, setTraderFilter] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [accountsData, cumulativeData, positionsData] = await Promise.all([
        fetchAccounts(),
        fetchCumulative(),
        fetchPositions()
      ]);
      
      setAccounts(accountsData);
      setCumulative(cumulativeData);
      setPositions(positionsData);
      
      // Simulate loading time for the ultra loading screen
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Mock data fallback
      const mockAccounts = [
        {
          accountId: 'TRADER-001',
          id: 'TRADER-001',
          name: 'John Crypto',
          balance: 35890.45,
          collateral: 12500.00,
          realizedPnl: 2450.75,
          unrealizedPnl: 3120.30,
          totalPnl: 5571.05,
          totalAssets: 91012.50,
          openPositions: 7,
          lastActive: '2025-09-14T10:30:00Z',
          riskLevel: 'Medium'
        },
        {
          accountId: 'TRADER-002',
          id: 'TRADER-002',
          name: 'Alice Futures',
          balance: 125000.00,
          collateral: 45000.00,
          realizedPnl: -1250.50,
          unrealizedPnl: 8750.25,
          totalPnl: 7499.75,
          totalAssets: 287500.00,
          openPositions: 12,
          lastActive: '2025-09-14T11:15:00Z',
          riskLevel: 'High'
        }
      ];
      
      // Mock positions data
      const mockPositions = [
        {
          id: 1,
          symbol: 'BTCUSDT',
          side: 'Buy',
          size: 0.5,
          entryPrice: 45000,
          markPrice: 46500,
          pnl: 750,
          percentage: 1.67,
          accountId: 'account-1',
          trader: 'Trader 1'
        },
        {
          id: 2,
          symbol: 'ETHUSDT', 
          side: 'Sell',
          size: 2.0,
          entryPrice: 3200,
          markPrice: 3150,
          pnl: 100,
          percentage: 1.56,
          accountId: 'account-1',
          trader: 'Trader 1'
        },
        {
          id: 3,
          symbol: 'ADAUSDT',
          side: 'Buy',
          size: 1000,
          entryPrice: 0.45,
          markPrice: 0.48,
          pnl: 30,
          percentage: 6.67,
          accountId: 'account-1',
          trader: 'Trader 1'
        },
        {
          id: 4,
          symbol: 'LINKUSDT',
          side: 'Buy',
          size: 25,
          entryPrice: 15.2,
          markPrice: 15.8,
          pnl: 15,
          percentage: 3.95,
          accountId: 'account-1',
          trader: 'Trader 1'
        },
        {
          id: 5,
          symbol: 'MATICUSDT',
          side: 'Sell',
          size: 500,
          entryPrice: 0.85,
          markPrice: 0.82,
          pnl: 15,
          percentage: 3.53,
          accountId: 'account-1',
          trader: 'Trader 1'
        },
        {
          id: 6,
          symbol: 'SOLUSDT',
          side: 'Buy', 
          size: 10,
          entryPrice: 120,
          markPrice: 125,
          pnl: 50,
          percentage: 4.17,
          accountId: 'account-2',
          trader: 'Trader 2'
        },
        {
          id: 7,
          symbol: 'DOTUSDT',
          side: 'Sell',
          size: 50,
          entryPrice: 8.5,
          markPrice: 8.2,
          pnl: 15,
          percentage: 3.53,
          accountId: 'account-2',
          trader: 'Trader 2'
        }
      ];

      // Mock trades data
      const mockTrades = [
        {
          id: 1,
          timestamp: Date.now() - 300000, // 5 minutes ago
          trader: 'Trader 1',
          symbol: 'BTCUSDT',
          side: 'Buy',
          size: 0.25,
          price: 46200,
          value: 11550,
          status: 'Filled'
        },
        {
          id: 2,
          timestamp: Date.now() - 600000, // 10 minutes ago
          trader: 'Trader 2',
          symbol: 'ETHUSDT',
          side: 'Sell',
          size: 1.5,
          price: 3180,
          value: 4770,
          status: 'Filled'
        },
        {
          id: 3,
          timestamp: Date.now() - 900000, // 15 minutes ago
          trader: 'Trader 1',
          symbol: 'ADAUSDT',
          side: 'Buy',
          size: 500,
          price: 0.47,
          value: 235,
          status: 'Filled'
        },
        {
          id: 4,
          timestamp: Date.now() - 1200000, // 20 minutes ago
          trader: 'Trader 2',
          symbol: 'SOLUSDT',
          side: 'Buy',
          size: 5,
          price: 122,
          value: 610,
          status: 'Partial'
        },
        {
          id: 5,
          timestamp: Date.now() - 1500000, // 25 minutes ago
          trader: 'Trader 1',
          symbol: 'LINKUSDT',
          side: 'Sell',
          size: 12,
          price: 15.5,
          value: 186,
          status: 'Filled'
        },
        {
          id: 6,
          timestamp: Date.now() - 1800000, // 30 minutes ago
          trader: 'Trader 2',
          symbol: 'DOTUSDT',
          side: 'Buy',
          size: 25,
          price: 8.3,
          value: 207.5,
          status: 'Cancelled'
        }
      ];

      // Use API data if available, otherwise use mock data
      setAccounts(accountsData && accountsData.length > 0 ? accountsData : mockAccounts);
      setCumulative(cumulativeData || {
        totalAssets: mockAccounts.reduce((sum, acc) => sum + acc.totalAssets, 0),
        unrealizedPnl: mockAccounts.reduce((sum, acc) => sum + acc.unrealizedPnl, 0),
        totalPnl: mockAccounts.reduce((sum, acc) => sum + acc.totalPnl, 0)
      });
      setPositions(positionsData && positionsData.length > 0 ? positionsData : mockPositions);
      setTrades(mockTrades);
    } finally {
      // Ensure loading screen is hidden even if there's an error
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
  };

  // Additional mock data for fallback
  const mockPositions = [
    {
      id: 1,
      symbol: 'BTCUSDT',
      side: 'Buy',
      size: 0.5,
      entryPrice: 45000,
      markPrice: 46500,
      pnl: 750,
      percentage: 1.67,
      accountId: 'account-1',
      trader: 'Trader 1'
    },
    {
      id: 2,
      symbol: 'ETHUSDT', 
      side: 'Sell',
      size: 2.0,
      entryPrice: 3200,
      markPrice: 3150,
      pnl: 100,
      percentage: 1.56,
      accountId: 'account-1',
      trader: 'Trader 1'
    },
    {
      id: 3,
      symbol: 'ADAUSDT',
      side: 'Buy',
      size: 1000,
      entryPrice: 0.45,
      markPrice: 0.48,
      pnl: 30,
      percentage: 6.67,
      accountId: 'account-1',
      trader: 'Trader 1'
    },
    {
      id: 4,
      symbol: 'LINKUSDT',
      side: 'Buy',
      size: 25,
      entryPrice: 15.2,
      markPrice: 15.8,
      pnl: 15,
      percentage: 3.95,
      accountId: 'account-1',
      trader: 'Trader 1'
    },
    {
      id: 5,
      symbol: 'MATICUSDT',
      side: 'Sell',
      size: 500,
      entryPrice: 0.85,
      markPrice: 0.82,
      pnl: 15,
      percentage: 3.53,
      accountId: 'account-1',
      trader: 'Trader 1'
    },
    {
      id: 6,
      symbol: 'SOLUSDT',
      side: 'Buy', 
      size: 10,
      entryPrice: 120,
      markPrice: 125,
      pnl: 50,
      percentage: 4.17,
      accountId: 'account-2',
      trader: 'Trader 2'
    },
    {
      id: 7,
      symbol: 'DOTUSDT',
      side: 'Sell',
      size: 50,
      entryPrice: 8.5,
      markPrice: 8.2,
      pnl: 15,
      percentage: 3.53,
      accountId: 'account-2',
      trader: 'Trader 2'
    }
  ];

  const mockTrades = [
    {
      id: 1,
      timestamp: Date.now() - 300000,
      trader: 'Trader 1',
      symbol: 'BTCUSDT',
      side: 'Buy',
      size: 0.25,
      price: 46200,
      value: 11550,
      status: 'Filled'
    },
    {
      id: 2,
      timestamp: Date.now() - 600000,
      trader: 'Trader 2',
      symbol: 'ETHUSDT',
      side: 'Sell',
      size: 1.5,
      price: 3180,
      value: 4770,
      status: 'Filled'
    },
    {
      id: 3,
      timestamp: Date.now() - 900000,
      trader: 'Trader 1',
      symbol: 'ADAUSDT',
      side: 'Buy',
      size: 500,
      price: 0.47,
      value: 235,
      status: 'Filled'
    },
    {
      id: 4,
      timestamp: Date.now() - 1200000,
      trader: 'Trader 2',
      symbol: 'SOLUSDT',
      side: 'Buy',
      size: 5,
      price: 122,
      value: 610,
      status: 'Partial'
    },
    {
      id: 5,
      timestamp: Date.now() - 1500000,
      trader: 'Trader 1',
      symbol: 'LINKUSDT',
      side: 'Sell',
      size: 12,
      price: 15.5,
      value: 186,
      status: 'Filled'
    }
  ];

  // Use mock data if positions/trades are empty
  React.useEffect(() => {
    if (positions.length === 0) {
      setPositions(mockPositions);
    }
    if (trades.length === 0) {
      setTrades(mockTrades);
    }
  }, [positions.length, trades.length]);

  // Auto-select first account to show account details
  React.useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  const handleAccountSelect = async (accountId) => {
    const account = accounts.find(acc => acc.accountId === accountId);
    console.log('Account selected:', account);
    setSelectedAccount(account);
    try {
      const accountViewData = await fetchAccountView(accountId);
      setAccountView(accountViewData);
    } catch (error) {
      console.error('Error loading account view:', error);
    }
  };

  const handleHistoryClick = () => {
    setShowDatePicker(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setSelectedDate('');
  };

  const handleDateSelect = (date) => {
    console.log('handleDateSelect called with:', { date, selectedAccount });
    if (date && selectedAccount) {
      setSelectedDate(date);
      setShowDatePicker(false);
      setShowHistory(true);
    }
  };

  const getFilteredPositions = () => {
    let filtered = positions;
    
    // Filter by account
    if (positionFilter !== 'all') {
      filtered = filtered.filter(position => position.accountId === positionFilter);
    }
    
    // Filter by trader
    if (traderFilter !== 'all') {
      filtered = filtered.filter(position => position.trader === traderFilter);
    }
    
    return filtered;
  };

  // Generate mock chart data
  const generateChartData = (days = 30) => {
    const data = [];
    const baseValue = 50000;
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: baseValue + (Math.random() - 0.5) * 10000 + (i * 100)
      });
    }
    return data;
  };

  const pnlChartData = generateChartData(30);
  const volumeData = generateChartData(7).map(item => ({ ...item, value: Math.random() * 1000000 }));

  // Modern position table columns
  const positionColumns = [
    { key: 'trader', header: 'Trader', bold: true },
    { key: 'symbol', header: 'Symbol', bold: true },
    { key: 'side', header: 'Side', render: (value) => (
      <span style={{ color: value === 'Buy' ? '#00ff88' : '#ff4757' }}>
        {value}
      </span>
    ) },
    { key: 'size', header: 'Size', type: 'number' },
    { key: 'entryPrice', header: 'Entry Price', type: 'currency' },
    { key: 'markPrice', header: 'Mark Price', type: 'currency' },
    { key: 'pnl', header: 'PnL', type: 'currency', colorize: true },
    { key: 'percentage', header: '%', type: 'percentage', colorize: true }
  ];

  if (isLoading) {
    return <UltraLoadingScreen />;
  }

  return (
    <div className="trading-dashboard">
      {/* Modern Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              ⚡ Risk Monitor Pro
            </h1>
            <p style={{ margin: '5px 0 0', color: '#8b949e', fontSize: '12px' }}>
              Advanced Trading Dashboard • Real-time Analytics
            </p>
          </div>
          
          <div className="header-actions">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#8b949e', fontSize: '12px' }}>Total Portfolio</div>
              <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: '700', fontFamily: 'monospace' }}>
                ${cumulative?.totalAssets?.toLocaleString() || '0'}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #00ff88, #0099ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👤
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Key Metrics Cards */}
        <motion.div 
          className="grid-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ModernCard
            title="Total Assets"
            value={`$${cumulative?.totalAssets?.toLocaleString() || '0'}`}
            change="+$2,450"
            changePercent="2.45"
            trend="up"
            icon="💰"
          />
          
          <ModernCard
            title="Unrealized PnL"
            value={`$${cumulative?.unrealizedPnl?.toLocaleString() || '0'}`}
            change="+$1,250"
            changePercent="5.2"
            trend={cumulative?.unrealizedPnl >= 0 ? "up" : "down"}
            icon="📈"
          />
          
          <ModernCard
            title="Open Positions"
            value={positions.length}
            change="+3"
            trend="up"
            icon="📊"
          />
          
          <ModernCard
            title="Active Accounts"
            value={accounts.length}
            icon="🏦"
            onClick={() => console.log('View accounts')}
          />
        </motion.div>

        {/* Advanced Charts Section */}
        <motion.div 
          className="chart-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <TradingViewWidget symbol="BTCUSD" height={400} />
            
            <div>
              <ModernChart
                data={pnlChartData}
                type="area"
                title="Portfolio Performance"
                color="#00ff88"
                height={180}
              />
              <ModernChart
                data={volumeData}
                type="bar"
                title="Trading Volume"
                color="#0099ff"
                height={180}
              />
            </div>
          </div>
        </motion.div>

        {/* Account Selection & Details */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ModernCard title={`ACCOUNT ${selectedAccount.id?.toUpperCase() || 'UNDEFINED'} - ${selectedAccount.name?.toUpperCase() || 'UNDEFINED'}`}>
              <div className="grid-layout">
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>BALANCE</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'monospace' }}>
                    ${selectedAccount.balance?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>COLLATERAL</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'monospace' }}>
                    ${selectedAccount.collateral?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>REALIZED PNL</div>
                  <div style={{ 
                    color: selectedAccount.realizedPnl >= 0 ? '#00ff88' : '#ff4757', 
                    fontSize: '18px',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {selectedAccount.realizedPnl >= 0 ? '+' : ''}${selectedAccount.realizedPnl?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>UNREALIZED PNL</div>
                  <div style={{ 
                    color: selectedAccount.unrealizedPnl >= 0 ? '#00ff88' : '#ff4757', 
                    fontSize: '18px',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {selectedAccount.unrealizedPnl >= 0 ? '+' : ''}${selectedAccount.unrealizedPnl?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>TOTAL PNL</div>
                  <div style={{ 
                    color: selectedAccount.totalPnl >= 0 ? '#00ff88' : '#ff4757', 
                    fontSize: '18px',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {selectedAccount.totalPnl >= 0 ? '+' : ''}${selectedAccount.totalPnl?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>TOTAL ASSETS</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600', fontFamily: 'monospace' }}>
                    ${selectedAccount.totalAssets?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#8b949e', fontSize: '12px', marginBottom: '4px' }}>OPEN POSITIONS</div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                    {selectedAccount.openPositions || 0}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleHistoryClick}
                className="account-card"
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                  borderRadius: '12px',
                  border: '1px solid #357abd',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  color: '#fff',
                  fontWeight: '600',
                  '@media (min-width: 768px)': {
                    padding: '24px',
                    borderRadius: '16px'
                  }
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'linear-gradient(135deg, #5ba0f2 0%, #4682cd 100%)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
                }}
              >
                📊 View History
              </button>
            </ModernCard>
          </motion.div>
        )}

        {/* Account Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AccountTable 
            accounts={accounts} 
            onSelectAccount={handleAccountSelect}
            selectedAccount={selectedAccount}
          />
        </motion.div>

        {/* Modern Positions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '600', margin: 0 }}>
              Open Positions
            </h2>
            <div className="filter-section">
              <span style={{ color: '#8b949e', fontSize: '14px', fontWeight: '500' }}>Filter by:</span>
              <div className="filter-row">
                <select 
                  value={positionFilter} 
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="all">All Accounts</option>
                  {accounts.map(account => (
                    <option key={account.accountId} value={account.accountId}>
                      {account.name}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={traderFilter} 
                  onChange={(e) => setTraderFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="all">All Traders</option>
                  <option value="Trader 1">Trader 1</option>
                  <option value="Trader 2">Trader 2</option>
                </select>
              </div>
            </div>
          </div>
          
          <ModernTable
            data={getFilteredPositions()}
            columns={positionColumns}
            onRowClick={(position) => console.log('Position clicked:', position)}
          />
          
          {/* Debug info */}
          <div style={{ color: '#8b949e', fontSize: '12px', marginTop: '10px' }}>
            Debug: Total positions: {positions.length}, Filtered positions: {getFilteredPositions().length}
          </div>
        </motion.div>

        {/* Trade Log Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <TradeLog trades={trades} />
        </motion.div>
      </div>

      {/* Date Picker Modal - Modernized */}
      {showDatePicker && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              backgroundColor: '#0d1117',
              border: '1px solid #30363d',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              minWidth: '350px'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#fff', fontSize: '18px', fontWeight: '600' }}>
              📅 Select Date for History
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDatePicker(false);
                  setSelectedDate('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#21262d',
                  color: '#8b949e',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDateSelect(selectedDate)}
                disabled={!selectedDate}
                style={{
                  padding: '10px 20px',
                  background: selectedDate ? 'linear-gradient(45deg, #00ff88, #0099ff)' : '#30363d',
                  color: selectedDate ? '#000' : '#8b949e',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selectedDate ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                View History
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* History Modal */}
      {showHistory && selectedAccount && selectedDate && (
        <History
          accountId={selectedAccount.accountId}
          selectedDate={selectedDate}
          onClose={handleCloseHistory}
        />
      )}
    </div>
  );
}
