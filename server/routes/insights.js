const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/analyze', async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [transactions, budgets] = await Promise.all([
      Transaction.find({
        user: req.user._id,
        date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
      }).limit(50),
      Budget.find({ user: req.user._id, month, year }),
    ]);

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    const prompt = `You are a smart personal finance advisor. Analyze this data and give 3-4 concise actionable insights. Reply ONLY with this exact JSON format, no extra text:
{
  "summary": "one sentence overall assessment",
  "insights": [
    { "type": "warning|tip|achievement", "title": "short title", "detail": "1-2 sentence advice" }
  ],
  "savingsTip": "one specific saving tip for next month"
}

Data:
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpense}
Net Savings: ₹${totalIncome - totalExpense}
Category Breakdown: ${JSON.stringify(categoryBreakdown)}
Budgets: ${JSON.stringify(budgets.map(b => ({ category: b.category, limit: b.limit })))}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { summary: raw, insights: [], savingsTip: '' };

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;