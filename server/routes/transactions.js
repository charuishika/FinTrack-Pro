const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const { type, category, month, year, limit = 50 } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 }).limit(Number(limit));
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⚠️ SPECIFIC ROUTES MUST BE BEFORE /:id
// GET /summary
router.get('/summary', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${Number(year) + 1}-01-01`) },
        },
      },
      { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.month': 1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /by-category
router.get('/by-category', async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user._id, type: 'expense' };
    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }
    const data = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - add transaction
router.post('/', async (req, res) => {
  try {
    if (!req.body.amount || Number(req.body.amount) <= 0)
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    const t = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - edit transaction /:id
router.put('/:id', async (req, res) => {
  try {
    if (!req.body.amount || Number(req.body.amount) <= 0)
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    const t = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!t) return res.status(404).json({ message: 'Transaction not found' });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - delete transaction /:id
router.delete('/:id', async (req, res) => {
  try {
    const t = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;