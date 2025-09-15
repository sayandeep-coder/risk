require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const accountRoutes = require('./routes/accounts');
const { syncFromExchange } = require('./services/accountService');
const { computeCumulative } = require('./services/pnlService');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/risk_monitor';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '15000');
const BYBIT_API_KEY = process.env.BYBIT_API_KEY;
const BYBIT_API_SECRET = process.env.BYBIT_API_SECRET;

(async () => {
  await connectDB(MONGODB_URI);

  app.use('/api/accounts', accountRoutes);
  app.get('/api/cumulative', async (req, res) => {
    const agg = await computeCumulative();
    res.json(agg);
  });
  app.get('/api/positions', async (req, res) => {
    const positions = await require('./models/Position').find().lean();
    res.json(positions);
  });

  app.listen(PORT, () => console.log('Server listening on', PORT));

  setInterval(async () => {
    try {
      const out = await syncFromExchange(BYBIT_API_KEY, BYBIT_API_SECRET);
      console.log('Synced:', out);
    } catch (err) {
      console.error('Sync error', err.message || err);
    }
  }, POLL_INTERVAL_MS);

})();
