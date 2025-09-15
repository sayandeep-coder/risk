const axios = require('axios');
const WebSocket = require('ws');

const BYBIT_BASE = 'https://api.bybit.com';

const rest = axios.create({
  baseURL: BYBIT_BASE,
  timeout: 10000
});

async function fetchAccountBalances(apiKey, apiSecret) {
  
  return [
    {
      accountId: 'account-1',
      name: 'Trader 1',
      balance: 10000,
      collateral: 2000,
      realizedPnl: 500
    },
    {
      accountId: 'account-2',
      name: 'Trader 2',
      balance: 5000,
      collateral: 1000,
      realizedPnl: -200
    }
  ];
}

async function fetchOpenPositions(apiKey, apiSecret) {
  
  return [
    {
      accountId: 'account-1',
      symbol: 'BTCUSDT',
      size: 1.0,
      entryPrice: 60000,
      currentPrice: 62000,
      margin: 2000
    },
    {
      accountId: 'account-2',
      symbol: 'ETHUSDT',
      size: -10,
      entryPrice: 3000,
      currentPrice: 2800,
      margin: 1000
    }
  ];
}

function createWs(url, onMessage) {
  const ws = new WebSocket(url);
  ws.on('open', () => console.log('Bybit WS open', url));
  ws.on('message', (msg) => {
    try { onMessage(JSON.parse(msg)); } catch (e) {}
  });
  ws.on('error', (err) => console.error('Bybit WS error', err));
  ws.on('close', () => console.log('Bybit WS closed'));
  return ws;
}

module.exports = {
  fetchAccountBalances,
  fetchOpenPositions,
  createWs,
  rest
};
