# Day 2 Tasks — Sunday April 12 (Integration Day)

**Date**: Sunday April 12, 2026
**Goal**: Integrate all Day 1 components, enhance portals with real data, polish UX, and get all three portals fully functional.

---

## Git Workflow (Day 2)

| Member | Branch Name | Key Files Touched |
|--------|------------|-------------------|
| Joshua | `joshua/data-enrichment` | `data/locations.json`, `data/DATA_DICTIONARY.md` |
| Christian | `christian/portal-integration` | `pages/CustomerPortal.jsx` (if needed), `pages/DonorPortal.jsx`, `pages/VolunteerPortal.jsx`, `locales/*`, `App.js` |
| Joe | `joe/advanced-logic` | `utils/filterUtils.js`, `components/joe/FilterEngine.jsx`, `components/joe/VoiceSearch.jsx`, `components/joe/ImpactCalculator.jsx` |
| Ryan | `ryan/ux-polish` | `components/ryan/MapView.jsx`, `components/shared/LocationCard.jsx`, `styles/*` |

### Merge Order (Day 2)

```
1. joshua/data-enrichment     → main   (data changes only — merge first)
2. joe/advanced-logic         → main   (filter/logic improvements, no portal edits)
3. christian/portal-integration → main (portal pages + i18n updates)
4. ryan/ux-polish             → main   (UI polish, responsive fixes, final pass)
```

---

## Task 1: Data Enrichment & Validation

### 👤 Joshua — ⚡ MERGE FIRST

- [ ] 1.1 **[Joshua]** Add donor-specific fields to `locations.json` entries: `wishlist` (string[] of needed items), `acceptsPerishable` (boolean), `dropOffHours` (string) for locations that accept donations
- [ ] 1.2 **[Joshua]** Add volunteer-specific fields to `locations.json` entries: `missions` (array of `{ title, description, skillsRequired, languagesNeeded, date }`), `volunteersNeeded` (number) for locations that need volunteers
- [ ] 1.3 **[Joshua]** Validate all location coordinates are within PG County bounds (lat: 38.5–39.1, lng: -77.1–-76.6) and fix any outliers
- [ ] 1.4 **[Joshua]** Ensure all 50+ locations have complete `healthAttributes` objects (all 7 boolean fields present, no missing keys)
- [ ] 1.5 **[Joshua]** Update `DATA_DICTIONARY.md` with new donor/volunteer fields, document which fields are required vs optional, and add example entries
- [ ] 1.6 **[Joshua]** Create `locations_backup.json` as a safety copy of the validated dataset

**Deliverables**: Enhanced `locations.json` with donor/volunteer data, updated `DATA_DICTIONARY.md`

---

## Task 2: Customer Portal Enhancement

### 👤 Christian — depends on Task 1 (Joshua's data merge)

- [ ] 2.1 **[Christian]** Verify `FamilyPortal.jsx` correctly loads and displays all customer-type locations from the enriched `locations.json` — confirm FilterEngine, VoiceSearch, MapView, and LocationCard all render without errors
- [ ] 2.2 **[Christian]** Add i18n keys for filter labels, map toggle text, and result count text to all 6 locale files (`en.json`, `es.json`, `zh.json`, `fr.json`, `am.json`, `tl.json`) — keys: `filter.halal`, `filter.vegan`, `filter.vegetarian`, `filter.noBeef`, `filter.lowGI`, `filter.freshProduce`, `filter.dairyFree`, `map.show`, `map.hide`, `results.count`, `results.countSingular`
- [ ] 2.3 **[Christian]** Wire up the "Near Me" button: use `navigator.geolocation.getCurrentPosition` to get user location, pass it to `applyFilters` as `origin` with a default `radiusMiles` of 10, show a loading state while geolocation resolves

**Deliverables**: Fully functional Customer Portal with i18n, geolocation, and all filters working

---

## Task 3: Donor Portal Build-Out

### 👤 Christian — depends on Task 1

- [ ] 3.1 **[Christian]** Enhance `DonorPortal.jsx` to display donor-relevant info: show each location's `wishlist` items as tags, display `acceptsPerishable` badge, show `dropOffHours` alongside regular hours
- [ ] 3.2 **[Christian]** Add a "High Need" sort option that orders locations by `insecurityIndex` descending so donors can prioritize communities with greatest need
- [ ] 3.3 **[Christian]** Add i18n keys for donor-specific UI text to all 6 locale files: `donor.wishlist`, `donor.acceptsPerishable`, `donor.dropOffHours`, `donor.highNeed`, `donor.sortByNeed`

**Deliverables**: Enhanced Donor Portal with wishlist display, need-based sorting, and i18n

---

## Task 4: Volunteer Portal Build-Out

### 👤 Christian — depends on Task 1

- [ ] 4.1 **[Christian]** Enhance `VolunteerPortal.jsx` to display mission cards: for each location with `missions`, render mission title, description, required skills, needed languages, and date
- [ ] 4.2 **[Christian]** Add skill/language filter dropdowns so volunteers can filter missions by `skillsRequired` and `languagesNeeded` fields
- [ ] 4.3 **[Christian]** Add i18n keys for volunteer-specific UI text to all 6 locale files: `volunteer.missions`, `volunteer.skills`, `volunteer.languages`, `volunteer.date`, `volunteer.volunteersNeeded`, `volunteer.signUp`

**Deliverables**: Enhanced Volunteer Portal with mission cards, skill/language filters, and i18n

---

## Task 5: Advanced Filtering & State Persistence

### 👤 Joe — no hard dependencies (can start immediately)

- [ ] 5.1 **[Joe]** Add filter mode toggle to `FilterEngine.jsx`: AND mode (location must match ALL selected tags) vs OR mode (location must match ANY selected tag) — default to AND, persist choice to localStorage via `preferences.js`
- [ ] 5.2 **[Joe]** Add distance-based filtering UI to `FilterEngine.jsx`: a radius dropdown (1 mi, 5 mi, 10 mi, 25 mi) that works with `filterByDistance` when user location is available
- [ ] 5.3 **[Joe]** Persist active dietary filters and search query to localStorage using `savePreferences` so filters survive page refresh — restore on component mount via `getPreferences`
- [ ] 5.4 **[Joe]** Optimize `applyFilters` for large datasets: add early-exit when no filters are active, memoize distance calculations when origin hasn't changed

**Deliverables**: Production-ready FilterEngine with AND/OR mode, distance UI, and state persistence

---

## Task 6: Voice Search Refinement

### 👤 Joe

- [ ] 6.1 **[Joe]** Add Spanish keyword mappings to `VoiceSearch.jsx`: `VOICE_KEYWORD_MAP_ES` with entries like `"sin carne"` → `noBeef`, `"vegano"` → `vegan`, `"sin lácteos"` → `dairyFree`, etc.
- [ ] 6.2 **[Joe]** Detect current i18n language and set `recognition.lang` accordingly (en → `en-US`, es → `es-ES`, fr → `fr-FR`, zh → `zh-CN`)
- [ ] 6.3 **[Joe]** Add visual feedback: show the recognized transcript text below the mic button for 3 seconds after recognition, and show which filters were activated
- [ ] 6.4 **[Joe]** Add error recovery: if `no-speech` error occurs, auto-retry once after 500ms; if `not-allowed`, show a helpful message about microphone permissions

**Deliverables**: Polished VoiceSearch with multi-language support and better UX feedback

---

## Task 7: Impact Calculator Enhancement

### 👤 Joe

- [ ] 7.1 **[Joe]** Add i18n support to `ImpactCalculator.jsx`: extract all hardcoded strings to translation keys (`impact.title`, `impact.description`, `impact.co2`, `impact.meals`, `impact.water`, `impact.inputLabel`, `impact.inputPlaceholder`)
- [ ] 7.2 **[Joe]** Add a "community total" display: aggregate total donations across all donor locations (sum of a `totalDonatedLbs` field if Joshua adds it, otherwise use a static demo value) and show cumulative impact stats
- [ ] 7.3 **[Joe]** Add share functionality: a "Share Your Impact" button that copies a formatted text summary to clipboard (e.g., "I donated 50 lbs of food, saving 190 lbs of CO₂!")

**Deliverables**: i18n-ready ImpactCalculator with community stats and share feature

---

## Task 8: Map Integration & Markers

### 👤 Ryan — depends on Task 1 (Joshua's data merge)

- [ ] 8.1 **[Ryan]** Add custom marker icons to `MapView.jsx`: green markers for customer locations, orange for donor locations, blue for volunteer locations — use Leaflet `L.divIcon` with colored circles
- [ ] 8.2 **[Ryan]** Enhance marker popups: show health attribute badges, hours, and a "Get Directions" link (`https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`) in each popup
- [ ] 8.3 **[Ryan]** Add user location marker: when geolocation is available, show a pulsing blue dot at the user's position and auto-center the map
- [ ] 8.4 **[Ryan]** Add map bounds auto-fit: when `locations` prop changes, use `map.fitBounds()` to zoom the map to show all visible markers

**Deliverables**: Functional MapView with colored markers, rich popups, user location, and auto-fit

---

## Task 9: LocationCard & UI Polish

### 👤 Ryan

- [ ] 9.1 **[Ryan]** Add expandable detail section to `LocationCard.jsx`: click to expand and show full address, phone, website, food types, and requirements — collapsed by default to keep the list scannable
- [ ] 9.2 **[Ryan]** Add insecurity index indicator to `LocationCard.jsx`: show a colored bar (red = high need, yellow = medium, green = low) based on `insecurityIndex` value
- [ ] 9.3 **[Ryan]** Test all components on mobile viewport (375px), tablet (768px), and desktop (1280px) — fix any overflow, truncation, or layout issues
- [ ] 9.4 **[Ryan]** Add loading skeleton states: create a `LocationCardSkeleton` component that renders placeholder shimmer cards while data loads
- [ ] 9.5 **[Ryan]** Add empty state illustrations: when no results match filters, show a friendly illustration/emoji with the "no results" message and a "Clear Filters" button

**Deliverables**: Polished, responsive LocationCard with expandable details, need indicators, and loading/empty states

---

## Task 10: Cross-Team Integration Testing

### 👤 Ryan (lead) + All Team Members — after all branches merged

- [ ] 10.1 **[Ryan]** Run `npm start` and verify all three portals render without console errors
- [ ] 10.2 **[Ryan]** Test Customer Portal end-to-end: search → filter → voice search → map interaction → location card expand
- [ ] 10.3 **[Ryan]** Test Donor Portal end-to-end: search → sort by need → impact calculator → location details
- [ ] 10.4 **[Ryan]** Test Volunteer Portal end-to-end: search → skill filter → language filter → map → mission cards
- [ ] 10.5 **[All]** Test language switching across all 6 languages on every portal — verify no missing translation keys (check console for i18n warnings)
- [ ] 10.6 **[All]** Test on mobile (Chrome DevTools device mode) — verify all portals are usable at 375px width
- [ ] 10.7 **[Ryan]** Run `npm run build` and verify production build completes without errors

---

## Parallel Execution Timeline

```
9:00 AM  ──────────────────────────────────────────────── 12:00 PM

Joshua:    [Task 1: Data enrichment + validation] → MERGE TO MAIN
Joe:       [Task 5: Advanced filtering + persistence] → [Task 6: Voice refinement]
Christian: (wait for Joshua merge) → [Task 2: Customer Portal] → [Task 3: Donor Portal]
Ryan:      [Task 9.1-9.4: LocationCard polish + skeletons]

12:00 PM ──────────────────────────────────────────────── 5:00 PM

Joshua:    [Task 1 continued: QA + backup] → Support team with data questions
Joe:       [Task 6 continued] → [Task 7: Impact Calculator] → MERGE TO MAIN
Christian: [Task 4: Volunteer Portal] → [Task 2.2-2.3: i18n + geolocation] → MERGE TO MAIN
Ryan:      [Task 8: Map markers + popups] → [Task 9.5: Empty states] → MERGE TO MAIN

6:00 PM  ──────────────────────────────────────────────── 9:00 PM

All:       [Task 10: Integration testing + bug fixes]
           Merge order: Joshua → Joe → Christian → Ryan
           End-to-end testing on merged main
```

---

## Day 2 Definition of Done

- [ ] All three portals display real data from enriched `locations.json`
- [ ] Dietary filters work with AND/OR toggle on Customer Portal
- [ ] Voice search works in at least EN and ES
- [ ] Map shows colored markers with rich popups on Customer and Volunteer portals
- [ ] Donor Portal shows wishlists, need indicators, and impact calculator
- [ ] Volunteer Portal shows mission cards with skill/language filters
- [ ] All UI text is translated in all 6 locale files
- [ ] App is responsive at 375px, 768px, and 1280px
- [ ] `npm run build` succeeds with zero errors
- [ ] No console errors or i18n missing-key warnings

---

## Risk Mitigation

### If Behind Schedule by 3:00 PM
**Cut from scope**:
- Task 6.1–6.2 (multi-language voice) → keep English-only voice search
- Task 7.2–7.3 (community total + share) → keep basic calculator
- Task 9.4 (skeleton loading) → use simple "Loading..." text

### If Behind Schedule by 6:00 PM
**Cut from scope**:
- Task 4.2 (skill/language filters) → keep text search only on Volunteer Portal
- Task 5.1 (AND/OR toggle) → keep AND-only filtering
- Task 8.3 (user location marker) → keep static map center

### Critical Path (Minimum Day 2 Success)
1. Enriched `locations.json` merged ✅
2. Customer Portal fully functional with filters + map ✅
3. Donor Portal shows locations with search ✅
4. Volunteer Portal shows locations with search ✅
5. `npm run build` passes ✅
