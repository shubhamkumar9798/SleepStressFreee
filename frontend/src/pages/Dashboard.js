import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import PredictTab from '../components/PredictTab';
import { HistoryTab, TipsTab, AboutTab } from '../components/OtherTabs';

export default function Dashboard() {
  const [active, setActive] = useState('overview');

  const tabs = {
    overview: <Overview onNav={setActive} />,
    predict:  <PredictTab />,
    history:  <HistoryTab />,
    tips:     <TipsTab />,
    about:    <AboutTab />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0e17' }}>
      {/* Animated bg orbs */}
      <div style={{ position: 'fixed', width: 480, height: 480, borderRadius: '50%', filter: 'blur(90px)', background: 'rgba(124,92,252,.08)', top: -140, right: -80, zIndex: 0, pointerEvents: 'none', animation: 'float 10s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', width: 320, height: 320, borderRadius: '50%', filter: 'blur(80px)', background: 'rgba(45,212,191,.05)', bottom: '10%', left: 270, zIndex: 0, pointerEvents: 'none', animation: 'float 12s ease-in-out 4s infinite' }} />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        input[type=range] { -webkit-appearance: none; background: transparent; cursor: pointer; }
        input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; background: #1c1a28; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg,#7c5cfc,#2dd4bf); border: 2px solid #181626; margin-top: -6px; }
        input[type=range]:focus { outline: none; }
      `}</style>

      <Sidebar active={active} onNav={setActive} />

      <main style={{ marginLeft: 258, flex: 1, padding: '36px 40px', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {tabs[active]}
      </main>
    </div>
  );
}
