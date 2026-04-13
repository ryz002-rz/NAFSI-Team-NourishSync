import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import FilterBar from './FilterBar';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const ALL_FOOD_TYPES = [...new Set(locations.flatMap(l => l.foodTypes || []))].sort();

function DonorHealthDetailPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { attr } = useParams();
  const decoded = decodeURIComponent(attr);
  const attrKey = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'].find(
    k => k.toLowerCase() === decoded.toLowerCase()
  ) || decoded;
  const baseFiltered = locations.filter(l => l.healthAttributes && l.healthAttributes[attrKey]);
  const displayName = t(`filter.${attrKey}`, decoded);
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
      <h1 className="fd-title">{displayName}</h1>
      <p className="fd-count">{baseFiltered.length} {t('ui.locations')}</p>
      <FilterBar allFoodTypes={ALL_FOOD_TYPES} onFilter={setFilters} totalCount={baseFiltered.length} filteredCount={filtered.length} />
      <div className="fd-list">
        {filtered.map(loc => {
          const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
          const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
          return (
            <div key={loc.id} className="fd-card">
              <div className="fd-card-top"><div><span className="fd-card-name">{loc.name}</span><span className="fd-card-partner">{t('ui.partner')}</span></div></div>
              <div className="fd-card-meta"><span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span><span>📍 {addr}</span></div>
              <div className="fd-card-bottom"><div className="fd-card-tags">{(loc.foodTypes||[]).slice(0,5).map(ft => (<button key={ft} className="fd-card-tag" onClick={() => navigate(`/donor/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>))}</div>
                <a className="fd-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a></div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="fd-empty">No locations found</p>}
      </div>
    </div>
  );
}

export default DonorHealthDetailPage;
