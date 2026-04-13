import React, { useState } from 'react';
import SearchHeader from './SearchHeader';
import './AboutPage.css';
import imgChristian from './assets/christian.jpg';
import imgJoshua from './assets/joshua.jpg';
import imgJoe from './assets/joe.jpg';
import imgRyan from './assets/ryan.jpg';

const TEAM = [
  { id: 'christian', name: 'Christian Lee', role: 'LEAD DEVELOPER', img: imgChristian,
    bio: '4th Year Cognitive Science, Design & Interaction at UC San Diego. Experienced in UX, system design, frontend/backend development, and has hosted multiple web projects with custom domains.' },
  { id: 'ryan', name: 'Ryan Zhang', role: 'UX ENGINEER', img: imgRyan,
    bio: '2nd Year Data Science at UC San Diego. Skilled in UI/UX, product management, and prompt engineering, currently building a fashion app with experience in product development.' },
  { id: 'joshua', name: 'Joshua Huang', role: 'DATA ENGINEER', img: imgJoshua,
    bio: '3rd Year Data Science at UC San Diego. Background in data analysis, Python/SQL, and data visualization, with consulting experience at UCSD\'s Center for Energy Research.' },
  { id: 'joe', name: 'Joe Lin', role: 'LOGIC DEVELOPER', img: imgJoe,
    bio: 'Computer Engineering at University of Washington. Creator of Taiwan\'s #1 earthquake warning iOS app with 2M+ users, with experience in firmware, robotics, and full-stack development.' },
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
          const open = expanded === m.id;
          return (
            <div key={m.id} className="about-card anim-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
              <img src={m.img} alt={m.name} className={`about-img${open ? ' about-img--small' : ''}`} />
              <div className="about-name-row">
                <div>
                  <span className="about-name">{m.name}</span>
                  <span className="about-role">{m.role}</span>
                </div>
<<<<<<< Updated upstream
                <button className="about-arrow-btn" onClick={() => toggle(m.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
=======
                {!open && (
                  <button className="about-arrow-btn" onClick={() => toggle(m.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                )}
>>>>>>> Stashed changes
              </div>
              {open && (
                <div className="about-expand">
                  <div className="about-line" />
                  <p className="about-bio">{m.bio}</p>
                  <button className="about-close" onClick={() => toggle(m.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<<<<<<< Updated upstream
                      <polyline points="6 9 12 15 18 9" />
=======
                      <polyline points="18 15 12 9 6 15" />
>>>>>>> Stashed changes
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AboutPage;
