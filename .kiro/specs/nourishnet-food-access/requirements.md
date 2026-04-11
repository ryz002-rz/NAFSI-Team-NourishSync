# Requirements Document

## Introduction

NourishNet Food Access Tool is a static React application deployed on GitHub Pages that connects food-insecure families, donors, and volunteers to food distribution events in the DC/Maryland/PG County area. The application operates entirely client-side with pre-scraped data in a `locations.json` file. It features a tri-portal architecture (Customer, Donor, Volunteer), multi-language support (EN, ES, ZH, FR, AM, TL), voice-based filtering via the Web Speech API, and interactive maps via Leaflet.js. This is a 3-day hackathon project (April 11–13) with a hard deadline, so requirements are tiered by priority: P0 (must-have), P1 (should-have), P2 (nice-to-have).

## Glossary

- **App**: The NourishNet Food Access Tool React single-page application
- **Customer_Portal**: The section of the App that serves food-insecure families seeking food distribution events
- **Donor_Portal**: The section of the App that serves individuals or organizations wanting to donate food or money
- **Volunteer_Portal**: The section of the App that serves individuals wanting to volunteer their time
- **Gateway_Page**: The entry page of the App providing language selection, portal navigation, and optional demographic input
- **Location_Data**: The pre-scraped `locations.json` file containing food distribution event records with health attributes, coordinates, schedules, and organization details
- **Health_Attribute**: A tag on a Location_Data record indicating dietary or nutritional properties (e.g., Low-GI, Fresh Produce, Dairy-Free, Halal, Vegan, Vegetarian, No Beef)
- **Language_Toggle**: The UI component allowing users to switch between six supported languages (EN, ES, ZH, FR, AM, TL)
- **Voice_Filter**: The feature using the Web Speech API to capture spoken input, transcribe it, map keywords, and apply filters to the UI state
- **Map_View**: The Leaflet.js-powered interactive map displaying food distribution locations
- **Insecurity_Index**: A numeric score in Location_Data representing the level of food insecurity in a geographic area
- **Reservation_System**: A LocalStorage-based mechanism for users to book high-demand items at distribution events
- **Impact_Dashboard**: A Donor_Portal view showing calculated metrics for carbon footprint prevented and food waste diverted
- **SOS_Board**: A Volunteer_Portal view displaying urgent volunteer tasks in a horizontally scrollable layout
- **Filter_Bar**: A sticky horizontal tag bar in the Customer_Portal for selecting Health_Attribute filters
- **Router**: React Router, used for client-side navigation between portals and pages
- **i18n_System**: The react-i18next internationalization framework providing translated UI strings

## Requirements

### Requirement 1: Global Language Selection [P0]

**User Story:** As a user who speaks one of six supported languages, I want to select my preferred language on the Gateway_Page, so that the entire App displays content in my language.

#### Acceptance Criteria

1. THE Gateway_Page SHALL display a Language_Toggle with six language options: English (EN), Spanish (ES), Chinese (ZH), French (FR), Amharic (AM), and Tagalog (TL)
2. WHEN a user selects a language from the Language_Toggle, THE i18n_System SHALL render all UI labels, buttons, and static text in the selected language within 500ms
3. THE App SHALL default to English (EN) when no language has been selected
4. WHILE a user navigates between portals, THE i18n_System SHALL persist the selected language across all pages without requiring reselection

### Requirement 2: Tri-Portal Navigation [P0]

**User Story:** As a user, I want to choose between the Customer, Donor, and Volunteer portals from the Gateway_Page, so that I can access the features relevant to my role.

#### Acceptance Criteria

1. THE Gateway_Page SHALL display three portal navigation options labeled "Need" (Customer_Portal), "Share" (Donor_Portal), and "Serve" (Volunteer_Portal)
2. WHEN a user selects a portal option, THE Router SHALL navigate the user to the corresponding portal landing page
3. THE App SHALL provide a navigation element on every portal page that allows the user to return to the Gateway_Page

### Requirement 3: Optional Demographic Quick-Select [P1]

**User Story:** As a food-insecure family member, I want to optionally provide my household size, gender, and age on the Gateway_Page, so that the App can tailor results to my household needs.

#### Acceptance Criteria

1. THE Gateway_Page SHALL display optional input fields for household size (numeric), gender (select), and age (numeric range)
2. WHEN a user provides demographic information and navigates to the Customer_Portal, THE Customer_Portal SHALL use the demographic data to prioritize relevant Location_Data results
3. WHEN a user skips the demographic fields, THE Customer_Portal SHALL display all Location_Data results without demographic-based prioritization

### Requirement 4: Customer Portal Location Filtering [P0]

**User Story:** As a food-insecure family member, I want to filter food distribution events by dietary and nutritional attributes, so that I can find events that match my family's needs.

#### Acceptance Criteria

1. THE Customer_Portal SHALL display a Filter_Bar with selectable Health_Attribute tags including: Halal, Vegan, Vegetarian, No Beef, Low-GI, Fresh Produce, and Dairy-Free
2. WHEN a user selects one or more Health_Attribute tags from the Filter_Bar, THE Customer_Portal SHALL display only Location_Data records that match all selected tags
3. WHEN a user deselects all Health_Attribute tags, THE Customer_Portal SHALL display all Location_Data records
4. THE Filter_Bar SHALL remain visible at the top of the Customer_Portal while the user scrolls through results

### Requirement 5: Customer Portal Map View [P0]

**User Story:** As a food-insecure family member, I want to see food distribution locations on an interactive map, so that I can find the nearest events and understand their geographic proximity.

#### Acceptance Criteria

1. THE Map_View SHALL render all filtered Location_Data records as markers on a Leaflet.js map centered on the PG County/DC/Maryland area
2. WHEN a user taps a map marker, THE Map_View SHALL display a popup with the event name, address, operating hours, food types available, and any requirements for attendance
3. THE Map_View SHALL update displayed markers within 300ms when the user changes filter selections in the Filter_Bar
4. WHEN Location_Data contains geographic coordinates, THE Map_View SHALL position markers at the exact latitude and longitude from the data

### Requirement 6: Customer Portal Event Details [P0]

**User Story:** As a food-insecure family member, I want to see clear details about each food distribution event, so that I know when, where, and what to expect.

#### Acceptance Criteria

1. THE Customer_Portal SHALL display for each Location_Data record: event name, address, operating hours, food types available, Health_Attribute tags, and any attendance requirements
2. WHEN a Location_Data record includes schedule information, THE Customer_Portal SHALL display the next upcoming event date and time
3. IF a Location_Data record is missing required display fields (name, address, or hours), THEN THE Customer_Portal SHALL omit that record from the results and log a warning to the browser console

### Requirement 7: Voice-to-Need Filtering [P1]

**User Story:** As a user with limited literacy or mobility, I want to speak my food needs aloud, so that the App filters results based on my spoken words without requiring manual input.

#### Acceptance Criteria

1. THE Customer_Portal SHALL display a microphone button that activates the Voice_Filter
2. WHEN the user activates the Voice_Filter, THE App SHALL use the Web Speech API to capture and transcribe the user's spoken input
3. WHEN the Voice_Filter produces a transcription, THE App SHALL map recognized keywords (e.g., "halal", "vegetables", "dairy free") to corresponding Health_Attribute tags and apply them to the Filter_Bar
4. IF the Web Speech API is not supported by the user's browser, THEN THE App SHALL hide the microphone button and rely on manual filter selection
5. IF the Voice_Filter transcription contains no recognized keywords, THEN THE App SHALL display a message indicating no matching filters were found and retain the current filter state

### Requirement 8: Transit Distance Estimates [P1]

**User Story:** As a food-insecure family member, I want to see estimated distances to food distribution events, so that I can choose events that are accessible to me.

#### Acceptance Criteria

1. WHEN the user grants browser geolocation permission, THE Map_View SHALL calculate and display the straight-line distance from the user's location to each visible Location_Data marker
2. IF the user denies geolocation permission, THEN THE Map_View SHALL display Location_Data markers without distance estimates
3. THE Customer_Portal SHALL allow sorting of Location_Data results by distance from the user's location when geolocation is available

### Requirement 9: Community Ranking System [P2]

**User Story:** As a food-insecure family member, I want to see community ratings for distribution events, so that I can choose events with good efficiency, food quality, and staff friendliness.

#### Acceptance Criteria

1. THE Customer_Portal SHALL display a rating interface for each Location_Data record with three categories: efficiency, food quality, and staff friendliness
2. WHEN a user submits a rating, THE App SHALL store the rating in LocalStorage
3. THE Customer_Portal SHALL calculate and display the average rating per category for each Location_Data record using all ratings stored in LocalStorage

### Requirement 10: Local Secure Reservation [P2]

**User Story:** As a food-insecure family member, I want to reserve high-demand items at a distribution event, so that I can plan my visit with confidence.

#### Acceptance Criteria

1. WHEN a Location_Data record indicates high-demand items, THE Customer_Portal SHALL display a "Reserve" button for each available item
2. WHEN a user selects "Reserve," THE Reservation_System SHALL store the reservation details (item name, event ID, timestamp) in LocalStorage
3. THE Customer_Portal SHALL display a "My Reservations" section listing all active reservations from LocalStorage
4. WHEN a user cancels a reservation, THE Reservation_System SHALL remove the reservation from LocalStorage and update the "My Reservations" display


### Requirement 11: Donor Portal Need-Based Demand Heatmap [P1]

**User Story:** As a donor, I want to see a heatmap of food insecurity levels across the service area, so that I can direct my donations where they are needed most.

#### Acceptance Criteria

1. THE Donor_Portal SHALL render a Leaflet.js map with color-coded overlays representing the Insecurity_Index values from Location_Data
2. WHEN a donor hovers over or taps a heatmap region, THE Donor_Portal SHALL display the area name and its Insecurity_Index score
3. THE Donor_Portal SHALL display a legend mapping colors to Insecurity_Index ranges

### Requirement 12: Donor Portal Real-Time Demand Dashboard [P1]

**User Story:** As a donor, I want to see current wishlists from food distribution organizations, so that I can donate items that are most needed.

#### Acceptance Criteria

1. THE Donor_Portal SHALL display a dashboard listing wishlist items derived from Location_Data records
2. THE Donor_Portal SHALL group wishlist items by organization and display the organization name, item name, and quantity needed
3. WHEN a donor selects an organization from the dashboard, THE Donor_Portal SHALL display the organization's full contact details and donation instructions

### Requirement 13: Donor Portal Impact and Sustainability Dashboard [P2]

**User Story:** As a donor, I want to see the environmental impact of my donations, so that I feel motivated to continue contributing.

#### Acceptance Criteria

1. THE Impact_Dashboard SHALL display calculated metrics for carbon footprint prevented (in kg CO2) and food waste diverted (in kg) based on donation data stored in LocalStorage
2. WHEN a donor logs a donation in the App, THE Impact_Dashboard SHALL update the displayed metrics within 500ms
3. THE Impact_Dashboard SHALL display a cumulative total and a per-donation breakdown of impact metrics

### Requirement 14: Donor Gamification and Community Ranking [P2]

**User Story:** As a donor, I want to see how my contributions compare to other donors in the community, so that I am motivated to increase my impact.

#### Acceptance Criteria

1. THE Donor_Portal SHALL display a leaderboard ranking donors by total impact score calculated from LocalStorage donation records
2. WHEN a donor logs a new donation, THE Donor_Portal SHALL recalculate the donor's rank and update the leaderboard display
3. THE Donor_Portal SHALL assign badge labels (e.g., "Bronze Giver," "Silver Giver," "Gold Giver") based on cumulative impact thresholds

### Requirement 15: Volunteer Portal SOS Rescue Emergency Board [P1]

**User Story:** As a volunteer, I want to see urgent volunteer tasks prominently displayed, so that I can respond quickly to emergency needs.

#### Acceptance Criteria

1. THE SOS_Board SHALL display urgent volunteer tasks in a horizontally scrollable card layout
2. THE SOS_Board SHALL derive urgent tasks from Location_Data records flagged with an urgency indicator
3. WHEN a volunteer selects an urgent task card, THE Volunteer_Portal SHALL display the task details including location, time, required skills, and contact information

### Requirement 16: Volunteer Skill and Language Precision Matching [P1]

**User Story:** As a volunteer, I want to be matched with missions that fit my skills and language abilities, so that I can contribute effectively.

#### Acceptance Criteria

1. THE Volunteer_Portal SHALL display input fields for the volunteer to specify skills (multi-select) and spoken languages (multi-select from the six supported languages)
2. WHEN a volunteer submits skill and language preferences, THE Volunteer_Portal SHALL filter and display only Location_Data volunteer missions that match at least one selected skill and one selected language
3. WHEN no missions match the volunteer's preferences, THE Volunteer_Portal SHALL display a message indicating no matching missions and suggest broadening the selection criteria

### Requirement 17: Volunteer Calendar Sync [P2]

**User Story:** As a volunteer, I want to add accepted missions to my Google or Apple calendar, so that I can manage my schedule without manual entry.

#### Acceptance Criteria

1. WHEN a volunteer accepts a mission, THE Volunteer_Portal SHALL display "Add to Google Calendar" and "Add to Apple Calendar" buttons
2. WHEN a volunteer selects "Add to Google Calendar," THE Volunteer_Portal SHALL generate a Google Calendar event URL with the mission title, date, time, and location pre-filled and open it in a new browser tab
3. WHEN a volunteer selects "Add to Apple Calendar," THE Volunteer_Portal SHALL generate and download an .ics file containing the mission title, date, time, and location

### Requirement 18: Location Data Loading and Parsing [P0]

**User Story:** As a developer, I want the App to load and parse the locations.json file reliably, so that all portals have access to accurate food distribution data.

#### Acceptance Criteria

1. WHEN the App initializes, THE App SHALL fetch and parse the Location_Data file (`locations.json`) into an in-memory data structure
2. IF the Location_Data file fails to load or contains invalid JSON, THEN THE App SHALL display a user-facing error message indicating that data is temporarily unavailable
3. THE App SHALL parse Location_Data records and validate that each record contains at minimum: name, address, latitude, longitude, and operating hours
4. FOR ALL valid Location_Data records, parsing the JSON then serializing back to JSON then parsing again SHALL produce an equivalent data structure (round-trip property)

### Requirement 19: Client-Side Routing [P0]

**User Story:** As a user, I want to navigate between portals and pages using browser-standard URLs, so that I can bookmark pages and use the browser back button.

#### Acceptance Criteria

1. THE Router SHALL define distinct URL paths for: the Gateway_Page, Customer_Portal, Donor_Portal, and Volunteer_Portal
2. WHEN a user navigates to a defined URL path directly, THE Router SHALL render the corresponding page without errors
3. WHEN a user navigates to an undefined URL path, THE Router SHALL redirect the user to the Gateway_Page
4. THE Router SHALL support browser back and forward navigation between previously visited pages

### Requirement 20: Responsive and Accessible Design [P0]

**User Story:** As a user accessing the App from a mobile phone or assistive device, I want the interface to be usable on any screen size and navigable with assistive technology, so that the App is accessible to the broadest possible audience.

#### Acceptance Criteria

1. THE App SHALL render a usable layout on screen widths from 320px to 1920px using Tailwind CSS responsive utilities
2. THE App SHALL provide semantic HTML elements and ARIA labels on all interactive components
3. THE App SHALL support keyboard navigation for all interactive elements including the Language_Toggle, Filter_Bar, Map_View popups, and portal navigation
4. THE App SHALL maintain a minimum color contrast ratio of 4.5:1 for all text content against its background

### Requirement 21: GitHub Pages Deployment Compatibility [P0]

**User Story:** As a developer, I want the App to build and deploy correctly on GitHub Pages, so that the tool is publicly accessible without a backend server.

#### Acceptance Criteria

1. THE App SHALL produce a static build output compatible with GitHub Pages hosting using a standard React build process
2. THE Router SHALL use hash-based routing (HashRouter) to ensure client-side routes work correctly on GitHub Pages without server-side configuration
3. THE App SHALL load all assets (JavaScript, CSS, images, Location_Data) using relative paths to ensure correct resolution under a GitHub Pages subdirectory

### Requirement 22: Fallback Plans for Complex Features [P0]

**User Story:** As a project team member, I want defined fallback behaviors for complex features, so that the App remains functional if a P1 or P2 feature cannot be completed within the hackathon timeline.

#### Acceptance Criteria

1. IF the Voice_Filter implementation is incomplete, THEN THE Customer_Portal SHALL function with manual Health_Attribute filter selection only
2. IF the Donor_Portal heatmap implementation is incomplete, THEN THE Donor_Portal SHALL display a sorted list of areas by Insecurity_Index instead of a map overlay
3. IF the Impact_Dashboard calculation logic is incomplete, THEN THE Donor_Portal SHALL display static placeholder text indicating the feature is coming soon
4. IF the Volunteer_Portal calendar sync is incomplete, THEN THE Volunteer_Portal SHALL display mission details as copyable text for manual calendar entry
