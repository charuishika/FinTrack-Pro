import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogoIcon, DashboardIcon, TransactionIcon, BudgetIcon,
  InsightIcon, LogoutIcon, ChevronLeftIcon, ChevronRightIcon,
  MenuIcon, CloseIcon
} from './Icons';

const navItems = [
  { to: '/', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/transactions', label: 'Transactions', Icon: TransactionIcon },
  { to: '/budgets', label: 'Budgets', Icon: BudgetIcon },
  { to: '/insights', label: 'AI Insights', Icon: InsightIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarContent = (
    <>
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <LogoIcon size={32} />
        {!collapsed && <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>FinTrack Pro</span>}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          className="hide-mobile">
          {collapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0.7rem 0.9rem', borderRadius: 10,
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
              background: isActive ? '#6c63ff20' : 'transparent',
              color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden',
            })}>
            <span style={{ flexShrink: 0 }}><Icon size={18} /></span>
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem', flexShrink: 0, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="btn btn-ghost"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LogoutIcon size={16} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'fixed', height: '100vh', zIndex: 200,
      }} className="hide-mobile">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', zIndex: 300,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s',
      }} className="mobile-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 250 }} />
      )}

      {/* Main content */}
      <main style={{
        marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        flex: 1, transition: 'margin-left 0.3s', minHeight: '100vh', minWidth: 0,
      }}>
        {/* Mobile header */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}
          className="mobile-top-bar">
          <button onClick={() => setMobileOpen(o => !o)} className="hamburger">
            {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
          <LogoIcon size={24} />
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '1rem' }}>FinTrack Pro</span>
        </div>

        <div style={{ padding: '2rem' }} className="page-padding">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-top-bar { display: flex !important; }
          main { margin-left: 0 !important; }
          .page-padding { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
