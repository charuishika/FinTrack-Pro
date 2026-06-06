import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import toast from 'react-hot-toast';

const EXPENSE_CATS = ['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Utilities','Other Expense'];
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const WarnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M8 6V4h8v2"/>
  </svg>
);

// ── Confirm Dialog ──────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>Are you sure?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" style={{ background: 'var(--danger)', color: 'white' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ──────────────────────────────────────────────
function EditModal({ budget, onSave, onClose }) {
  const [limit, setLimit] = useState(String(budget.limit));
  const [error, setError] = useState('');

  const handleSave = () => {
    const val = Number(limit);
    if (!limit || isNaN(val) || val <= 0) {
      setError('Please enter a valid limit greater than 0');
      return;
    }
    onSave(val);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 380, width: '100%' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Edit Budget — {budget.category}</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Monthly Limit (₹)</label>
          <input
            type="number"
            value={limit}
            min="1"
            onChange={e => { setLimit(e.target.value); setError(''); }}
            placeholder="Enter amount greater than 0"
            autoFocus
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 6 }}>{error}</p>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Budgets Page ───────────────────────────────────────
export default function Budgets() {
  const { budgets, fetchBudgets, saveBudget, deleteBudget } = useFinance();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [form, setForm] = useState({ category: 'Food', limit: '' });
  const [formError, setFormError] = useState('');
  const [editBudget, setEditBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchBudgets(month, year); }, [month, year]);

  const handleSave = async (e) => {
    e.preventDefault();
    const val = Number(form.limit);
    if (!form.limit || isNaN(val) || val <= 0) {
      setFormError('Please enter a valid monthly limit greater than ₹0');
      return;
    }
    setFormError('');
    await saveBudget({ ...form, limit: val, month, year });
    setForm({ category: 'Food', limit: '' });
    fetchBudgets(month, year);
  };

  const handleEdit = async (newLimit) => {
    await saveBudget({ category: editBudget.category, limit: newLimit, month: editBudget.month, year: editBudget.year });
    setEditBudget(null);
    fetchBudgets(month, year);
  };

  const handleDelete = async () => {
    await deleteBudget(deleteTarget._id);
    setDeleteTarget(null);
    fetchBudgets(month, year);
  };

  const getColor = (pct) => {
    if (pct >= 100) return 'var(--danger)';
    if (pct >= 80) return 'var(--warning)';
    return 'var(--primary)';
  };

  return (
    <div>
      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete the "${deleteTarget.category}" budget? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit Modal */}
      {editBudget && (
        <EditModal
          budget={editBudget}
          onSave={handleEdit}
          onClose={() => setEditBudget(null)}
        />
      )}

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

      {/* Add Budget Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Set Budget</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <label>Monthly Limit (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={form.limit}
              min="1"
              onChange={e => { setForm({ ...form, limit: e.target.value }); setFormError(''); }}
              style={{ borderColor: formError ? 'var(--danger)' : undefined }}
            />
            {formError && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 5 }}>{formError}</p>}
          </div>
          <div style={{ paddingTop: formError ? 0 : '1.4rem' }}>
            <button type="submit" className="btn btn-primary">Save Budget</button>
          </div>
        </form>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No budgets set for this month. Add one above!
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map(b => {
            const limit = Number(b.limit) || 0;
            const spent = Number(b.spent) || 0;
            const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
            const color = getColor(pct);

            return (
              <div key={b._id} className="card">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1rem' }}>{b.category}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {fmt(spent)} of {fmt(limit)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color, fontFamily: 'Space Grotesk' }}>{pct}%</p>
                    {/* Edit & Delete buttons */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setEditBudget(b)}
                        style={{ background: '#6c63ff20', border: '1px solid #6c63ff40', color: 'var(--primary-light)', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Edit budget">
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        style={{ background: '#ef444420', border: '1px solid #ef444440', color: 'var(--danger)', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Delete budget">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ background: 'var(--surface2)', borderRadius: 20, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 20, transition: 'width 0.5s ease' }} />
                </div>

                {/* Remaining */}
                <p style={{ fontSize: '0.78rem', color: b.remaining >= 0 ? 'var(--success)' : 'var(--danger)', marginBottom: 4 }}>
                  {b.remaining >= 0 ? `${fmt(b.remaining)} remaining` : `${fmt(Math.abs(b.remaining))} over budget`}
                </p>

                {/* Alerts */}
                {pct >= 100 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <WarnIcon /><p style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>Budget exceeded!</p>
                  </div>
                )}
                {pct >= 80 && pct < 100 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertIcon /><p style={{ fontSize: '0.78rem', color: 'var(--warning)' }}>Approaching limit</p>
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
