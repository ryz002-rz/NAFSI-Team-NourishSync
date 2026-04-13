# Implementation Plan: Volunteer Portal

## Overview

Build the complete Volunteer Portal for NourishNet — a multi-page experience enabling volunteers to discover, browse, filter, and sign up for food assistance missions. Implementation follows an incremental approach: enrich the location data with missions first, then build shared components (MissionCard, VolunteerFilterBar), then individual pages, then wire routes in App.js, then add i18n keys, and finally property-based tests.

## Tasks

- [x] 1. Mission data enrichment script
  - [x] 1.1 Create `nourishnet-app/scripts/enrich-missions.js` Node.js script
    - Read `src/data/locations_final_merged.json`
    - Define skill pool (at least 8): "Food Handling", "Driving", "Translation", "Sorting", "Cooking", "Outreach", "Data Entry", "Childcare", "Warehouse", "Event Setup"
    - Define language pool (at least 6): "English", "Spanish", "Chinese", "French", "Amharic", "Tagalog"
    - Define mission title templates pool (~15 realistic titles)
    - For locations with empty missions arrays, generate 1–3 missions each with title, description, skillsRequired[], languagesNeeded[], and date (within next 90 days)
    - Prioritize locations with insecurityIndex 4–5 (assign at least one mission)
    - Set volunteersNeeded (1–20) for each enriched location
    - Enrich at least 150 locations, producing 153+ total locations with missions
    - Write enriched data back to `locations_final_merged.json`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 1.2 Run the enrichment script and verify output
    - Execute `node scripts/enrich-missions.js` from `nourishnet-app/`
    - Verify at least 153 locations have non-empty missions arrays
    - Verify high-need locations (insecurityIndex 4–5) all have missions
    - _Requirements: 1.1, 1.4_

- [x] 2. Checkpoint — Verify enriched data
  - Ensure the enrichment script ran successfully and data is valid, ask the user if questions arise.

- [x] 3. Create MissionCard component
  - [x] 3.1 Create `nourishnet-app/src/UI/MissionCard.jsx` and `nourishnet-app/src/UI/MissionCard.css`
    - Accept props: `mission` (object), `location` (parent location object), `onSignUp` (callback)
    - Render mission title, description, date, all skillsRequired as badges, all languagesNeeded as badges
    - Render urgency badge based on location.insecurityIndex: 5 → red "Critical", 4 → orange "High Need", ≤3 → green/neutral
    - Render volunteersNeeded count from parent location
    - Render "Sign Up" CTA button that calls onSignUp
    - Display parent location name, address, hours
    - Use `vol-` CSS class prefix, follow existing card patterns (DonorLocCard style)
    - Use `t()` for all user-visible strings under `volunteerPortal.*` namespace
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 9.1, 9.2, 9.3_

- [x] 4. Create VolunteerFilterBar component
  - [x] 4.1 Create `nourishnet-app/src/UI/VolunteerFilterBar.jsx` and `nourishnet-app/src/UI/VolunteerFilterBar.css`
    - Accept props: `allSkills`, `allLanguages`, `onFilter`, `totalCount`, `filteredCount`
    - Render collapsible panel with skill pills, language pills, and sort options (urgency, name)
    - Toggle skill/language selections and call `onFilter({ skills: Set, languages: Set, sort: string })`
    - Show active filter count badge and "Showing X of Y" text
    - Include "Clear All Filters" button
    - Mirror FilterBar.jsx structure with `vol-fb-` CSS class prefix
    - Use `t()` for all labels
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7_

- [x] 5. Create VolunteerPage (landing page)
  - [x] 5.1 Create `nourishnet-app/src/UI/VolunteerPage.jsx` and `nourishnet-app/src/UI/VolunteerPage.css`
    - Render SearchHeader with backTo="/portal", activeNav="home", navPrefix="/volunteer"
    - Hero section with translated title (`volunteerPortal.title`) and subtitle (`volunteerPortal.subtitle`)
    - "Urgent Missions" horizontal-scroll section: MissionCards from locations with insecurityIndex ≥ 4, sorted descending; arrow navigates to `/volunteer/missions?sort=urgency`
    - "Nearby Opportunities" horizontal-scroll section: location cards for locations with missions; arrow navigates to `/volunteer/missions`
    - "Browse by Skill" horizontal-scroll section: pill cards for each unique skill; click navigates to `/volunteer/skill/{skillName}`
    - "Browse by Language" horizontal-scroll section: pill cards for each unique language; click navigates to `/volunteer/language/{languageName}`
    - Implement useDrag hook for horizontal scroll (matching DonorPage pattern)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.4_

- [x] 6. Create VolunteerMissionsPage (browse all missions)
  - [x] 6.1 Create `nourishnet-app/src/UI/VolunteerMissionsPage.jsx`
    - Render SearchHeader with backTo="/volunteer", activeNav="home", navPrefix="/volunteer"
    - Render VolunteerFilterBar with all unique skills and languages extracted from location data
    - Flatten missions into FlatMission array (mission + parent location + urgencyLevel)
    - Filter by selected skills (OR within skills), selected languages (OR within languages), AND between skill and language filters
    - Default sort by urgency (insecurityIndex descending)
    - Display result count: "X of Y missions"
    - Render filtered MissionCard list
    - Support search via SearchHeader onSearch prop
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 9.5_

- [x] 7. Create VolunteerSkillDetailPage and VolunteerLanguageDetailPage
  - [x] 7.1 Create `nourishnet-app/src/UI/VolunteerSkillDetailPage.jsx`
    - Read `:skillName` from route params
    - Display all missions requiring that skill with parent location info
    - Render SearchHeader and MissionCard list
    - _Requirements: 3.5_
  - [x] 7.2 Create `nourishnet-app/src/UI/VolunteerLanguageDetailPage.jsx`
    - Read `:languageName` from route params
    - Display all missions needing that language with parent location info
    - Render SearchHeader and MissionCard list
    - _Requirements: 3.6_

- [x] 8. Create VolunteerMapPage
  - [x] 8.1 Create `nourishnet-app/src/UI/VolunteerMapPage.jsx` and `nourishnet-app/src/UI/VolunteerMapPage.css`
    - Render SearchHeader with activeNav="map", navPrefix="/volunteer"
    - Full-page Leaflet map (MapContainer, TileLayer, Marker, Popup) showing locations with missions
    - Color-coded markers: insecurityIndex 5 → red, 4 → orange, ≤3 → green
    - Marker popup: location name, address, mission count, urgency level, "Get Directions" link
    - Sidebar with VolunteerFilterBar (skill/language pills) and range slider (5mi, 10mi, 20mi, 55mi)
    - Filter markers by skill, language, and range (using haversine distance from map center)
    - Detail card below map for selected location with mission list and prev/next arrows
    - Mirror DonorMapPage.jsx patterns (FlyTo, OpenPopup, MapCenterTracker helpers)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 9. Create VolunteerSearchResultsPage
  - [x] 9.1 Create `nourishnet-app/src/UI/VolunteerSearchResultsPage.jsx`
    - Read `q` query param from URL
    - Search against location name, mission title, mission description, skills, languages (case-insensitive)
    - Display results grouped by parent location with nested MissionCards
    - Render SearchHeader with initialQuery and navPrefix="/volunteer"
    - Show "No results found" when empty
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 10. Checkpoint — Verify all pages render independently
  - Ensure all components build without errors (`npx react-scripts build`), ask the user if questions arise.

- [x] 11. Route registration and i18n
  - [x] 11.1 Update `nourishnet-app/src/App.js` with volunteer routes
    - Replace existing `/volunteer` route with new routes:
      - `/volunteer` → VolunteerPage
      - `/volunteer/missions` → VolunteerMissionsPage
      - `/volunteer/skill/:skillName` → VolunteerSkillDetailPage
      - `/volunteer/language/:languageName` → VolunteerLanguageDetailPage
      - `/volunteer/map` → VolunteerMapPage
      - `/volunteer/search` → VolunteerSearchResultsPage
    - Add imports for all new page components
    - Remove old Layout-wrapped VolunteerPortal route
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 11.2 Add i18n keys to `nourishnet-app/src/locales/en.json`
    - Add `volunteerPortal` namespace with all keys: title, subtitle, urgentMissions, nearbyOpportunities, browseBySkill, browseByLanguage, allMissions, missionsAt, skillsRequired, languagesNeeded, volunteersNeeded, signUp, critical, highNeed, moderate, standard, sortByUrgency, sortByName, missionCount, filterBySkill, filterByLanguage
    - _Requirements: 8.1, 8.2_

- [x] 12. Checkpoint — Full integration verification
  - Ensure all routes work, navigation flows correctly, and build passes. Ask the user if questions arise.

- [ ]* 13. Property-based tests
  - [ ]* 13.1 Write property test for enriched mission schema validity
    - **Property 1: Enriched mission schema validity**
    - Use fast-check to verify every mission has non-empty title, description, skillsRequired, languagesNeeded, date; parent location has volunteersNeeded 1–20
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-mission-schema.test.js`
    - **Validates: Requirements 1.2, 1.5**
  - [ ]* 13.2 Write property test for high-need location coverage
    - **Property 2: High-need locations receive missions**
    - Verify all locations with insecurityIndex 4–5 have at least one mission
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-high-need.test.js`
    - **Validates: Requirements 1.4**
  - [ ]* 13.3 Write property test for urgency level mapping consistency
    - **Property 3: Urgency level mapping consistency**
    - Use fast-check to generate random insecurityIndex values (1–5) and verify correct color/label mapping
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-urgency-mapping.test.js`
    - **Validates: Requirements 4.2, 5.5, 9.1, 9.2, 9.3**
  - [ ]* 13.4 Write property test for urgent missions section filtering
    - **Property 4: Urgent missions section contains only high-need missions**
    - Generate random location sets, verify only insecurityIndex ≥ 4 appear in urgent section, sorted descending
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-urgent-filter.test.js`
    - **Validates: Requirements 2.3, 9.4**
  - [ ]* 13.5 Write property test for skill and language filter correctness
    - **Property 5: Skill and language filter correctness**
    - Generate random skill/language selections and mission sets, verify filter output matches AND/OR logic
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-filter.test.js`
    - **Validates: Requirements 3.2, 3.3, 3.4**
  - [ ]* 13.6 Write property test for search result relevance
    - **Property 6: Search result relevance**
    - Generate random queries and mission/location data, verify all results contain query in a valid field
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-search.test.js`
    - **Validates: Requirements 6.1**
  - [ ]* 13.7 Write property test for default sort order
    - **Property 8: Default sort order is urgency descending**
    - Generate random mission lists, verify urgency-descending sort
    - Create `nourishnet-app/src/__tests__/pbt-volunteer-sort.test.js`
    - **Validates: Requirements 9.5**

- [x] 14. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- All new UI components go in `src/UI/` with `vol-` CSS class prefix, matching existing portal conventions
- The enrichment script is a one-time offline Node.js script; enriched data is committed to the repo
- Existing shared components (SearchHeader, LocationCard) are reused as-is
