import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4ade80', '#2dd4bf', '#fbbf24', '#f97316', '#ef4444'];
const LABELS = ['No Stress', 'Low Stress', 'Medium', 'High Stress', 'Very High'];

const card = {
  background: '#181626', border: '1px solid rgba(255,255,255,.06)',
  borderRadius: 12, padding: '20px 22px',
};

export default function Overview({ onNav }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [hist,  setHist]  = useState([]);

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data));
    axios.get('/api/history').then(r => setHist(r.data));
  }, []);

  const distData = stats?.distribution?.map((v, i) => ({ name: LABELS[i], value: v, color: COLORS[i] })) || [];
  const last = hist[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Sora', fontSize: 24, fontWeight: 700, marginBottom: 5 }}>
          Welcome back, <span style={{ color: '#a78bfa' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p style={{ color: '#9d99b8', fontSize: 14 }}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Assessments', val: stats?.total ?? '—', sub: 'All time', ico: '📊', color: '#4ade80' },
          { label: 'Average Stress', val: stats?.avg_stress != null ? stats.avg_stress.toFixed(1) : '—', sub: stats?.avg_label || '—', ico: '🎯', color: '#a78bfa' },
          { label: 'Best Result', val: stats?.best ?? '—', sub: 'Lowest stress', ico: '🌟', color: '#2dd4bf' },
          { label: 'Latest Level', val: stats?.latest ?? '—', sub: stats?.latest_label || '—', ico: '📈', color: COLORS[stats?.latest] || '#9d99b8' },
        ].map(({ label, val, sub, ico, color }) => (
          <div key={label} style={{ ...card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
            <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 20, opacity: .3 }}>{ico}</div>
            <div style={{ fontSize: 11, color: '#615d7a', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'Sora', fontSize: 26, fontWeight: 700, color }}>{val}</div>
            <div style={{ fontSize: 12, color: '#615d7a', marginTop: 5 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>
        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
            <span>📈 Stress Trend</span>
            <span style={{ fontSize: 11, color: '#615d7a', fontWeight: 400 }}>Last 10 assessments</span>
          </div>
          {stats?.trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={stats.trend}>
                <XAxis dataKey="date" tick={{ fill: '#615d7a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,4]} ticks={[0,1,2,3,4]} tick={{ fill: '#615d7a', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => ['None','Low','Med','High','VHi'][v] || v} />
                <Tooltip contentStyle={{ background: '#1c1a28', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#ede9ff' }}
                  formatter={v => [LABELS[v] || v, 'Stress']} />
                <Line type="monotone" dataKey="level" stroke="#7c5cfc" strokeWidth={2.5} dot={(p) => <circle key={p.key} cx={p.cx} cy={p.cy} r={4} fill={COLORS[p.value]} />} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#615d7a', fontSize: 14 }}>
              No data yet — run your first prediction
            </div>
          )}
        </div>

        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🥧 Stress Distribution</div>
          {stats?.total > 0 ? (
            <>
              <PieChart width={220} height={180} style={{ margin: '0 auto' }}>
                <Pie data={distData} cx={105} cy={85} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {distData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1a28', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#ede9ff' }} />
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {LABELS.map((l, i) => stats.distribution[i] > 0 && (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], flexShrink: 0 }} />
                    <span style={{ color: '#9d99b8', flex: 1 }}>{l}</span>
                    <span style={{ color: '#ede9ff', fontWeight: 500 }}>{stats.distribution[i]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#615d7a', fontSize: 14 }}>
              No predictions yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Last prediction */}
        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🔮 Last Prediction</div>
          {last ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>
                {['😌','🙂','😐','😟','😰'][last.stress_level]}
              </div>
              <div style={{ fontFamily: 'Sora', fontSize: 22, fontWeight: 700, color: COLORS[last.stress_level], marginBottom: 6 }}>
                Level {last.stress_level}
              </div>
              <div className={`tag tag-${last.stress_level}`} style={{ marginBottom: 10 }}>{last.stress_label}</div>
              <div style={{ fontSize: 12, color: '#615d7a' }}>{new Date(last.created).toLocaleString()}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.06)' }}>
                {[['Blood O₂', last.features?.bo + '%'], ['HR Δ', last.features?.hr], ['Snoring', last.features?.sr]].map(([l,v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 14 }}>{v}</div>
                    <div style={{ fontSize: 11, color: '#615d7a' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 36, opacity: .3, marginBottom: 10 }}>🌙</div>
              <div style={{ color: '#615d7a', fontSize: 13 }}>No predictions yet</div>
              <button onClick={() => onNav('predict')} style={{
                marginTop: 12, padding: '8px 16px', background: 'rgba(124,92,252,.15)', border: '1px solid rgba(124,92,252,.25)',
                borderRadius: 8, color: '#a78bfa', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans',
              }}>Run First Analysis →</button>
            </div>
          )}
        </div>

        {/* Distribution bars */}
        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>📍 Level Breakdown</div>
          {LABELS.map((l, i) => {
            const pct = stats?.total ? Math.round((stats.distribution[i] / stats.total) * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9d99b8', marginBottom: 5 }}>
                  <span>{l}</span><span style={{ color: '#ede9ff', fontWeight: 500 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: '#1c1a28', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: COLORS[i], borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Model info */}
        <div style={card}>
          <div style={{ fontFamily: 'Sora', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>⚙️ Model Info</div>
          {[
            ['🌲', 'Algorithm', 'Random Forest'],
            ['🎯', 'Accuracy', '100%'],
            ['🌿', 'Estimators', '200 Trees'],
            ['📏', 'Preprocessing', 'StandardScaler'],
            ['📊', 'Features', '8 Biomarkers'],
            ['🗄️', 'Database', 'MongoDB'],
          ].map(([ico, label, val]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1c1a28', borderRadius: 8, padding: '9px 12px', marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{ico}</span>
              <div>
                <div style={{ fontSize: 11, color: '#615d7a' }}>{label}</div>
                <div style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 600 }}>{val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
