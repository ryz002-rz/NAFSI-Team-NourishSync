import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './WelcomePage.css';
import LanguagePopover from './LanguagePopover';

import imgDaria from './assets/daria-strategy.jpg';
import imgNico from './assets/nico-smit.jpg';
import imgJoelCommunity from './assets/joel-muniz-community.jpg';
import imgJoelGroup from './assets/joel-muniz-group.jpg';
import imgJoelVolunteer from './assets/joel-muniz-volunteer.jpg';
import imgMelanie from './assets/melanie-lim.jpg';
import imgMegan from './assets/megan-thomas.jpg';
import imgElaine from './assets/elaine-casap.jpg';
import imgDonna1 from './assets/donna-spearman-1.jpg';
import imgDonna2 from './assets/donna-spearman-2.jpg';
import imgJacob from './assets/jacob-mcgowin.jpg';
import imgAaron from './assets/aaron-doucett.jpg';
import arrowIcon from './assets/arrow-right.svg';

const FLOAT_IMAGES = [
  { src: imgElaine, x: 3, y: 12, w: 180, h: 220, depth: 0.03 },
  { src: imgDaria, x: 25, y: 4, w: 160, h: 120, depth: 0.04 },
  { src: imgMegan, x: 42, y: 8, w: 130, h: 110, depth: 0.025 },
  { src: imgNico, x: 62, y: 2, w: 170, h: 130, depth: 0.035 },
  { src: imgAaron, x: 88, y: 5, w: 140, h: 170, depth: 0.02 },
  { src: imgJoelCommunity, x: 12, y: 42, w: 180, h: 150, depth: 0.045 },
  { src: imgDonna2, x: 75, y: 30, w: 170, h: 140, depth: 0.03 },
  { src: imgMelanie, x: 88, y: 55, w: 130, h: 160, depth: 0.04 },
  { src: imgJacob, x: 18, y: 75, w: 150, h: 110, depth: 0.035 },
  { src: imgDonna1, x: 38, y: 78, w: 140, h: 130, depth: 0.05 },
  { src: imgJoelGroup, x: 78, y: 78, w: 160, h: 130, depth: 0.025 },
  { src: imgJoelVolunteer, x: 0, y: 72, w: 120, h: 100, depth: 0.04 },
];

function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf;
    const handleMove = (e) => { const cx = window.innerWidth/2, cy = window.innerHeight/2; mouseRef.current = { x: (e.clientX-cx)/cx, y: (e.clientY-cy)/cy }; };
    const handleTouch = (e) => { const t = e.touches[0], cx = window.innerWidth/2, cy = window.innerHeight/2; mouseRef.current = { x: (t.clientX-cx)/cx, y: (t.clientY-cy)/cy }; };
    const tick = () => { setOffset(p => ({ x: p.x+(mouseRef.current.x-p.x)*0.06, y: p.y+(mouseRef.current.y-p.y)*0.06 })); raf = requestAnimationFrame(tick); };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleTouch, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('touchmove', handleTouch); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="welcome-root">
      <header className="welcome-header">
        <button className="welcome-back" onClick={() => navigate('/')} aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <LanguagePopover />
      </header>
      <div className="welcome-images">
        {FLOAT_IMAGES.map((img, i) => (
          <div key={i} className="welcome-float-img" style={{ left: `${img.x}%`, top: `${img.y}%`, width: img.w, height: img.h, transform: `translate(${offset.x*img.depth*800}px, ${offset.y*img.depth*800}px)` }}>
            <img src={img.src} alt="" />
          </div>
        ))}
      </div>
      <div className="welcome-center">
        <h1 className="welcome-title">{t('ui.oneTool')}<br />{t('ui.oneCommunity')}<br />{t('ui.oneMission')}</h1>
        <button className="welcome-start-btn" onClick={() => navigate('/portal')} aria-label={t('ui.start')}>
          <span className="welcome-start-text">{t('ui.start')}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dcfce8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="welcome-start-arrow">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
