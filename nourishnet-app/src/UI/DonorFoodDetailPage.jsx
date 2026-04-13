import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import FilterBar from './FilterBar';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const ALL_FOOD_TYPES = [...new Set(locations.flatMap(l => l.foodTypes || []))].sort();

function DonorFoodDetailPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { foodType } = useParams();
  const decoded = decodeURIComponent(foodType);
  const baseFiltered = locations.filter(l => l.foodTypes && l.foodTypes.some(ft => ft.toLowerCase() === decoded.toLowerCase()));
  const [filters, setFilters] = useState({ health: new Set(), food: new Set(), sort: 'name' });
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = [...baseFiltered];
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); result = result.filter(l => (l.name||'').toLowerCase().includes(q) || (l.address?.city||'').toLowerCase().includes(q)); }
    if (filters.health.size > 0) result = result.filter(l => l.healthAttributes && [...filters.health].every(a => l.healthAttributes[a]));
    if (filters.food.size > 0) result = result.filter(l => l.foodTypes && l.foodTypes.some(ft => filters.food.has(ft)));
    result.sort(filters.sort === 'name' ? (a,b) => (a.name||'').localeCompare(b.name||'') : (a,b) => (b.insecurityIndex||0)-(a.insecurityIndex||0));
    return result;
  }, [baseFiltered, filters, searchQuery]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/donor" activeNav="home" navPrefix="/donor" onSearch={setSearchQuery} />
      <h1 className="fd-title">{decoded}</h1>
      <p className="fd-count">{baseFiltered.length} {t('ui.locations')}</p>
      <FilterBar allFoodTypes={ALL_FOOD_TYPES} onFilter={setFilters} totalCount={baseFiltered.length} filteredCount={filtered.length} />
      <div className="fd-list">
        {filtered.map(loc => (<DonorCard key={loc.id} loc={loc} t={t} navigate={navigate} prefix="/donor" />))}
        {filtered.length === 0 && <p className="fd-empty">No locations found</p>}
      </div>
    </div>
  );
}

function DonorCard({ loc, t, navigate, prefix }) {
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  const requirements = Array.isArray(loc.requirements) ? loc.requirements.join(', ') : loc.requirements || '';
  const website = loc.website || '';
  const sourceName = loc.source?.source_name || '';
  const sourceUrl = loc.source?.source_url || loc.source?.extracted_from || '';
  return (
    <div className="fd-card">
      <div className="fd-card-top"><div><span className="fd-card-name">{loc.name}</span><span className="fd-card-partner">{t('ui.partner')}</span></div>
        <button className="fd-card-details" onClick={() => setExpanded(!expanded)}>{expanded ? t('ui.hideDetails') : t('ui.showDetails')}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}><polyline points="6 9 12 15 18 9" /></svg></button></div>
      <div className="fd-card-meta"><span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span><span>📍 {addr}</span></div>
      <div className={`fd-card-expand${expanded ? ' fd-card-expand--open' : ''}`}><div className="fd-card-expand-inner">
        {website && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">🔗 Website</span><a href={website} target="_blank" rel="noopener noreferrer" className="fd-card-detail-link">{website}</a></div>)}
        {requirements && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">📋 Requirements</span><span className="fd-card-detail-value">{requirements}</span></div>)}
        {(sourceName||sourceUrl) && (<div className="fd-card-detail-row"><span className="fd-card-detail-label">📄 Source</span>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="fd-card-detail-link">{sourceName||sourceUrl}</a> : <span className="fd-card-detail-value">{sourceName}</span>}</div>)}
        <button className="fd-card-map-btn" onClick={() => navigate(`${prefix}/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
      </div></div>
      <div className="fd-card-bottom"><div className="fd-card-tags">{(loc.foodTypes||[]).slice(0,5).map(ft => (<button key={ft} className="fd-card-tag" onClick={() => navigate(`${prefix}/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>))}</div>
        <a className="fd-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a></div>
    </div>
  );
}

export default DonorFoodDetailPage;
