import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const EXPENSE_CATS = ['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Utilities','Other Expense'];
const fmt = (n) => `₹${n?.toLocaleString('en-IN') || 0}`;

export default function Budgets() {
  const { budgets, fetchBudgets, saveBudget } = useFinance();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ category: 'Food', limit: '' });

  useEffect(() => { fetchBudgets(month, year); }, [month, year]);

  const handleSave = async (e) => {
    e.preventDefault();
    await saveBudget({ ...form, month, year });
    setForm({ category: 'Food', limit: '' });
    fetchBudgets(month, year);
  };

  const getColor = (pct) => {
    if (pct >= 100) return 'var(--danger)';
    if (pct >= 80) return 'var(--warning)';
    return 'var(--primary)';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: '1.6rem' }}>Budgets</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: 110 }}>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 90 }}>
            {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Set Budget</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label>Monthly Limit (₹)</label>
            <input type="number" placeholder="5000" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} min="0" />
          </div>
          <button type="submit" className="btn btn-primary">Save Budget</button>
        </form>
      </div>

      {budgets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No budgets set for this month. Add one above!
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map(b => {
            const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
            const color = getColor(pct);
            return (
              <div key={b._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem' }}>{b.category}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{fmt(b.spent)} of {fmt(b.limit)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color, fontFamily: 'Space Grotesk' }}>{pct}%</p>
                    <p style={{ fontSize: '0.78rem', color: b.remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {b.remaining >= 0 ? `${fmt(b.remaining)} left` : `${fmt(Math.abs(b.remaining))} over`}
                    </p>
                  </div>
                </div>
                <div style={{ background: 'var(--surface2)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 20, transition: 'width 0.5s ease' }} />
                </div>
                {pct >= 100 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <WarnIcon />
                    <p style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>Budget exceeded!</p>
                  </div>
                )}
                {pct >= 80 && pct < 100 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <AlertIcon />
                    <p style={{ fontSize: '0.78rem', color: 'var(--warning)' }}>Approaching limit</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
