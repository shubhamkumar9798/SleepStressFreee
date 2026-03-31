import React, { useState } from 'react';
import axios from 'axios';

const COLORS = ['#4ade80', '#2dd4bf', '#fbbf24', '#f97316', '#ef4444'];
const LABELS = ['No Stress', 'Low Stress', 'Medium Stress', 'High Stress', 'Very High Stress'];

const SLIDERS = [
  { key: 'sr',  label: 'Snoring Range',        icon: '🔊', min: 40,  max: 100, step: 0.1, def: 60   },
  { key: 'rr',  label: 'Respiration Rate',     icon: '💨', min: 14,  max: 30,  step: 0.1, def: 20   },
  { key: 't',   label: 'Body Temperature °F',  icon: '🌡️', min: 85,  max: 100, step: 0.1, def: 92   },
  { key: 'lm',  label: 'Limb Movement',        icon: '🦵', min: 3,   max: 20,  step: 0.1, def: 10   },
  { key: 'bo',  label: 'Blood Oxygen %',       icon: '🩸', min: 80,  max: 100, step: 0.1, def: 90   },
  { key: 'rem', label: 'REM Sleep',            icon: '😴', min: 55,  max: 105, step: 0.1, def: 85   },
  { key: 'hr',  label: 'Heart Rate (delta)',   icon: '❤️', min: 0,   max: 10,  step: 0.1, def: 2    },
  { key: 'sr2', label: 'SR Index',             icon: '📊', min: 48,  max: 85,  step: 0.1, def: 62   },
];

const card = { background: '#181626', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '22px 24px' };

function StressMeter({ level, label, confidence, desc, allProba }) {
  const col = COLORS[level];
  const pct = (level / 4) * 100;
  const emojis = ['😌', '🙂', '😐', '😟', '😰'];

  return (
    <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
      {/* SVG Arc Meter */}
      <svg width="200" height="140" viewBox="0 0 200 140" style={{ display: 'block', margin: '0 auto 12px' }}>
        <path d="M 25 120 A 75 75 0 1 1 175 120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 25 120 A 75 75 0 1 1 175 120" fill="none" stroke={col} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${pct * 2.36} 236`} style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s' }} />
        <text x="100" y="95" textAnchor="middle" fill={col} fontSize="32" fontFamily="Sora" fontWeight="700">{level}</text>
        <text x="100" y="113" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="DM Sans">/4</text>
      </svg>

      <div style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: col, marginBottom: 6 }}>
        {emojis[level]} {label}
      </div>
      <div style={{ fontSize: 13, color: '#9d99b8', lineHeight: 1.6, maxWidth: 260, margin: '0 auto 12px' }}>{desc}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124,92,252,.15)', border: '1px solid rgba(124,92,252,.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#a78bfa', fontWeight: 500 }}>
        🎯 Confidence: {confidence}%
      </div>

      {/* Mini probability bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, marginTop: 16 }}>
        {allProba.map((p, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{
                width: 14, background: COLORS[i], borderRadius: 3,
                height: Math.max(4, (p / 100) * 44),
                opacity: i === level ? 1 : 0.35, transition: 'height .6s ease',
              }} />
            </div>
            <div style={{ fontSize: 9, color: '#615d7a' }}>{p}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PredictTab() {
  const defaults = Object.fromEntries(SLIDERS.map(s => [s.key, s.def]));
  const [vals, setVals]     = useState(defaults);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, v) => setVals(prev => ({ ...prev, [key]: parseFloat(v) }));

  const predict = async () => {
    setLoading(true);
    try {
      const r = await axios.post('/api/predict', vals);
      setResult(r.data);
    } catch (e) {
      alert(e.response?.data?.error || 'Prediction failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 700, marginBottom: 5 }}>🔮 Stress Prediction</h2>
        <p style={{ color: '#9d99b8', fontSize: 14 }}>Enter your sleep biomarker values for an AI-powered stress assessment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Input card */}
        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚙️ Sleep Biomarkers</span>
            <span style={{ fontSize: 11, color: '#615d7a', fontWeight: 400 }}>Adjust sliders</span>
          </div>

          {SLIDERS.map(s => (
            <div key={s.key} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <span style={{ fontSize: 13, color: '#9d99b8' }}>{s.icon} {s.label}</span>
                <span style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, color: '#ede9ff', minWidth: 50, textAlign: 'right' }}>
                  {vals[s.key].toFixed(1)}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={vals[s.key]}
                onChange={e => update(s.key, e.target.value)}
                style={{ width: '100%', accentColor: '#7c5cfc', cursor: 'pointer', height: 4 }} />
            </div>
          ))}

          <button onClick={predict} disabled={loading} style={{
            width: '100%', padding: 14, border: 'none', borderRadius: 10,
            background: loading ? '#1c1a28' : 'linear-gradient(135deg,#7c5cfc,#0d9488)',
            color: loading ? '#615d7a' : 'white', fontFamily: 'Sora', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: 6, letterSpacing: '.3px',
            transition: 'all .2s',
          }}
            onMouseEnter={e => !loading && (e.target.style.transform='translateY(-2px)', e.target.style.boxShadow='0 8px 24px rgba(124,92,252,.4)')}
            onMouseLeave={e => (e.target.style.transform='', e.target.style.boxShadow='none')}>
            {loading ? '🔄 Analysing...' : '🔮 Analyse My Stress Level'}
          </button>
        </div>

        {/* Result panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>📊 Result</div>
            {result ? (
              <StressMeter level={result.stress_level} label={result.stress_label}
                confidence={result.confidence} desc={result.desc} allProba={result.all_proba} />
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: 44, opacity: .3, marginBottom: 12 }}>🌙</div>
                <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Awaiting Analysis</div>
                <div style={{ color: '#9d99b8', fontSize: 13 }}>Adjust the sliders and click Analyse</div>
              </div>
            )}
          </div>

          {result && (
            <div style={card}>
              <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>💡 Personalized Suggestions</div>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < result.tips.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(124,92,252,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {tip.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{tip.title}</div>
                    <div style={{ fontSize: 12, color: '#9d99b8', lineHeight: 1.6 }}>{tip.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
