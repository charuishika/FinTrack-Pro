import React, { useEffect, useState } from 'react';

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function InstallPWA({ collapsed }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setPrompt(null);
    }
  };

  if (installed) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0.6rem 0.9rem',
        background: '#22c55e15',
        border: '1px solid #22c55e30',
        borderRadius: 10,
        color: 'var(--success)',
        fontSize: '0.82rem',
        fontWeight: 500,
        marginBottom: 8,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <CheckIcon />
        {!collapsed && 'App Installed'}
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <button
      onClick={handleInstall}
      title="Install FinTrack Pro as an app"
      style={{
        display: 'flex', alignItems: 'center',
        gap: 8,
        padding: '0.6rem 0.9rem',
        background: 'linear-gradient(135deg, #6c63ff25, #22c55e15)',
        border: '1px solid #6c63ff40',
        borderRadius: 10,
        color: 'var(--primary-light)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
        width: '100%',
        marginBottom: 8,
        transition: 'all 0.2s',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #6c63ff35, #22c55e25)'}
      onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #6c63ff25, #22c55e15)'}
    >
      <DownloadIcon />
      {!collapsed && 'Install App'}
    </button>
  );
}
