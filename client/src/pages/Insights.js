import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BrainIcon, RefreshIcon } from '../components/Icons';
import toast from 'react-hot-toast';

const WarnSvg = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const TipSvg = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const TrophySvg = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M7 4h10l1 6c0 3.31-2.69 6-6 6S6 13.31 6 10L7 4z"/>
    <path d="M7 4H4l-1 4c0 2 1.5 3.5 4 4M17 4h3l1 4c0 2-1.5 3.5-4 4"/>
  </svg>
);

const TargetSvg = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const typeConfig = {
  warning: { color: 'var(--danger)', bg: '#ef444415', border: '#ef444440', icon: WarnSvg },
  tip: { color: 'var(--primary-light)', bg: '#6c63ff15', border: '#6c63ff40', icon: TipSvg },
  achievement: { color: 'var(--success)', bg: '#22c55e15', border: '#22c55e40', icon: TrophySvg },
};

export default function Insights() {
  const { getInsights } = useFinance();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await getInsights();
      setInsights(data);
    } catch {
      toast.error('Failed to fetch insights. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>AI Financial Insights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Powered by Gemini — personalized advice based on your spending</p>
      </div>

      {!insights && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#6c63ff20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainIcon size={30} color="var(--primary-light)" />
            </div>
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Get AI-Powered Insights</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            AI will analyze your transactions and give personalized financial advice.
          </p>
          <button className="btn btn-primary" onClick={analyze} style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            <BrainIcon size={18} color="white" /> Analyze My Finances
          </button>
        </div>
      )}

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <BrainIcon size={36} color="var(--primary-light)" />
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Analyzing your finances...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {insights && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ background: '#6c63ff12', border: '1px solid #6c63ff30' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6c63ff20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BrainIcon size={20} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ marginBottom: 6, color: 'var(--primary-light)' }}>Monthly Summary</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{insights.summary}</p>
              </div>
            </div>
          </div>

          {insights.insights?.map((ins, i) => {
            const cfg = typeConfig[ins.type] || typeConfig.tip;
            const IconComp = cfg.icon;
            return (
              <div key={i} className="card" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: cfg.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp color={cfg.color} />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: 6, color: cfg.color }}>{ins.title}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{ins.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {insights.savingsTip && (
            <div className="card" style={{ background: '#f59e0b12', border: '1px solid #f59e0b40' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TargetSvg color="var(--warning)" />
                </div>
                <div>
                  <h3 style={{ marginBottom: 6, color: 'var(--warning)' }}>Saving Tip for Next Month</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{insights.savingsTip}</p>
                </div>
              </div>
            </div>
          )}

          <button className="btn btn-ghost" onClick={analyze} style={{ alignSelf: 'flex-start' }}>
            <RefreshIcon size={16} /> Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}