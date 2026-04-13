#!/usr/bin/env node
/**
 * Mission Data Enrichment Script
 *
 * Reads locations_final_merged.json, generates missions for locations
 * with empty missions arrays, and writes the enriched data back.
 *
 * - Prioritizes locations with insecurityIndex 4-5
 * - Generates 1-3 missions per location
 * - Assigns skills from a pool of 10, languages from a pool of 6
 * - Sets volunteersNeeded (1-20) for each enriched location
 * - Produces at least 150 newly enriched locations (153+ total with missions)
 * - Uses seeded random for reproducibility
 */

const fs = require('fs');
const path = require('path');

// ── Seeded PRNG (mulberry32) for reproducibility ──
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, n);
}

// ── Pools ──
const SKILLS = [
  'Food Handling', 'Driving', 'Translation', 'Sorting',
  'Cooking', 'Outreach', 'Data Entry', 'Childcare',
  'Warehouse', 'Event Setup'
];

const LANGUAGES = [
  'English', 'Spanish', 'Chinese', 'French', 'Amharic', 'Tagalog'
];

const MISSION_TEMPLATES = [
  { title: 'Food Distribution Assistant', desc: 'Help sort and distribute food packages to community members in need.' },
  { title: 'Mobile Pantry Driver', desc: 'Drive and deliver food supplies to underserved neighborhoods.' },
  { title: 'Community Outreach Coordinator', desc: 'Connect with local residents to raise awareness about available food resources.' },
  { title: 'Meal Prep Volunteer', desc: 'Prepare nutritious meals for distribution at the community kitchen.' },
  { title: 'Warehouse Organizer', desc: 'Sort, label, and organize donated food items in the storage facility.' },
  { title: 'Translation Support', desc: 'Provide language assistance to non-English speaking visitors at the food pantry.' },
  { title: 'Client Intake Assistant', desc: 'Help register new clients and guide them through the intake process.' },
  { title: 'Fresh Produce Sorter', desc: 'Inspect, sort, and package fresh fruits and vegetables for distribution.' },
  { title: 'Delivery Route Helper', desc: 'Assist with loading and delivering food boxes along scheduled routes.' },
  { title: 'Event Setup Crew', desc: 'Set up tables, signage, and supplies for food distribution events.' },
  { title: 'Data Entry Volunteer', desc: 'Enter client information and inventory data into the tracking system.' },
  { title: 'Childcare Helper', desc: 'Supervise children while their parents access food assistance services.' },
  { title: 'Nutrition Education Assistant', desc: 'Help facilitate nutrition workshops and cooking demonstrations.' },
  { title: 'Donation Pickup Driver', desc: 'Pick up food donations from local businesses and transport them to the pantry.' },
  { title: 'Weekend Distribution Volunteer', desc: 'Assist with weekend food distribution events serving families in the area.' }
];

// ── Date generation: random date within next 90 days ──
function generateDate() {
  const now = new Date();
  const offset = randInt(1, 90);
  const d = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ── Generate a single mission ──
function generateMission() {
  const template = pick(MISSION_TEMPLATES);
  const numSkills = randInt(1, 3);
  const numLangs = randInt(1, 2);

  return {
    title: template.title,
    description: template.desc,
    skillsRequired: pickN(SKILLS, numSkills),
    languagesNeeded: pickN(LANGUAGES, numLangs),
    date: generateDate()
  };
}

// ── Main ──
const dataPath = path.join(__dirname, '..', 'src', 'data', 'locations_final_merged.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const locations = JSON.parse(raw);

console.log(`Total locations: ${locations.length}`);

const alreadyHaveMissions = locations.filter(l => l.missions && l.missions.length > 0).length;
console.log(`Locations already with missions: ${alreadyHaveMissions}`);

// Separate locations needing enrichment
const needsEnrichment = locations.filter(l => !l.missions || l.missions.length === 0);
const highNeed = needsEnrichment.filter(l => l.insecurityIndex >= 4);
const lowerNeed = needsEnrichment.filter(l => l.insecurityIndex < 4);

console.log(`High-need locations (index 4-5) without missions: ${highNeed.length}`);
console.log(`Lower-need locations without missions: ${lowerNeed.length}`);

// Enrich ALL high-need locations first (requirement: insecurityIndex 4-5 must all get missions)
let enrichedCount = 0;

for (const loc of highNeed) {
  const numMissions = randInt(1, 3);
  loc.missions = [];
  for (let i = 0; i < numMissions; i++) {
    loc.missions.push(generateMission());
  }
  loc.volunteersNeeded = randInt(1, 20);
  enrichedCount++;
}

// If we still need more to reach 150, enrich some lower-need locations
const TARGET = 150;
if (enrichedCount < TARGET) {
  const remaining = TARGET - enrichedCount;
  // Shuffle lower-need for variety
  const shuffledLower = [...lowerNeed].sort(() => rand() - 0.5);
  const toEnrich = shuffledLower.slice(0, remaining);

  for (const loc of toEnrich) {
    const numMissions = randInt(1, 3);
    loc.missions = [];
    for (let i = 0; i < numMissions; i++) {
      loc.missions.push(generateMission());
    }
    loc.volunteersNeeded = randInt(1, 20);
    enrichedCount++;
  }
}

// Write back
fs.writeFileSync(dataPath, JSON.stringify(locations, null, 2), 'utf-8');

// Stats
const totalWithMissions = locations.filter(l => l.missions && l.missions.length > 0).length;
const totalMissions = locations.reduce((sum, l) => sum + (l.missions ? l.missions.length : 0), 0);
const highNeedWithMissions = locations.filter(l => l.insecurityIndex >= 4 && l.missions && l.missions.length > 0).length;
const totalHighNeed = locations.filter(l => l.insecurityIndex >= 4).length;

console.log(`\n── Results ──`);
console.log(`Newly enriched locations: ${enrichedCount}`);
console.log(`Total locations with missions: ${totalWithMissions}`);
console.log(`Total missions generated: ${totalMissions}`);
console.log(`High-need locations with missions: ${highNeedWithMissions} / ${totalHighNeed}`);
console.log(`All high-need covered: ${highNeedWithMissions === totalHighNeed ? 'YES ✓' : 'NO ✗'}`);
console.log(`Target met (≥153 with missions): ${totalWithMissions >= 153 ? 'YES ✓' : 'NO ✗'}`);
console.log(`\nEnriched data written to ${dataPath}`);
