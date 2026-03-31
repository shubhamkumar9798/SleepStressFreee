import React, { useEffect, useState } from 'react';
import axios from 'axios';

const COLORS = ['#4ade80','#2dd4bf','#fbbf24','#f97316','#ef4444'];
const card = { background:'#181626', border:'1px solid rgba(255,255,255,.06)', borderRadius:12, padding:'22px 24px' };

// ── History ──────────────────────────────────────────────────────────────────
export function HistoryTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/history')
      .then(r => setRows(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily:'Sora', fontSize:24, fontWeight:700, marginBottom:5 }}>📋 Prediction History</h2>
        <p style={{ color:'#9d99b8', fontSize:14 }}>All your past stress assessments stored in MongoDB</p>
      </div>
      <div style={card}>
        <div style={{ fontFamily:'Sora', fontSize:15, fontWeight:600, marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>📋 All Predictions</span>
          <span style={{ fontSize:12, color:'#615d7a', fontWeight:400 }}>{rows.length} records</span>
        </div>
        {loading ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:'#615d7a' }}>Loading...</div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <div style={{ fontSize:44, opacity:.3, marginBottom:12 }}>📭</div>
            <div style={{ fontFamily:'Sora', fontSize:16, fontWeight:600, marginBottom:6 }}>No history yet</div>
            <div style={{ color:'#9d99b8', fontSize:13 }}>Your predictions will appear here</div>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Date & Time','Stress Level','Score','Snoring','Blood O₂','Resp. Rate','Confidence'].map(h => (
                    <th key={h} style={{ fontSize:11, color:'#615d7a', textTransform:'uppercase', letterSpacing:'.7px', padding:'8px 10px', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,.06)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r._id} style={{ transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#1c1a28'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'11px 10px', fontSize:13, color:'#ede9ff', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                      {new Date(r.created).toLocaleString()}
                    </td>
                    <td style={{ padding:'11px 10px', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                      <span className={`tag tag-${r.stress_level}`}>{r.stress_label}</span>
                    </td>
                    <td style={{ padding:'11px 10px', fontSize:13, color:COLORS[r.stress_level], fontFamily:'Sora', fontWeight:600, borderBottom:'1px solid rgba(255,255,255,.04)' }}>{r.stress_level}/4</td>
                    <td style={{ padding:'11px 10px', fontSize:13, color:'#9d99b8', borderBottom:'1px solid rgba(255,255,255,.04)' }}>{r.features?.sr?.toFixed(1)}</td>
                    <td style={{ padding:'11px 10px', fontSize:13, color:'#9d99b8', borderBottom:'1px solid rgba(255,255,255,.04)' }}>{r.features?.bo?.toFixed(1)}%</td>
                    <td style={{ padding:'11px 10px', fontSize:13, color:'#9d99b8', borderBottom:'1px solid rgba(255,255,255,.04)' }}>{r.features?.rr?.toFixed(1)}</td>
                    <td style={{ padding:'11px 10px', fontSize:13, color:'#a78bfa', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,.04)' }}>{r.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tips ─────────────────────────────────────────────────────────────────────
export function TipsTab() {
  const sections = [
    {
      title:'No / Low Stress', icon:'😌', tag:'tag-0', tagLabel:'Levels 0–1',
      tips:[
        ['🌙','Consistent sleep schedule','Go to bed and wake at the same time daily — even weekends. This anchors your circadian rhythm for optimal recovery.'],
        ['📵','Screen curfew 45 mins before bed','Blue light suppresses melatonin. Use Night Mode or blue-light glasses during the last hour before sleep.'],
        ['🚶','10-min evening walk','A relaxed post-dinner walk lowers cortisol and signals the nervous system to begin winding down.'],
        ['💧','Hydration timing','Drink your last large glass of water 2 hours before bed to avoid disruptive midnight bathroom trips.'],
      ]
    },
    {
      title:'Medium Stress', icon:'😐', tag:'tag-2', tagLabel:'Level 2',
      tips:[
        ['🧊','Cool shower before bed','A 2-min cool shower drops your core temp — the body\'s most reliable trigger for deep non-REM sleep.'],
        ['📔','Worry journaling','Write 3 concerns + 3 wins before bed. This offloads mental load and can reduce sleep latency by ~15 min.'],
        ['🌬️','4-7-8 Breathing','Inhale 4s, hold 7s, exhale 8s. Do 4 cycles to activate your parasympathetic nervous system naturally.'],
        ['🎵','Binaural beats or white noise','432Hz or delta-wave audio deepens REM and reduces cortisol-driven micro-awakenings significantly.'],
      ]
    },
    {
      title:'High Stress', icon:'😟', tag:'tag-3', tagLabel:'Level 3',
      tips:[
        ['🧠','Progressive muscle relaxation','Tense then release each muscle group from toes upward. 20 minutes reduces sleep-onset anxiety by ~40%.'],
        ['🚫','No caffeine after 1 PM','Caffeine\'s 6-hour half-life means a 3pm coffee still has 50% potency at 9pm — it fragments sleep architecture.'],
        ['🛋️','Bed = sleep only','Stop working in bed. Condition your brain to associate bed exclusively with sleep and rest.'],
        ['🫖','Ashwagandha tea','Clinical studies: 300mg Ashwagandha before bed reduces cortisol by ~30% and improves sleep quality scores.'],
      ]
    },
    {
      title:'Very High Stress', icon:'😰', tag:'tag-4', tagLabel:'Level 4',
      tips:[
        ['🏥','Consult a sleep specialist','Persistent very-high stress with elevated HR and snoring may indicate sleep apnea or anxiety disorder.'],
        ['📱','Track Heart Rate Variability','HRV is the gold-standard real-time stress biomarker. Use a wearable to build a personal baseline.'],
        ['🧘','MBSR Program (8 weeks)','Mindfulness-Based Stress Reduction has a proven 40% reduction in clinical sleep stress scores in 8 weeks.'],
        ['🚨','Eliminate alcohol completely','Even 1 drink fragments REM sleep and worsens snoring. Eliminate temporarily to re-establish a baseline.'],
      ]
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily:'Sora', fontSize:24, fontWeight:700, marginBottom:5 }}>💡 Sleep & Stress Tips</h2>
        <p style={{ color:'#9d99b8', fontSize:14 }}>Evidence-based strategies to improve your sleep quality at every stress level</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {sections.map(s => (
          <div key={s.title} style={card}>
            <div style={{ fontFamily:'Sora', fontSize:15, fontWeight:600, marginBottom:18, display:'flex', alignItems:'center', gap:8, justifyContent:'space-between' }}>
              <span>{s.icon} {s.title}</span>
              <span className={`tag ${s.tag}`}>{s.tagLabel}</span>
            </div>
            {s.tips.map(([icon, title, text], i) => (
              <div key={i} style={{ display:'flex', gap:12, paddingBottom:12, marginBottom:12, borderBottom: i < s.tips.length-1 ? '1px solid rgba(255,255,255,.06)':'none' }}>
                <div style={{ width:34, height:34, borderRadius:9, background:'rgba(124,92,252,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:3 }}>{title}</div>
                  <div style={{ fontSize:12, color:'#9d99b8', lineHeight:1.6 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
export function AboutTab() {
  const features = [
    ['sr','Snoring Range','40–100','Higher values indicate heavier snoring'],
    ['rr','Respiration Rate','14–30','Breaths per minute during sleep'],
    ['t','Body Temperature °F','85–100','Core body temp during sleep cycle'],
    ['lm','Limb Movement','3–20','Frequency of involuntary limb movements'],
    ['bo','Blood Oxygen %','80–100','SpO₂ level throughout the night'],
    ['rem','REM Sleep','55–105','REM sleep stage depth/duration index'],
    ['hr','Heart Rate delta','0–10','HR deviation from baseline'],
    ['sr2','SR Index','48–85','Secondary snoring range composite'],
  ];
  const stressLevels = [
    [0,'No Stress','#4ade80','😌','Excellent sleep vitals. Peak recovery state.'],
    [1,'Low Stress','#2dd4bf','🙂','Minor signals. Small tweaks restore perfect sleep.'],
    [2,'Medium Stress','#fbbf24','😐','Moderate impact on sleep architecture. Action recommended.'],
    [3,'High Stress','#f97316','😟','Significant sleep quality impact. Intervention needed.'],
    [4,'Very High Stress','#ef4444','😰','Critical levels. Medical consultation strongly advised.'],
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily:'Sora', fontSize:24, fontWeight:700, marginBottom:5 }}>📊 About the Dataset & Model</h2>
        <p style={{ color:'#9d99b8', fontSize:14 }}>SaYoPillow Smart Sleep Monitoring Dataset — Technical Details</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div style={card}>
          <div style={{ fontFamily:'Sora', fontSize:15, fontWeight:600, marginBottom:18 }}>📂 Dataset Features (X)</div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['Feature','Full Name','Range','Description'].map(h=><th key={h} style={{ fontSize:11,color:'#615d7a',textTransform:'uppercase',letterSpacing:'.7px',padding:'6px 8px',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,.06)' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {features.map(([f,n,r,d])=>(
                <tr key={f}>
                  <td style={{ padding:'9px 8px',fontSize:13,fontFamily:'Sora',fontWeight:600,color:'#a78bfa',borderBottom:'1px solid rgba(255,255,255,.04)' }}>{f}</td>
                  <td style={{ padding:'9px 8px',fontSize:13,color:'#ede9ff',borderBottom:'1px solid rgba(255,255,255,.04)' }}>{n}</td>
                  <td style={{ padding:'9px 8px',fontSize:12,color:'#9d99b8',borderBottom:'1px solid rgba(255,255,255,.04)',whiteSpace:'nowrap' }}>{r}</td>
                  <td style={{ padding:'9px 8px',fontSize:12,color:'#615d7a',borderBottom:'1px solid rgba(255,255,255,.04)' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={card}>
            <div style={{ fontFamily:'Sora', fontSize:15, fontWeight:600, marginBottom:14 }}>🎯 Stress Levels (y)</div>
            {stressLevels.map(([l,label,col,emoji,desc])=>(
              <div key={l} style={{ display:'flex',gap:12,paddingBottom:10,marginBottom:10,borderBottom: l<4?'1px solid rgba(255,255,255,.06)':'none' }}>
                <div style={{ width:34,height:34,borderRadius:9,background:`${col}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>{emoji}</div>
                <div>
                  <div style={{ fontSize:13,fontWeight:500,color:col,marginBottom:2 }}>Level {l} — {label}</div>
                  <div style={{ fontSize:12,color:'#9d99b8',lineHeight:1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ fontFamily:'Sora', fontSize:15, fontWeight:600, marginBottom:14 }}>🛠️ Tech Stack</div>
            {[['🐍','Backend','Python + Flask'],['🤖','ML Library','scikit-learn'],['🌲','Algorithm','Random Forest'],['🗄️','Database','MongoDB'],['⚛️','Frontend','React.js'],['📊','Charts','Recharts']].map(([i,l,v])=>(
              <div key={l} style={{ display:'flex',alignItems:'center',gap:10,background:'#1c1a28',borderRadius:8,padding:'9px 12px',marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{i}</span>
                <div>
                  <div style={{ fontSize:11,color:'#615d7a' }}>{l}</div>
                  <div style={{ fontFamily:'Sora',fontSize:13,fontWeight:600 }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
