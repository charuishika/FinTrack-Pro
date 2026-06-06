const express = require('express');
const Groq = require('groq-sdk');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    const prompt = `You are a smart personal finance advisor for Indian users. Analyze this month's data and reply ONLY with valid JSON, no extra text, no markdown, no backticks.

{
  "summary": "one sentence overall assessment",
  "insights": [
    { "type": "warning|tip|achievement", "title": "short title", "detail": "1-2 sentence actionable advice" }
  ],
  "savingsTip": "one specific actionable saving tip for next month"
}

Financial Data:
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpense}
Net Savings: ₹${totalIncome - totalExpense}
Savings Rate: ${totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
Category Breakdown: ${JSON.stringify(categoryBreakdown)}
Budgets: ${JSON.stringify(budgets.map(b => ({ category: b.category, limit: b.limit })))}

Give exactly 3 insights. Be specific, friendly, and practical for Indian context.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response from AI');
    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error('Insights error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;