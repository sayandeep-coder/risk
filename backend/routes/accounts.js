const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Position = require('../models/Position');
const pnlService = require('../services/pnlService');

router.get('/', async (req, res) => {
  const accounts = await Account.find().lean();
  res.json(accounts);
});

router.get('/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const view = await pnlService.computeAccountPnL(accountId);
  res.json(view);
});

router.get('/cumulative', async (req, res) => {
  const agg = await pnlService.computeCumulative();
  res.json(agg);
});

router.get('/positions/all', async (req, res) => {
  const positions = await Position.find().lean();
  res.json(positions);
});

module.exports = router;
