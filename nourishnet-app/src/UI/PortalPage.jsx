import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PortalPage.css';
import arrowIcon from './assets/arrow-right.svg';
import LanguagePopover from './LanguagePopover';

function PortalPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const portals = [
    { key: 'customer', title: t('ui.findFood'), desc: t('ui.findFoodDesc'), btn: t('ui.imCustomer'), route: '/customer' },
    { key: 'donor', title: t('ui.donate'), desc: t('ui.donateDesc'), btn: t('ui.imDonor'), route: '/donor' },
    { key: 'volunteer', title: t('ui.volunteer'), desc: t('ui.volunteerDesc'), btn: t('ui.imVolunteer'), route: '/volunteer' },
  ];

  const marquee = (t('ui.marquee') + ' ').repeat(8);

  return (
    <div className="portal-root">
      <header className="portal-header">
        <button className="portal-back" onClick={() => navigate('/welcome')} aria-label="Back">
          <img src={arrowIcon} alt="" className="portal-back-icon" />
        </button>
        <span className="portal-logo">{t('ui.nourishOne')}</span>
        <LanguagePopover />
      </header>
      <div className="portal-cards">
        {portals.map((p) => (
          <div key={p.key} className="portal-card">
            <h2 className="portal-card-title">{p.title}</h2>
            <div className="portal-card-divider" />
            <p className="portal-card-desc">{p.desc}</p>
            <button className="portal-card-btn" onClick={() => navigate(p.route)}>{p.btn}</button>
          </div>
        ))}
      </div>
      <div className="portal-marquee">
        <div className="portal-marquee-track">
          <span className="portal-marquee-text">{marquee}</span>
          <span className="portal-marquee-text">{marquee}</span>
        </div>
      </div>
    </div>
  );
}

export default PortalPage;
