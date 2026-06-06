const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const insightRoutes = require('./routes/insights');

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fin-track-pro-three.vercel.app",
      "https://fin-track-pro-git-main-charuishika-s-s-projects.vercel.app"
    ]
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);

app.get('/', (req, res) => res.json({ message: 'FinTrack Pro API running' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('MongoDB error:', err));