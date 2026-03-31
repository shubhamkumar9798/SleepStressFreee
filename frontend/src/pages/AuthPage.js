import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const S = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse at 70% 20%, rgba(124,92,252,.13) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45,212,191,.09) 0%, transparent 50%), #0f0e17',
    overflow: 'hidden', position: 'relative',
  },
  wrap: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 1080, width: '100%',
    minHeight: '100vh', position: 'relative', zIndex: 1,
  },
  hero: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '64px 56px',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 },
  brandIcon: {
    width: 46, height: 46, background: 'linear-gradient(135deg,#7c5cfc,#0d9488)',
    borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, boxShadow: '0 8px 24px rgba(124,92,252,.35)',
  },
  brandName: { fontFamily: 'Sora', fontSize: 19, fontWeight: 700, color: '#ede9ff' },
  h1: { fontFamily: 'Sora', fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 18, color: '#ede9ff' },
  heroP: { color: '#9d99b8', fontSize: 15, lineHeight: 1.7, maxWidth: 380, marginBottom: 40 },
  feats: { display: 'flex', flexDirection: 'column', gap: 16 },
  feat: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  featIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: 'rgba(124,92,252,.14)', border: '1px solid rgba(124,92,252,.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  featText: { fontSize: 13.5, color: '#9d99b8', lineHeight: 1.5 },
  featTitle: { display: 'block', color: '#ede9ff', fontWeight: 500, marginBottom: 2, fontSize: 14 },
  authPanel: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' },
  authBox: {
    background: '#181626', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 400,
    boxShadow: '0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(124,92,252,.08)',
  },
  tabs: { display: 'flex', background: '#1c1a28', borderRadius: 10, padding: 4, marginBottom: 30 },
  tab: {
    flex: 1, padding: '9px 0', textAlign: 'center', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'Sora', fontSize: 13, fontWeight: 500, transition: 'all .2s', userSelect: 'none',
  },
  formGroup: { marginBottom: 17 },
  label: { display: 'block', fontSize: 11, fontWeight: 500, color: '#615d7a', textTransform: 'uppercase', letterSpacing: '.9px', marginBottom: 7 },
  input: {
    width: '100%', padding: '13px 16px', background: '#1c1a28',
    border: '1.5px solid rgba(255,255,255,.07)', borderRadius: 10,
    color: '#ede9ff', fontFamily: 'DM Sans', fontSize: 15, outline: 'none',
    transition: 'all .2s',
  },
  btn: {
    width: '100%', padding: 14, border: 'none', borderRadius: 10,
    background: 'linear-gradient(135deg,#7c5cfc,#5a3de8)', color: 'white',
    fontFamily: 'Sora', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'all .2s', marginTop: 4, letterSpacing: '.3px',
    boxShadow: '0 4px 20px rgba(124,92,252,.3)',
  },
  errorBox: {
    background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)',
    color: '#f87171', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14,
  },
};

export default function AuthPage() {
  const [tab, setTab]         = useState('login');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();
  const navigate              = useNavigate();
  const canvasRef             = useRef(null);

  // Animated star canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, a: Math.random(),
      speed: Math.random() * 0.005 + 0.002, phase: Math.random() * Math.PI * 2,
    }));
    let raf;
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a = 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name) { setError('Name is required'); setLoading(false); return; }
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const switchTab = (t) => { setTab(t); setError(''); };
  const inputStyle = (focused) => ({ ...S.input, borderColor: focused ? '#7c5cfc' : 'rgba(255,255,255,.07)', boxShadow: focused ? '0 0 0 4px rgba(124,92,252,.12)' : 'none' });
  const [foc, setFoc] = useState({});

  return (
    <div style={S.page}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div style={S.wrap}>
        {/* Hero */}
        <div style={S.hero}>
          <div style={S.brandRow}>
            <div style={S.brandIcon}>🌙</div>
            <div style={S.brandName}>Sleep <span style={{ color: '#a78bfa' }}>StressFree</span></div>
          </div>
          <h1 style={S.h1}>
            Sleep better.<br />
            <span style={{ background: 'linear-gradient(135deg,#a78bfa,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Stress less.
            </span><br />
            Live fully.
          </h1>
          <p style={S.heroP}>
            AI-powered sleep stress analysis from your physiological biomarkers.
            Get personalized, evidence-based recommendations to transform your sleep.
          </p>
          <div style={S.feats}>
            {[
              ['🧠', 'ML Stress Prediction', 'Trained on real sleep biomarker data with 100% accuracy.'],
              ['💡', 'Personalized Suggestions', 'Tailored recovery tips based on your exact stress level.'],
              ['📊', 'Progress Tracking', 'Monitor your stress trends over time stored in MongoDB.'],
            ].map(([icon, title, text]) => (
              <div style={S.feat} key={title}>
                <div style={S.featIcon}>{icon}</div>
                <div style={S.featText}><strong style={S.featTitle}>{title}</strong>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth box */}
        <div style={S.authPanel}>
          <div style={S.authBox}>
            <div style={S.tabs}>
              {['login', 'register'].map(t => (
                <div key={t} style={{ ...S.tab,
                  background: tab === t ? '#7c5cfc' : 'transparent',
                  color: tab === t ? 'white' : '#615d7a',
                  boxShadow: tab === t ? '0 4px 12px rgba(124,92,252,.35)' : 'none',
                }} onClick={() => switchTab(t)}>
                  {t === 'login' ? 'Sign In' : 'Sign Up'}
                </div>
              ))}
            </div>

            {error && <div style={S.errorBox}>{error}</div>}

            <form onSubmit={submit}>
              {tab === 'register' && (
                <div style={S.formGroup}>
                  <label style={S.label}>Full Name</label>
                  <input style={inputStyle(foc.name)} type="text" placeholder="Your name"
                    value={name} onChange={e => setName(e.target.value)}
                    onFocus={() => setFoc(f => ({...f, name:true}))}
                    onBlur={() => setFoc(f => ({...f, name:false}))} />
                </div>
              )}
              <div style={S.formGroup}>
                <label style={S.label}>Email Address</label>
                <input style={inputStyle(foc.email)} type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFoc(f => ({...f, email:true}))}
                  onBlur={() => setFoc(f => ({...f, email:false}))} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Password</label>
                <input style={inputStyle(foc.pw)} type="password" placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFoc(f => ({...f, pw:true}))}
                  onBlur={() => setFoc(f => ({...f, pw:false}))} />
              </div>
              <button type="submit" style={{ ...S.btn, opacity: loading ? .7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                disabled={loading} onMouseEnter={e => !loading && (e.target.style.transform='translateY(-2px)', e.target.style.boxShadow='0 8px 28px rgba(124,92,252,.45)')}
                onMouseLeave={e => (e.target.style.transform='', e.target.style.boxShadow='0 4px 20px rgba(124,92,252,.3)')}>
                {loading ? '⏳ Please wait...' : tab === 'login' ? '🚀 Sign In' : '✨ Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
