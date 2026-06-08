import React from 'react';

const AlertTriangle = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const AlertCircle = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckCircle = ({ size = 16, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function getAlerts(budgets) {
  if (!budgets || budgets.length === 0) return [];

  const alerts = [];

  budgets.forEach(b => {
    const limit = Number(b.limit) || 0;
    const spent = Number(b.spent) || 0;
    if (limit <= 0) return;

    const pct = Math.round((spent / limit) * 100);
    const over = spent - limit;

    if (pct >= 100) {
      alerts.push({
        type: 'exceeded',
        category: b.category,
        pct,
        over,
        message: `${b.category} budget exceeded by ${fmt(over)}`,
        priority: 1,
      });
    } else if (pct >= 80) {
      alerts.push({
        type: 'warning',
        category: b.category,
        pct,
        remaining: limit - spent,
        message: `${b.category} budget is ${pct}% used — ${fmt(limit - spent)} left`,
        priority: 2,
      });
    } else {
      alerts.push({
        type: 'ok',
        category: b.category,
        pct,
        remaining: limit - spent,
        message: `${b.category} budget is under control — ${fmt(limit - spent)} remaining`,
        priority: 3,
      });
    }
  });

  // Sort: exceeded first, then warnings, then ok
  return alerts.sort((a, b) => a.priority - b.priority);
}

// ── Compact alert row (for Dashboard) ──────────────────────
function AlertRow({ alert }) {
  const config = {
    exceeded: { color: 'var(--danger)', bg: '#ef444412', border: '#ef444430', Icon: AlertTriangle, prefix: 'EXCEEDED' },
    warning:  { color: 'var(--warning)', bg: '#f59e0b12', border: '#f59e0b30', Icon: AlertCircle, prefix: 'WARNING' },
    ok:       { color: 'var(--success)', bg: '#22c55e12', border: '#22c55e30', Icon: CheckCircle, prefix: 'OK' },
  }[alert.type];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0.7rem 1rem',
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 10,
    }}>
      <config.Icon size={16} color={config.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{alert.message}</span>
      </div>
      <span style={{
        fontSize: '0.72rem', fontWeight: 600,
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        padding: '2px 8px', borderRadius: 20,
        flexShrink: 0,
      }}>{config.prefix}</span>
    </div>
  );
}

// ── Dashboard Budget Alerts widget ─────────────────────────
export function DashboardAlerts({ budgets }) {
  const alerts = getAlerts(budgets);
  const urgent = alerts.filter(a => a.type !== 'ok');

  if (urgent.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <AlertTriangle size={18} color="var(--warning)" />
        <h3 style={{ fontSize: '1rem' }}>Budget Alerts</h3>
        <span style={{
          marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600,
          background: urgent.some(a => a.type === 'exceeded') ? '#ef444420' : '#f59e0b20',
          color: urgent.some(a => a.type === 'exceeded') ? 'var(--danger)' : 'var(--warning)',
          padding: '2px 10px', borderRadius: 20,
        }}>
          {urgent.length} alert{urgent.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {urgent.map((alert, i) => <AlertRow key={i} alert={alert} />)}
      </div>
    </div>
  );
}

// ── Budget card inline alert (for Budgets page) ─────────────
export function BudgetCardAlert({ budget }) {
  const limit = Number(budget.limit) || 0;
  const spent = Number(budget.spent) || 0;
  if (limit <= 0) return null;

  const pct = Math.round((spent / limit) * 100);

  if (pct >= 100) {
    const over = spent - limit;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
        padding: '6px 10px', background: '#ef444412', border: '1px solid #ef444430', borderRadius: 8 }}>
        <AlertTriangle size={13} color="var(--danger)" />
        <p style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 500 }}>
          Exceeded by {fmt(over)}
        </p>
      </div>
    );
  }

  if (pct >= 80) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
        padding: '6px 10px', background: '#f59e0b12', border: '1px solid #f59e0b30', borderRadius: 8 }}>
        <AlertCircle size={13} color="var(--warning)" />
        <p style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 500 }}>
          {pct}% used — only {fmt(limit - spent)} left
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
      padding: '6px 10px', background: '#22c55e12', border: '1px solid #22c55e30', borderRadius: 8 }}>
      <CheckCircle size={13} color="var(--success)" />
      <p style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 500 }}>
        Under control — {fmt(limit - spent)} remaining
      </p>
    </div>
  );
}

export { getAlerts };
export default DashboardAlerts;
