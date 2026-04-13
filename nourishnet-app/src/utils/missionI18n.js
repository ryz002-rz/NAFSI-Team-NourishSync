/**
 * Converts a mission title to a translation key slug.
 * e.g. "Client Intake Assistant" → "client_intake_assistant"
 */
export function missionSlug(title) {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Returns the translated mission title, falling back to the raw title.
 */
export function translateMissionTitle(title, t) {
  if (!title) return '';
  const key = `mission.title.${missionSlug(title)}`;
  return t(key, title);
}

/**
 * Returns the translated mission description, falling back to the raw description.
 * Uses the title slug as the key since descriptions are keyed by title.
 */
export function translateMissionDesc(title, description, t) {
  if (!description) return '';
  const key = `mission.desc.${missionSlug(title)}`;
  return t(key, description);
}
