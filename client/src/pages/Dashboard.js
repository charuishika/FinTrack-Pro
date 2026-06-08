import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { IncomeIcon, ExpenseIcon, SavingsIcon, RateIcon } from '../components/Icons';
import { DashboardAlerts } from '../components/BudgetAlerts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6c63ff','#22c55e','#f59e0b','#ef4444','#06b6d4','#ec4899','#8b5cf6'];
const fmt = (n) => `₹${n?.toLocaleString('en-IN') || 0}`;

export default function Dashboard() {
  const { user } = useAuth();
  const { fetchTransactions, fetchSummary, fetchCategoryData, fetchBudgets,
          transactions, summary, categoryData, budgets } = useFinance();
  const [chartData, setChartData] = useState([]);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    fetchTransactions({ month, year, limit: 5 });
    fetchSummary(year);
    fetchCategoryData(month, year);
    fetchBudgets(month, year); // fetch budgets for alerts
  }, []);

  useEffect(() => {
    const map = {};
    summary.forEach(({ _id, total }) => {
      const m = MONTHS[_id.month - 1];
      if (!map[m]) map[m] = { month: m, income: 0, expense: 0 };
      map[m][_id.type] = total;
    });
    setChartData(MONTHS.map(m => map[m] || { month: m, income: 0, expense: 0 }));
  }, [summary]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
  const pieData = categoryData.map(d => ({ name: d._id, value: d.total }));

  const stats = [
    { label: 'Total Income', value: fmt(totalIncome), color: 'var(--success)', Icon: IncomeIcon },
    { label: 'Total Expenses', value: fmt(totalExpense), color: 'var(--danger)', Icon: ExpenseIcon },
    { label: 'Net Savings', value: fmt(savings), color: savings >= 0 ? 'var(--success)' : 'var(--danger)', Icon: SavingsIcon },
    { label: 'Savings Rate', value: `${savingsRate}%`, color: 'var(--primary-light)', Icon: RateIcon },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{MONTHS[month-1]} {year} — Financial Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {stats.map(({ label, value, color, Icon }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p className="stat-label">{label}</p>
              <Icon size={18} color={color} />
            </div>
            <p className="stat-value" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Income vs Expenses — {year}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#8b90a8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b90a8', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={45} />
              <Tooltip formatter={v => fmt(v)}
                contentStyle={{ background: '#1a1d27', border: '1px solid #2e3347', borderRadius: 10 }} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#income)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expense)" strokeWidth={2} />
              <Legend formatter={v => <span style={{ color: '#8b90a8', fontSize: 12 }}>{v}</span>} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Expenses by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmt(v)}
                  contentStyle={{ background: '#1a1d27', border: '1px solid #2e3347', borderRadius: 10 }} />
                <Legend formatter={v => <span style={{ color: '#8b90a8', fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No expense data this month
            </div>
          )}
        </div>
      </div>

      {/* Budget Alerts — only shows if there are warnings/exceeded */}
      <DashboardAlerts budgets={budgets} />

      {/* Recent Transactions */}
      <div className="card">
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No transactions yet. Add your first one!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {transactions.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem', background: 'var(--surface2)', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%',
                  background: t.type === 'income' ? '#22c55e20' : '#ef444420',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {t.type === 'income'
                    ? <IncomeIcon size={16} color="var(--success)" />
                    : <ExpenseIcon size={16} color="var(--danger)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.description || t.category}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {t.category} · {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <p style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem', flexShrink: 0 }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
