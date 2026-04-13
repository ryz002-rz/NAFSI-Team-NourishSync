import React, { useState } from 'react';
import SearchHeader from './SearchHeader';
import './AboutPage.css';
import imgChristian from './assets/christian.jpg';
import imgJoshua from './assets/joshua.jpg';
import imgJoe from './assets/joe.jpg';
import imgRyan from './assets/ryan.jpg';

const TEAM = [
  {
    id: 'christian', name: 'Christian Lee', role: 'LEAD DEVELOPER', img: imgChristian,
    bio: '4th Year Cognitive Science, Design & Interaction at UC San Diego. Experienced in UX, system design, frontend/backend development, and has hosted multiple web projects with custom domains.',
  },
  {
    id: 'ryan', name: 'Ryan Zhang', role: 'UX ENGINEER', img: imgRyan,
    bio: '2nd Year Data Science at UC San Diego. Skilled in UI/UX, product management, and prompt engineering, currently building a fashion app with experience in product development.',
  },
  {
    id: 'joshua', name: 'Joshua Huang', role: 'DATA ENGINEER', img: imgJoshua,
    bio: '3rd Year Data Science at UC San Diego. Background in data analysis, Python/SQL, and data visualization, with consulting experience at UCSD\'s Center for Energy Research.',
  },
  {
    id: 'joe', name: 'Joe Lin', role: 'LOGIC DEVELOPER', img: imgJoe,
    bio: 'Computer Engineering at University of Washington. Creator of Taiwan\'s #1 earthquake warning iOS app with 2M+ users, with experience in firmware, robotics, and full-stack development.',
  },
];

function AboutPage() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <div className="about-root">
      <SearchHeader backTo="/portal" activeNav="about" navPrefix="/customer" />
      <h1 className="about-heading anim-up">Our leadership</h1>

      <div className="about-grid">
        {TEAM.map((m, i) => {
          const isOpen = expanded === m.id;
          return (
            <div key={m.id} className={`about-card${isOpen ? ' about-card--open' : ''} anim-up`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <div className="about-img-wrap">
                <img src={m.img} alt={m.name} className="about-img" />
              </div>
              <div className="about-info">
                <div className="about-name-row" onClick={() => toggle(m.id)}>
                  <span className="about-name">{m.name}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    className={`about-chevron${isOpen ? ' about-chevron--open' : ''}`}>
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
                <span className="about-role">{m.role}</span>
                <div className={`about-bio-area${isOpen ? ' about-bio-area--open' : ''}`}>
                  <p className="about-bio">{m.bio}</p>
                </div>
                {isOpen && (
                  <button className="about-collapse" onClick={() => toggle(m.id)} aria-label="Collapse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AboutPage;
