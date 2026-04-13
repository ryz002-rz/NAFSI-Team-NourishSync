import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

function DonorSearchResultsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return locations.filter(l =>
      (l.name || '').toLowerCase().includes(q) ||
      (l.address?.street || '').toLowerCase().includes(q) ||
      (l.address?.city || '').toLowerCase().includes(q) ||
      (l.address?.zip || '').includes(q) ||
      (l.foodTypes || []).some(ft => ft.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/donor" activeNav="home" navPrefix="/donor" onSearch={setQuery} initialQuery={initialQuery} />
      <h1 className="fd-title">Search: "{query}"</h1>
      <p className="fd-count">{filtered.length} {t('ui.locations')}</p>
      <div className="fd-list">
        {filtered.map(loc => {
          const [expanded, setExpanded] = [false, () => {}]; // simplified
          const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
          const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
          return (
            <div key={loc.id} className="fd-card">
              <div className="fd-card-top">
                <div><span className="fd-card-name">{loc.name}</span><span className="fd-card-partner">{t('ui.partner')}</span></div>
              </div>
              <div className="fd-card-meta">
                <span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span>
                <span>📍 {addr}</span>
              </div>
              <div className="fd-card-bottom">
                <div className="fd-card-tags">{(loc.foodTypes || []).slice(0, 5).map(ft => (
                  <button key={ft} className="fd-card-tag" onClick={() => navigate(`/donor/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>
                ))}</div>
                <a className="fd-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
              </div>
            </div>
          );
        })}
        {query.trim() && filtered.length === 0 && <p className="fd-empty">No locations found for "{query}"</p>}
      </div>
    </div>
  );
}

export default DonorSearchResultsPage;
