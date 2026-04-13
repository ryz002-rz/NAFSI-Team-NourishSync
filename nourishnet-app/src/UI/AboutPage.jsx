import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './AboutPage.css';
import imgChristian from './assets/christian.jpg';
import imgJoshua from './assets/joshua.jpg';
import imgJoe from './assets/joe.jpg';
import imgRyan from './assets/ryan.jpg';

const TEAM = [
  {
    id: 'christian', name: 'Christian Lee', role: 'Lead Developer', img: imgChristian,
    bio: '4th Year Cognitive Science (Design & Interaction) at UC San Diego. Experienced in UX/system design, frontend/backend development, and has hosted multiple web projects with custom domains.',
  },
  {
    id: 'joshua', name: 'Joshua Huang', role: 'Data Engineer', img: imgJoshua,
    bio: '3rd Year Data Science at UC San Diego. Background in data analysis, Python/SQL, and data visualization, with consulting experience at UCSD\'s Center for Energy Research.',
  },
  {
    id: 'joe', name: 'Joe (Tzu-Yu) Lin', role: 'Logic Engineer', img: imgJoe,
    bio: 'Computer Engineering at University of Washington. Creator of Taiwan\'s #1 earthquake warning iOS app with 2M+ users, with experience in firmware, robotics, and full-stack development.',
  },
  {
    id: 'ryan', name: 'Ryan Zhang', role: 'UX Engineer', img: imgRyan,
    bio: '2nd Year Data Science at UC San Diego. Skilled in UI/UX, product management, and prompt engineering, currently building a fashion app with experience in product development.',
  },
];

function AboutPage() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="about-root">
      <SearchHeader backTo="/portal" activeNav="about" navPrefix="/customer" />
      <h1 className="about-title anim-fade-up">{t('ui.aboutUs')}</h1>
      <p className="about-subtitle anim-fade-up">NourishOne Team</p>
      <div className="about-grid">
        {TEAM.map((m, i) => (
          <div key={m.id} className={`about-card anim-fade-up ${expanded === m.id ? 'about-card--expanded' : ''}`}
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
            <div className="about-card-header" onClick={() => toggle(m.id)}>
              <div className="about-card-left">
                <img src={m.img} alt={m.name} className="about-avatar" />
                <div>
                  <span className="about-name">{m.name}</span>
                  <span className="about-role">{m.role}</span>
                </div>
              </div>
              <button className="about-expand-btn" aria-label="Expand">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`about-expand-icon ${expanded === m.id ? 'about-expand-icon--open' : ''}`}>
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
            <div className={`about-card-body ${expanded === m.id ? 'about-card-body--visible' : ''}`}>
              <div className="about-bio-wrap">
                <img src={m.img} alt={m.name} className="about-bio-img" />
                <p className="about-bio">{m.bio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
