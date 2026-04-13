# Requirements Document

## Introduction

The Volunteer Portal is a complete multi-page experience within NourishNet that enables volunteers to discover, browse, filter, and sign up for food assistance missions across Prince George's County. The portal mirrors the established patterns of the Customer and Donor portals — featuring a landing page with horizontal-scroll featured sections, dedicated browse/filter pages, an interactive map view, detail pages, search with voice support, and full i18n support across 6 languages. Because only 3 of 737 locations currently have mission data (with empty skills/languages arrays), the portal also requires enriched mission data generation so the experience is meaningful at launch.

## Glossary

- **Volunteer_Portal**: The top-level volunteer experience consisting of a landing page, browse pages, map page, detail pages, and search results page, accessible at the `/volunteer` route prefix
- **Mission**: A volunteer opportunity at a location, defined by title, description, skillsRequired[], languagesNeeded[], date, and a computed urgency derived from the parent location's insecurityIndex
- **Location**: A food assistance site from `locations_final_merged.json` with fields including id, name, address, lat, lng, hours, missions[], volunteersNeeded, insecurityIndex (1–5 scale), foodTypes[], healthAttributes
- **Insecurity_Index**: A 1–5 integer scale on each Location indicating food insecurity severity (1=Low, 5=Critical); values 4–5 are classified as high-need/urgent
- **SearchHeader**: The shared header component providing navigation pills (Home, Map, About Us), a search input with voice search, a back button, and a language popover
- **FilterBar**: A collapsible filter/sort panel with pill-style toggles for categorical filtering
- **MapView**: The shared Leaflet-based map component supporting marker and heatmap view modes
- **LocationCard**: The shared card component displaying location name, address, hours, health badges, food types, and contact info
- **Landing_Page**: The volunteer portal home page at `/volunteer` featuring a hero section and horizontal-scroll card sections for featured content
- **Mission_Card**: A UI card displaying a single mission's title, description, date, required skills, needed languages, urgency badge, and a sign-up call-to-action
- **Skill_Filter**: A filter dimension allowing volunteers to narrow missions by required skills (e.g., "Food Handling", "Driving", "Translation")
- **Language_Filter**: A filter dimension allowing volunteers to narrow missions by needed languages (e.g., "Spanish", "Amharic", "Chinese")
- **Urgency_Level**: A derived classification from insecurityIndex where 4=High Need and 5=Critical/Urgent, displayed as color-coded badges
- **Mission_Data_Enrichment**: The process of generating realistic mission records for locations that currently lack them, ensuring broad coverage across the 737 locations

## Requirements

### Requirement 1: Mission Data Enrichment

**User Story:** As a volunteer, I want a rich set of missions across many locations, so that I can find meaningful volunteer opportunities throughout the county.

#### Acceptance Criteria

1. THE Mission_Data_Enrichment SHALL generate mission records for at least 150 locations that currently have empty missions arrays, producing a total of at least 153 locations with missions
2. WHEN generating missions, THE Mission_Data_Enrichment SHALL assign each mission a title, description, at least one skill in skillsRequired, at least one language in languagesNeeded, and a date string
3. THE Mission_Data_Enrichment SHALL use a pool of at least 8 distinct skill values (e.g., "Food Handling", "Driving", "Translation", "Sorting", "Cooking", "Outreach", "Data Entry", "Childcare") and at least 6 distinct language values (e.g., "English", "Spanish", "Chinese", "French", "Amharic", "Tagalog")
4. WHEN a Location has insecurityIndex of 4 or 5, THE Mission_Data_Enrichment SHALL assign at least one mission to that Location with priority
5. THE Mission_Data_Enrichment SHALL populate the volunteersNeeded field with a positive integer (between 1 and 20) for every Location that receives missions

### Requirement 2: Volunteer Landing Page

**User Story:** As a volunteer, I want a visually rich landing page with featured sections, so that I can quickly discover urgent missions, nearby opportunities, and browse by skill or language.

#### Acceptance Criteria

1. THE Landing_Page SHALL render the SearchHeader component with backTo set to "/portal", activeNav set to "home", and navPrefix set to "/volunteer"
2. THE Landing_Page SHALL display a hero section with a translated title and subtitle for the volunteer portal
3. THE Landing_Page SHALL display a "Urgent Missions" horizontal-scroll section showing missions from locations with insecurityIndex of 4 or 5, sorted by insecurityIndex descending
4. THE Landing_Page SHALL display a "Nearby Opportunities" horizontal-scroll section showing location cards for locations that have missions
5. THE Landing_Page SHALL display a "Browse by Skill" horizontal-scroll section with pill-style cards for each unique skill value, where clicking a skill navigates to `/volunteer/skill/{skillName}`
6. THE Landing_Page SHALL display a "Browse by Language" horizontal-scroll section with pill-style cards for each unique language value, where clicking a language navigates to `/volunteer/language/{languageName}`
7. WHEN a user clicks the arrow button on any section header, THE Landing_Page SHALL navigate to the corresponding full browse page

### Requirement 3: Mission Browse and Filter Pages

**User Story:** As a volunteer, I want to browse all missions with skill and language filters, so that I can find opportunities matching my abilities.

#### Acceptance Criteria

1. WHEN a user navigates to `/volunteer/missions`, THE Volunteer_Portal SHALL display a full mission listing page with SearchHeader, skill filter pills, language filter pills, and a sort option
2. WHEN a user selects one or more skills from the Skill_Filter, THE Volunteer_Portal SHALL display only missions whose skillsRequired array contains at least one of the selected skills
3. WHEN a user selects one or more languages from the Language_Filter, THE Volunteer_Portal SHALL display only missions whose languagesNeeded array contains at least one of the selected languages
4. WHEN both Skill_Filter and Language_Filter are active, THE Volunteer_Portal SHALL display only missions matching at least one selected skill AND at least one selected language
5. WHEN a user navigates to `/volunteer/skill/{skillName}`, THE Volunteer_Portal SHALL display all missions requiring that specific skill with their parent location information
6. WHEN a user navigates to `/volunteer/language/{languageName}`, THE Volunteer_Portal SHALL display all missions needing that specific language with their parent location information
7. THE Volunteer_Portal SHALL display a result count showing the number of matching missions out of the total

### Requirement 4: Volunteer Map Page

**User Story:** As a volunteer, I want to see volunteer opportunities on an interactive map, so that I can find missions near me geographically.

#### Acceptance Criteria

1. WHEN a user navigates to `/volunteer/map`, THE Volunteer_Portal SHALL display a full-page map view using the SearchHeader with activeNav set to "map" and navPrefix set to "/volunteer"
2. THE Volunteer_Portal SHALL display map markers for all locations that have at least one mission, using color-coded markers based on Urgency_Level (red for insecurityIndex 5, orange for 4, green for lower values)
3. WHEN a user clicks a map marker, THE Volunteer_Portal SHALL display a popup with the location name, address, mission count, urgency level, and a "Get Directions" link
4. THE Volunteer_Portal SHALL include a sidebar with Skill_Filter pills, Language_Filter pills, and a location range slider (5mi, 10mi, 20mi, 55mi) consistent with the Donor map page pattern
5. WHEN filters are applied on the map page, THE Volunteer_Portal SHALL update the visible markers to show only locations with missions matching the active filters
6. THE Volunteer_Portal SHALL display a detail card below the map for the currently selected location, showing location info, mission list, and navigation arrows to cycle through filtered locations

### Requirement 5: Mission Detail View

**User Story:** As a volunteer, I want to see full details of a mission and its location, so that I can decide whether to sign up.

#### Acceptance Criteria

1. WHEN a user selects a mission from any listing, THE Volunteer_Portal SHALL display the mission title, full description, date, all required skills as badges, all needed languages as badges, and the Urgency_Level badge
2. THE Volunteer_Portal SHALL display the parent Location information including name, address, hours, phone, website, and a "Get Directions" link
3. THE Volunteer_Portal SHALL display the volunteersNeeded count for the location
4. THE Volunteer_Portal SHALL display a "Sign Up" call-to-action button for the mission
5. IF the Location has insecurityIndex of 4 or 5, THEN THE Volunteer_Portal SHALL display a prominent high-need/urgent badge on the detail view

### Requirement 6: Search and Voice Search

**User Story:** As a volunteer, I want to search for missions by keyword and voice, so that I can quickly find relevant opportunities.

#### Acceptance Criteria

1. WHEN a user types a query in the SearchHeader on any volunteer page, THE Volunteer_Portal SHALL filter visible missions and locations by matching the query against location name, mission title, mission description, skills, and languages
2. WHEN a user presses Enter in the search input, THE Volunteer_Portal SHALL navigate to `/volunteer/search?q={query}` and display matching results
3. THE Volunteer_Portal search results page SHALL display matching missions grouped by their parent location, with location cards and nested mission cards
4. WHEN a user activates voice search via the microphone button, THE Volunteer_Portal SHALL use the Web Speech API to capture spoken input and execute the search

### Requirement 7: Routing Integration

**User Story:** As a developer, I want all volunteer portal routes registered in App.js, so that navigation works correctly across the application.

#### Acceptance Criteria

1. THE Volunteer_Portal SHALL register the following routes in App.js: `/volunteer` (landing), `/volunteer/missions` (browse all), `/volunteer/skill/:skillName` (skill detail), `/volunteer/language/:languageName` (language detail), `/volunteer/map` (map view), `/volunteer/search` (search results)
2. WHEN a user navigates to `/volunteer` from the portal selection page, THE Volunteer_Portal SHALL render the volunteer landing page without the Layout wrapper (matching Customer and Donor portal patterns that use SearchHeader directly)
3. THE Volunteer_Portal SHALL support deep linking to any registered route via the HashRouter

### Requirement 8: Internationalization

**User Story:** As a non-English-speaking volunteer, I want the volunteer portal fully translated, so that I can use it in my preferred language.

#### Acceptance Criteria

1. THE Volunteer_Portal SHALL add all new UI strings to the English locale file under a `volunteerPortal` namespace (e.g., `volunteerPortal.urgentMissions`, `volunteerPortal.browseBySkill`, `volunteerPortal.nearbyOpportunities`)
2. THE Volunteer_Portal SHALL use the `t()` function from react-i18next for every user-visible string, with no hardcoded English text in components
3. WHEN the user switches language via the LanguagePopover, THE Volunteer_Portal SHALL re-render all visible text in the selected language

### Requirement 9: Urgency Level Display

**User Story:** As a volunteer, I want to see which missions are most urgent, so that I can prioritize my time where it matters most.

#### Acceptance Criteria

1. WHEN a Location has insecurityIndex of 5, THE Volunteer_Portal SHALL display a red "Critical" urgency badge on all associated missions and location cards
2. WHEN a Location has insecurityIndex of 4, THE Volunteer_Portal SHALL display an orange "High Need" urgency badge on all associated missions and location cards
3. WHEN a Location has insecurityIndex of 3 or below, THE Volunteer_Portal SHALL display a green or neutral urgency indicator
4. THE Landing_Page "Urgent Missions" section SHALL only include missions from locations with insecurityIndex of 4 or 5
5. THE Volunteer_Portal SHALL support sorting missions by urgency (insecurityIndex descending) as the default sort order on browse pages
