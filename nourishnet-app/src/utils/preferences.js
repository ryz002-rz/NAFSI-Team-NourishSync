/**
 * User preferences utility for NourishNet.
 * Reads/writes preferences to localStorage under key "nourishnet_prefs".
 */

export const DEFAULT_PREFS = {
  language: 'en',
  role: null,
  dietary_tags: [],
  household_size: null,
  search_query: '',
  filter_mode: 'AND',
};

const STORAGE_KEY = 'nourishnet_prefs';

/**
 * Reads and parses user preferences from localStorage.
 * Returns a copy of DEFAULT_PREFS merged with any saved values.
 * If localStorage is unavailable or contains invalid JSON, returns defaults.
 */
export function getPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PREFS };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/**
 * Merges the given prefs with existing saved preferences and writes to localStorage.
 * Fails silently if localStorage is unavailable.
 * @param {Partial<import('./preferences').UserPreferences>} prefs
 */
export function savePreferences(prefs) {
  try {
    const existing = getPreferences();
    const merged = { ...existing, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage unavailable — fail silently
  }
}
