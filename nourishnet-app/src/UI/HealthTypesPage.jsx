import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './FoodTypesPage.css';

const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];

function HealthTypesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="ft-root">
      <SearchHeader backTo="/customer" activeNav="home" navPrefix="/customer" />
      <h1 className="ft-title">{t('ui.healthAttribute')}</h1>
      <div className="ft-grid">
        {HEALTH_ATTRS.map((attr) => (
          <button key={attr} className="ft-card" onClick={() => navigate(`/customer/health/${encodeURIComponent(attr)}`)}>
            <span className="ft-card-label">{t(`filter.${attr}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HealthTypesPage;
