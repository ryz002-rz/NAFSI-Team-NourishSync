import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

function SearchResultsPage() {
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
      <SearchHeader backTo="/customer" activeNav="home" navPrefix="/customer" onSearch={setQuery} initialQuery={initialQuery} />
      <h1 className="fd-title">Search: "{query}"</h1>
      <p className="fd-count">{filtered.length} {t('ui.locations')}</p>
      <div className="fd-list">
        {filtered.map(loc => (<ResultCard key={loc.id} loc={loc} t={t} navigate={navigate} />))}
        {query.trim() && filtered.length === 0 && <p className="fd-empty">No locations found for "{query}"</p>}
      </div>
    </div>
  );
}

function ResultCard({ loc, t, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  const requirements = Array.isArray(loc.requirements) ? loc.requirements.join(', ') : loc.requirements || '';
  const website = loc.website || '';
  const sourceName = loc.source?.source_name || '';
  const sourceUrl = loc.source?.source_url || loc.source?.extracted_from || '';

  return (
    <div className="fd-card">
      <div className="fd-card-top">
        <div>
          <span className="fd-card-name">{loc.name}</span>
          <span className="fd-card-partner">{t('ui.partner')}</span>
        </div>
        <button className="fd-card-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      <div className="fd-card-meta">
        <span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span>
        <span>📍 {addr}</span>
      </div>
      <div className={`fd-card-expand${expanded ? ' fd-card-expand--open' : ''}`}>
        <div className="fd-card-expand-inner">
          {website && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">🔗 Website</span><a href={website} target="_blank" rel="noopener noreferrer" className="fd-card-detail-link">{website}</a></div>)}
          {requirements && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">📋 Requirements</span><span className="fd-card-detail-value">{requirements}</span></div>)}
          {(sourceName || sourceUrl) && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">📄 Source</span>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="fd-card-detail-link">{sourceName || sourceUrl}</a> : <span className="fd-card-detail-value">{sourceName}</span>}</div>)}
          <button className="fd-card-map-btn" onClick={() => navigate(`/customer/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>
      <div className="fd-card-bottom">
        <div className="fd-card-tags">{(loc.foodTypes || []).slice(0, 5).map(ft => (<button key={ft} className="fd-card-tag" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>{ft}</button>))}</div>
        <a className="fd-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
      </div>
    </div>
  );
}

export default SearchResultsPage;
