import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FilterBar.css';

const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];
const SORT_OPTIONS = ['name', 'distance'];

function FilterBar({ allFoodTypes, onFilter, totalCount, filteredCount }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedHealth, setSelectedHealth] = useState(new Set());
  const [selectedFood, setSelectedFood] = useState(new Set());
  const [sort, setSort] = useState('name');

  const toggleHealth = (attr) => {
    const next = new Set(selectedHealth);
    next.has(attr) ? next.delete(attr) : next.add(attr);
    setSelectedHealth(next);
    onFilter({ health: next, food: selectedFood, sort });
  };

  const toggleFood = (ft) => {
    const next = new Set(selectedFood);
    next.has(ft) ? next.delete(ft) : next.add(ft);
    setSelectedFood(next);
    onFilter({ health: selectedHealth, food: next, sort });
  };

  const changeSort = (s) => {
    setSort(s);
    onFilter({ health: selectedHealth, food: selectedFood, sort: s });
  };

  const clearAll = () => {
    setSelectedHealth(new Set());
    setSelectedFood(new Set());
    setSort('name');
    onFilter({ health: new Set(), food: new Set(), sort: 'name' });
  };

  const hasFilters = selectedHealth.size > 0 || selectedFood.size > 0;

  return (
    <div className="fb-wrap">
      <div className="fb-header">
        <button className="fb-toggle" onClick={() => setOpen(!open)}>
          <span className="fb-toggle-text">
            🔍 Filter & Sort
            {hasFilters && <span className="fb-badge">{selectedHealth.size + selectedFood.size}</span>}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {hasFilters && <span className="fb-active-text">Showing {filteredCount} of {totalCount}</span>}
      </div>

      <div className={`fb-body${open ? ' fb-body--open' : ''}`}>
        <div className="fb-body-inner">
          {/* Sort */}
          <div className="fb-section">
            <label className="fb-label">Sort By</label>
            <div className="fb-pills">
              <button className={`fb-pill${sort === 'name' ? ' fb-pill--active' : ''}`} onClick={() => changeSort('name')}>Name (A-Z)</button>
              <button className={`fb-pill${sort === 'distance' ? ' fb-pill--active' : ''}`} onClick={() => changeSort('distance')}>Insecurity Index</button>
            </div>
          </div>

          {/* Health Attributes */}
          <div className="fb-section">
            <label className="fb-label">Health Attributes</label>
            <div className="fb-pills">
              {HEALTH_ATTRS.map(a => (
                <button key={a} className={`fb-pill${selectedHealth.has(a) ? ' fb-pill--active' : ''}`} onClick={() => toggleHealth(a)}>
                  {t(`filter.${a}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Food Types */}
          {allFoodTypes && allFoodTypes.length > 0 && (
            <div className="fb-section">
              <label className="fb-label">Food Types</label>
              <div className="fb-pills">
                {allFoodTypes.slice(0, 20).map(ft => (
                  <button key={ft} className={`fb-pill${selectedFood.has(ft) ? ' fb-pill--active' : ''}`} onClick={() => toggleFood(ft)}>
                    {ft}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasFilters && (
            <button className="fb-clear" onClick={clearAll}>Clear All Filters</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
