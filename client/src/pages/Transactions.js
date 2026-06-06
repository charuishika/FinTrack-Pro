import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusIcon, TrashIcon, IncomeIcon, ExpenseIcon } from '../components/Icons';
import toast from 'react-hot-toast';

const INCOME_CATS = ['Salary', 'Freelance', 'Investment', 'Other Income'];
const EXPENSE_CATS = ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Utilities', 'Other Expense'];
const fmt = (n) => `₹${n?.toLocaleString('en-IN') || 0}`;
const defaultForm = { type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] };

export default function Transactions() {
  const { transactions, fetchTransactions, addTransaction, deleteTransaction, loading } = useFinance();
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ type: '', category: '' });

  useEffect(() => { fetchTransactions({ ...filter, limit: 100 }); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return toast.error('Fill all fields');
    await addTransaction(form);
    setForm(defaultForm);
    setShowForm(false);
  };

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: '1.6rem' }}>Transactions</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? <><CloseInline /> Close</> : <><PlusIcon size={16} /> Add Transaction</>}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>New Transaction</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: e.target.value === 'income' ? 'Salary' : 'Food' })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label>Amount (₹)</label>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} min="0" />
              </div>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Description (optional)</label>
                <input placeholder="What was this for?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">Save Transaction</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })} style={{ width: 140 }}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} style={{ width: 160 }}>
          <option value="">All Categories</option>
          {[...INCOME_CATS, ...EXPENSE_CATS].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading...</p>
        ) : transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No transactions found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {transactions.map(t => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.85rem 1rem', borderRadius: 10, background: 'var(--surface2)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.type === 'income' ? '#22c55e20' : '#ef444420', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {t.type === 'income' ? <IncomeIcon size={15} color="var(--success)" /> : <ExpenseIcon size={15} color="var(--danger)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || t.category}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span className="badge badge-expense" style={{ background: t.type === 'income' ? '#22c55e15' : '#ef444415', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', marginRight: 6 }}>{t.category}</span>
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <p style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem', flexShrink: 0 }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </p>
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.35rem 0.6rem', flexShrink: 0 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete ${t.description || t.category} transaction?`
                      )
                    ) {
                      deleteTransaction(t._id);
                    }
                  }}
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const CloseInline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
