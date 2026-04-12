/**
 * Filter utilities for NourishNet location data.
 * Supports dietary/health attribute filtering, text search, and distance-based filtering.
 */

/**
 * All available dietary/health filter keys matching the healthAttributes schema.
 */
export const DIETARY_FILTERS = [
  { key: 'halal', label: 'Halal', emoji: '🥩' },
  { key: 'vegan', label: 'Vegan', emoji: '🌱' },
  { key: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { key: 'noBeef', label: 'No Beef', emoji: '🚫🐄' },
  { key: 'lowGI', label: 'Low GI', emoji: '📉' },
  { key: 'freshProduce', label: 'Fresh Produce', emoji: '🥦' },
  { key: 'dairyFree', label: 'Dairy Free', emoji: '🥛' },
];

/**
 * Filter locations by active dietary/health attribute tags.
 * Supports AND mode (must match ALL) and OR mode (must match ANY).
 * @param {Array} locations
 * @param {string[]} activeTags - keys from healthAttributes (e.g. ['halal', 'vegan'])
 * @param {'AND'|'OR'} mode - filter logic mode (default: 'AND')
 * @returns {Array}
 */
export function filterByDietary(locations, activeTags, mode = 'AND') {
  if (!activeTags || activeTags.length === 0) return locations;
  const matcher = mode === 'OR' ? 'some' : 'every';
  return locations.filter((loc) => {
    if (!loc.healthAttributes) return false;
    return activeTags[matcher]((tag) => loc.healthAttributes[tag] === true);
  });
}

/**
 * Filter locations by text search query.
 * Matches against name, address fields, foodTypes, and tags.
 * @param {Array} locations
 * @param {string} query
 * @returns {Array}
 */
export function filterBySearch(locations, query) {
  if (!query || !query.trim()) return locations;
  const q = query.toLowerCase().trim();
  return locations.filter((loc) => {
    const name = (loc.name || '').toLowerCase();
    const street = (loc.address?.street || '').toLowerCase();
    const city = (loc.address?.city || '').toLowerCase();
    const foodTypes = (loc.foodTypes || []).join(' ').toLowerCase();
    const tags = (loc.tags || []).join(' ').toLowerCase();
    return (
      name.includes(q) ||
      street.includes(q) ||
      city.includes(q) ||
      foodTypes.includes(q) ||
      tags.includes(q)
    );
  });
}

/**
 * Calculate distance in miles between two lat/lng points using Haversine formula.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in miles
 */
export function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Filter locations within a given radius (miles) from a reference point.
 * @param {Array} locations
 * @param {{ lat: number, lng: number }} origin
 * @param {number} radiusMiles
 * @returns {Array} locations with added `distance` property, sorted by distance
 */
export function filterByDistance(locations, origin, radiusMiles) {
  if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
    return locations;
  }
  return locations
    .map((loc) => ({
      ...loc,
      distance:
        typeof loc.lat === 'number' && typeof loc.lng === 'number'
          ? getDistanceMiles(origin.lat, origin.lng, loc.lat, loc.lng)
          : Infinity,
    }))
    .filter((loc) => loc.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Memoized distance cache — avoids recalculating when origin hasn't changed.
 */
let _distanceCache = { originKey: null, distances: new Map() };

function _getOriginKey(origin) {
  return origin ? `${origin.lat},${origin.lng}` : null;
}

function _getCachedDistance(origin, loc) {
  const key = _getOriginKey(origin);
  if (_distanceCache.originKey !== key) {
    _distanceCache = { originKey: key, distances: new Map() };
  }
  if (_distanceCache.distances.has(loc.id)) {
    return _distanceCache.distances.get(loc.id);
  }
  const d = getDistanceMiles(origin.lat, origin.lng, loc.lat, loc.lng);
  _distanceCache.distances.set(loc.id, d);
  return d;
}

/**
 * Apply all filters in sequence: early-exit → search → dietary → distance.
 * Memoizes distance calculations when origin hasn't changed.
 * @param {Array} locations
 * @param {{ search?: string, dietaryTags?: string[], filterMode?: 'AND'|'OR', origin?: { lat: number, lng: number }, radiusMiles?: number }} filters
 * @returns {Array}
 */
export function applyFilters(locations, filters = {}) {
  // Early exit — no filters active
  const hasSearch = !!filters.search;
  const hasDietary = filters.dietaryTags && filters.dietaryTags.length > 0;
  const hasDistance = filters.origin && filters.radiusMiles;
  if (!hasSearch && !hasDietary && !hasDistance) return locations;

  let result = locations;
  if (hasSearch) {
    result = filterBySearch(result, filters.search);
  }
  if (hasDietary) {
    result = filterByDietary(result, filters.dietaryTags, filters.filterMode || 'AND');
  }
  if (hasDistance) {
    const origin = filters.origin;
    result = result
      .map((loc) => ({
        ...loc,
        distance:
          typeof loc.lat === 'number' && typeof loc.lng === 'number'
            ? _getCachedDistance(origin, loc)
            : Infinity,
      }))
      .filter((loc) => loc.distance <= filters.radiusMiles)
      .sort((a, b) => a.distance - b.distance);
  }
  return result;
}
