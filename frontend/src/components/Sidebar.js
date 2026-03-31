import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NAV = [
  { id: 'overview',  icon: '🏠', label: 'Overview' },
  { id: 'predict',   icon: '🔮', label: 'Predict Stress' },
  { id: 'history',   icon: '📋', label: 'History' },
  { id: 'tips',      icon: '💡', label: 'Sleep Tips' },
  { id: 'about',     icon: '📊', label: 'About Model' },
];

export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside style={{
      width: 258, minHeight: '100vh', background: '#181626',
      borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex',
      flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh',
      zIndex: 100, overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, background: 'linear-gradient(135deg,#7c5cfc,#0d9488)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 4px 14px rgba(124,92,252,.3)',
          }}>🌙</div>
          <div style={{ fontFamily: 'Sora', fontSize: 17, fontWeight: 700 }}>
            Sleep <span style={{ color: '#a78bfa' }}>StressFree</span>
          </div>
        </div>
        <div style={{
          background: '#1c1a28', borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c5cfc,#f472b6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Sora', fontWeight: 700, fontSize: 13, flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#2dd4bf', fontWeight: 500 }}>Sleep Analyst</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, color: '#615d7a', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '0 10px', marginBottom: 6, fontWeight: 600 }}>Main</div>
        {NAV.slice(0, 3).map(item => (
          <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNav(item.id)} />
        ))}
        <div style={{ fontSize: 10, color: '#615d7a', letterSpacing: '1.2px', textTransform: 'uppercase', padding: '18px 10px 6px', fontWeight: 600 }}>Insights</div>
        {NAV.slice(3).map(item => (
          <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNav(item.id)} />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 8, width: '100%', background: 'none', border: 'none',
          color: '#615d7a', fontSize: 14, fontFamily: 'DM Sans', cursor: 'pointer',
          transition: 'all .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(248,113,113,.1)'; e.currentTarget.style.color='#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#615d7a'; }}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ item, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      borderRadius: 8, cursor: 'pointer', marginBottom: 2,
      background: active ? 'rgba(124,92,252,.18)' : 'transparent',
      color: active ? '#a78bfa' : '#9d99b8',
      fontWeight: active ? 500 : 400, fontSize: 14, transition: 'all .2s',
    }}
      onMouseEnter={e => !active && (e.currentTarget.style.background='#1c1a28', e.currentTarget.style.color='#ede9ff')}
      onMouseLeave={e => !active && (e.currentTarget.style.background='transparent', e.currentTarget.style.color='#9d99b8')}>
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
    </div>
  );
}
