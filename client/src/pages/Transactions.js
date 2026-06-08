import React, { useEffect, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusIcon, IncomeIcon, ExpenseIcon } from '../components/Icons';
import { exportToCSV } from '../utils/exportCSV';
import toast from 'react-hot-toast';

const INCOME_CATS = ['Salary','Freelance','Investment','Other Income'];
const EXPENSE_CATS = ['Food','Transport','Housing','Entertainment','Healthcare','Shopping','Education','Utilities','Other Expense'];
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const defaultForm = { type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] };

// ── Icons ────────────────────────────────────────────────────
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
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const ExportIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ── Confirm Delete Dialog ────────────────────────────────────
function ConfirmDialog({ transaction, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>Delete Transaction?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
          {transaction.description || transaction.category}
        </p>
        <p style={{ fontWeight: 600, color: transaction.type === 'income' ? 'var(--success)' : 'var(--danger)', marginBottom: '1.5rem' }}>
          {transaction.type === 'income' ? '+' : '-'}{fmt(transaction.amount)}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: 'var(--danger)', color: 'white' }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState({
    type: transaction.type,
    amount: String(transaction.amount),
    category: transaction.category,
    description: transaction.description || '',
    date: transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const validate = () => {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount greater than 0';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, amount: Number(form.amount) });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Edit Transaction</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
            <CloseIcon />
          </button>
        </div>
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
            <input type="number" min="1" value={form.amount}
              onChange={e => { setForm({ ...form, amount: e.target.value }); setErrors({ ...errors, amount: '' }); }}
              style={{ borderColor: errors.amount ? 'var(--danger)' : undefined }} />
            {errors.amount && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.amount}</p>}
          </div>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={form.date}
              onChange={e => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: '' }); }}
              style={{ borderColor: errors.date ? 'var(--danger)' : undefined }} />
            {errors.date && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.date}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Description (optional)</label>
            <input placeholder="What was this for?" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Transactions Page ───────────────────────────────────
export default function Transactions() {
  const { transactions, fetchTransactions, addTransaction, updateTransaction, deleteTransaction, loading } = useFinance();
  const [form, setForm] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ type: '', category: '' });
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchTransactions({ ...filter, limit: 100 }); }, [filter]);

  const validateForm = () => {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount greater than 0';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    await addTransaction({ ...form, amount: Number(form.amount) });
    setForm(defaultForm);
    setShowForm(false);
  };

  const handleEdit = async (data) => {
    await updateTransaction(editTarget._id, data);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    await deleteTransaction(deleteTarget._id);
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const success = exportToCSV(transactions, 'fintrack-transactions');
    if (success) {
      toast.success(`Exported ${transactions.length} transactions to CSV!`);
    } else {
      toast.error('No transactions to export');
    }
  };

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <div>
      {deleteTarget && (
        <ConfirmDialog transaction={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {editTarget && (
        <EditModal transaction={editTarget} onSave={handleEdit} onClose={() => setEditTarget(null)} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: '1.6rem' }}>Transactions</h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Export CSV Button */}
          <button className="btn btn-ghost" onClick={handleExport}>
            <ExportIcon /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            {showForm ? <><CloseIcon /> Close</> : <><PlusIcon size={16} /> Add Transaction</>}
          </button>
        </div>
      </div>

      {/* Add Form */}
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
                <input type="number" placeholder="0" min="1" value={form.amount}
                  onChange={e => { setForm({ ...form, amount: e.target.value }); setFormErrors({ ...formErrors, amount: '' }); }}
                  style={{ borderColor: formErrors.amount ? 'var(--danger)' : undefined }} />
                {formErrors.amount && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{formErrors.amount}</p>}
              </div>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Date</label>
                <input type="date" value={form.date}
                  onChange={e => { setForm({ ...form, date: e.target.value }); setFormErrors({ ...formErrors, date: '' }); }}
                  style={{ borderColor: formErrors.date ? 'var(--danger)' : undefined }} />
                {formErrors.date && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{formErrors.date}</p>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label>Description (optional)</label>
                <input placeholder="What was this for?" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary">Save Transaction</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setFormErrors({}); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })} style={{ width: 140 }}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} style={{ width: 160 }}>
          <option value="">All Categories</option>
          {[...INCOME_CATS, ...EXPENSE_CATS].map(c => <option key={c}>{c}</option>)}
        </select>
        {/* Export info */}
        {transactions.length > 0 && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} — <span
              onClick={handleExport}
              style={{ color: 'var(--primary-light)', cursor: 'pointer', textDecoration: 'underline' }}>
              Export filtered as CSV
            </span>
          </span>
        )}
      </div>

      {/* Transaction List */}
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
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.description || t.category}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span className={`badge badge-${t.type}`} style={{ marginRight: 6 }}>{t.category}</span>
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <p style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem', flexShrink: 0 }}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </p>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button onClick={() => setEditTarget(t)}
                    style={{ background: '#6c63ff20', border: '1px solid #6c63ff40', color: 'var(--primary-light)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <EditIcon />
                  </button>
                  <button onClick={() => setDeleteTarget(t)}
                    style={{ background: '#ef444420', border: '1px solid #ef444440', color: 'var(--danger)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
