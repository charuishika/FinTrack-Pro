const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        'Salary','Freelance','Investment','Other Income',
        'Food','Transport','Housing','Entertainment',
        'Healthcare','Shopping','Education','Utilities','Other Expense',
      ],
    },
    description: { type: String, trim: true, maxlength: 200 },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);