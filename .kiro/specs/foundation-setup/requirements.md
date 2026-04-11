# Requirements Document — Foundation Setup (v2)

## Introduction

The Foundation Setup feature establishes the core infrastructure for the NourishNet food access tool. This feature provides the routing architecture, internationalization framework, data contract, layout structure, deployment configuration, and styling foundation that enables all subsequent development work. As a P0 (MUST HAVE) feature in a 3-day hackathon context, this foundation must be completed in Day 1 Morning Block (3 hours) to unblock parallel development by other team members.

### Context & Constraints

- **Challenge Requirement**: The application must be built exclusively using open source tools and libraries. No cloud backend services (Firebase, AWS, etc.) are permitted.
- **Deployment Target**: GitHub Pages (static hosting only). All data is pre-processed and bundled as static JSON.
- **Target Users**: Food-insecure households/families, donors, and volunteers in the DC/Maryland/PG County area. Many users may have limited technical literacy or access the app primarily via mobile phones.
- **Framework**: React with Vite, Tailwind CSS, React Router DOM v6, react-i18next, Leaflet.js.

---

## Glossary

- **Application**: The NourishNet React-based web application
- **Router**: The React Router DOM v6 routing system managing client-side navigation (using HashRouter for GitHub Pages compatibility)
- **Portal**: A distinct user-facing section of the application (Family, Donor, or Volunteer)
- **Gateway**: The landing page that provides navigation to the three portals
- **i18n_System**: The react-i18next internationalization system managing translations
- **Language_Toggle**: A UI component allowing users to switch between languages
- **Layout**: A reusable component providing consistent page structure across the application
- **Tailwind_Config**: The Tailwind CSS configuration file defining design system tokens
- **Translation_File**: JSON files in the locales/ directory containing language-specific text
- **Route**: A URL path mapped to a specific component in the application
- **Data_Contract**: The agreed-upon JSON schema for `locations.json` that all team members code against
- **Location_Entry**: A single food distribution site/event object in `locations.json`

---

## Requirements

### Requirement 1: Client-Side Routing Infrastructure

**User Story:** As a developer, I want a configured routing system, so that I can build portal-specific features without worrying about navigation infrastructure.

#### Acceptance Criteria

1. THE Router SHALL use `HashRouter` (not `BrowserRouter`) for GitHub Pages compatibility
2. THE Router SHALL define routes for Gateway (`/`), FamilyPortal (`/family`), DonorPortal (`/donor`), and VolunteerPortal (`/volunteer`)
3. WHEN a user navigates to a defined route, THE Router SHALL render the corresponding component
4. WHEN a user navigates to an undefined route, THE Router SHALL redirect to the Gateway
5. THE Application SHALL use React Router DOM v6 for all routing operations
6. THE Router configuration SHALL be defined in `App.jsx`

> **Why HashRouter?** GitHub Pages serves static files and does not support server-side URL rewriting. With `BrowserRouter`, refreshing any page other than `/` returns a 404. `HashRouter` uses URL fragments (e.g., `yoursite.github.io/#/family`) which work without server configuration.

---

### Requirement 2: Data Contract & Schema

**User Story:** As a team member, I want a documented and frozen data schema, so that the data engine, filtering logic, map components, and UI all work against the same contract without integration surprises.

#### Acceptance Criteria

1. THE Data_Contract SHALL be documented in `src/data/schema.md`
2. THE Data_Contract SHALL be frozen (no breaking changes) by Saturday 1:00 PM
3. THE Application SHALL load location data from `src/data/locations.json`
4. EACH Location_Entry in `locations.json` SHALL conform to the following schema:

```json
{
  "id": "string — unique identifier",
  "name": "string — organization/event name",
  "address": "string — full street address",
  "city": "string",
  "state": "string (e.g., MD, DC, VA)",
  "zip": "string",
  "lat": "number — latitude coordinate",
  "lng": "number — longitude coordinate",
  "phone": "string or null",
  "website": "string (URL) or null",
  "hours": "string — human-readable operating hours",
  "description": "string — brief description of the organization/event",

  "food_types": ["string array — e.g., 'Canned Goods', 'Fresh Produce', 'Prepared Meals', 'Bread/Bakery', 'Dairy', 'Meat/Protein'"],
  "dietary_tags": ["string array — e.g., 'Halal', 'Vegan', 'Vegetarian', 'Dairy-Free', 'Gluten-Free', 'Low-GI', 'Kosher'"],

  "event_dates": [
    {
      "day_of_week": "string — e.g., 'Monday'",
      "start_time": "string — e.g., '9:00 AM'",
      "end_time": "string — e.g., '12:00 PM'",
      "frequency": "string — 'Weekly', 'Biweekly', 'Monthly', 'One-time'",
      "notes": "string or null — e.g., 'First come first served', 'ID required'"
    }
  ],

  "requirements": "string or null — e.g., 'Photo ID required', 'Proof of residency', 'Walk-in welcome'",
  "serves": "string or null — e.g., 'PG County residents', 'Anyone', 'Families with children'",

  "volunteer_needs": {
    "accepting_volunteers": "boolean",
    "roles": ["string array — e.g., 'Food sorting', 'Distribution', 'Driver'"],
    "contact": "string or null"
  },

  "donation_info": {
    "accepts_food": "boolean",
    "accepts_money": "boolean",
    "accepts_other": "string or null — e.g., 'Hygiene products, diapers'",
    "dropoff_instructions": "string or null",
    "donation_url": "string (URL) or null"
  },

  "demand_level": "string — 'High', 'Medium', 'Low' (estimated)",
  "community_rating": "number — 1.0 to 5.0 (can be mock data for MVP)",
  "last_updated": "string — ISO date (e.g., '2025-04-12')"
}
```

5. JOSHUA SHALL produce a `locations.json` file with at least 15 entries extracted from the provided CSV data sources
6. THE Application SHALL gracefully handle missing optional fields (null values) without crashing
7. A sample `locations_sample.json` with 3 mock entries SHALL be committed by Saturday 10:00 AM so other team members can begin development immediately without waiting for real data

---

### Requirement 3: Internationalization System Configuration

**User Story:** As a developer, I want a configured i18n system, so that I can add translated content without setting up the infrastructure.

#### Acceptance Criteria

1. THE i18n_System SHALL be initialized in `src/utils/i18n.js`
2. THE i18n_System SHALL support English (EN) and Spanish (ES) as P0 languages
3. THE i18n_System SHALL support Chinese Simplified (ZH) as a P1 stretch language
4. THE i18n_System SHALL load translations from `src/locales/en.json`, `src/locales/es.json`, and (if P1 is achieved) `src/locales/zh.json`
5. THE i18n_System SHALL default to English when no language preference is detected
6. WHEN the i18n_System initializes, THE Application SHALL be ready to render translated content without errors
7. THE i18n key structure SHALL use dot notation namespacing: `"section.subsection.key"` (e.g., `"gateway.title"`, `"family.map.nearMe"`, `"donor.dashboard.impact"`)

> **Why only EN/ES as P0?** Quality over quantity. Poorly translated UI is worse than no translation. EN and ES cover the vast majority of users in the DC metro area. Additional languages are stretch goals.

---

### Requirement 4: Translation File Structure

**User Story:** As a developer, I want initial translation files with common keys, so that I can immediately use i18n in my components.

#### Acceptance Criteria

1. THE Translation_File for English SHALL exist at `src/locales/en.json`
2. THE Translation_File for Spanish SHALL exist at `src/locales/es.json`
3. THE Translation_Files SHALL include keys for at minimum:
   - `"gateway.title"` — app title
   - `"gateway.subtitle"` — app description/tagline
   - `"gateway.familyPortal"` — label for the family/household portal
   - `"gateway.donorPortal"` — label for the donor portal
   - `"gateway.volunteerPortal"` — label for the volunteer portal
   - `"common.loading"` — loading state text
   - `"common.error"` — generic error text
   - `"common.backToHome"` — navigation back to gateway
   - `"common.nearMe"` — geolocation button text
   - `"common.filter"` — filter label
   - `"common.search"` — search placeholder
   - `"common.noResults"` — empty state message
4. FOR ALL keys in `en.json`, THE `es.json` file SHALL contain a corresponding Spanish translation
5. THE Translation_Files SHALL use valid JSON syntax
6. ALL team members SHALL add new translation keys in BOTH `en.json` and `es.json` when building new UI components

---

### Requirement 5: Language Toggle Component

**User Story:** As a user, I want to switch between English and Spanish, so that I can use the application in my preferred language.

#### Acceptance Criteria

1. THE Language_Toggle SHALL render selectable options: "EN" and "ES" (and "ZH" if P1 is completed)
2. WHEN a user clicks "EN", THE i18n_System SHALL change the active language to English
3. WHEN a user clicks "ES", THE i18n_System SHALL change the active language to Spanish
4. WHEN the language changes, THE Application SHALL re-render all translated content in the selected language
5. THE Language_Toggle SHALL visually indicate which language is currently active (e.g., bold, underline, or background highlight)
6. THE Language_Toggle SHALL be located in `src/components/christian/LanguageToggle.jsx`
7. THE Language_Toggle SHALL persist the user's language choice to `localStorage` so it is remembered across sessions

---

### Requirement 6: Layout Component Structure

**User Story:** As a developer, I want a reusable Layout component, so that all pages have consistent structure without duplicating code.

#### Acceptance Criteria

1. THE Layout SHALL accept children components as props
2. THE Layout SHALL render a top navigation bar containing the app name/logo, Language_Toggle, and a "Back to Home" link (hidden on Gateway)
3. THE Layout SHALL render the Language_Toggle in a consistent position across all pages
4. THE Layout SHALL provide a content area where children components are rendered
5. THE Layout SHALL be mobile-first responsive: optimized for 375px viewport width as the base, scaling up to tablet (768px) and desktop (1024px+)
6. THE Layout SHALL be located in `src/components/christian/Layout.jsx`

> **Why mobile-first?** The challenge brief emphasizes accessibility for users with limited technical literacy. Many food-insecure users access the internet primarily via smartphones. Designing for mobile first ensures the most important audience has the best experience.

---

### Requirement 7: Tailwind CSS Design System Configuration

**User Story:** As a developer, I want a configured Tailwind design system, so that I can use consistent styling tokens across all components.

#### Acceptance Criteria

1. THE Tailwind_Config SHALL define a custom color palette in `tailwind.config.js` with the following semantic colors:
   - `primary` — main brand color (suggested: a warm green to evoke food/nature/growth)
   - `secondary` — accent color
   - `surface` — card/panel backgrounds
   - `muted` — subdued text and borders
   - `danger` — error states
   - `success` — positive states
2. THE Tailwind_Config SHALL extend the theme with:
   - `rounded-2xl` for card border radius
   - `shadow-soft` for subtle card elevation
   - Custom font family (suggested: Inter or system font stack for performance)
3. THE Tailwind_Config SHALL be configured to scan all `.jsx` files in the `src/` directory
4. WHEN the Application builds, THE Tailwind_Config SHALL generate CSS without errors
5. THE Tailwind_Config SHALL support responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
6. RYAN SHALL document the design tokens (colors, spacing, radii, shadows) in `src/styles/DESIGN_SYSTEM.md` for all team members to reference

---

### Requirement 8: Project Structure Organization

**User Story:** As a team member, I want an organized component folder structure, so that I can work on my components without merge conflicts.

#### Acceptance Criteria

1. THE Application SHALL follow this directory structure:

```
src/
├── components/
│   ├── christian/        # Christian's components (Layout, Gateway, LanguageToggle, etc.)
│   ├── joe/              # Joe's components (VoiceFilter, ImpactDashboard, etc.)
│   ├── ryan/             # Ryan's components (UI polish, design spec components)
│   └── shared/           # Shared/reusable components (MapView, FilterBar, EventCard, etc.)
├── pages/
│   ├── FamilyPortal.jsx
│   ├── DonorPortal.jsx
│   └── VolunteerPortal.jsx
├── data/
│   ├── locations.json          # Joshua's output — the real data
│   ├── locations_sample.json   # Mock data for development (3 entries)
│   └── schema.md               # Data contract documentation
├── hooks/                # Joe's custom React hooks (useFilters, useVoice, useGeolocation)
├── utils/
│   ├── i18n.js           # i18n configuration
│   ├── filters.js        # Joe's filtering algorithms
│   └── impact.js         # Joe's impact calculation formulas
├── locales/
│   ├── en.json
│   └── es.json
├── styles/
│   ├── DESIGN_SYSTEM.md  # Ryan's design token documentation
│   └── globals.css       # Global CSS (Tailwind directives + any custom CSS)
├── App.jsx
└── main.jsx
```

2. EACH team member SHALL primarily work within their designated directories to minimize merge conflicts
3. SHARED components SHALL be discussed and agreed upon before creation to avoid duplication

---

### Requirement 9: Gateway Page Navigation

**User Story:** As a user, I want a landing page with clear navigation options, so that I can access the portal relevant to my needs.

#### Acceptance Criteria

1. THE Gateway SHALL display three navigation cards: "Find Food" (Family Portal), "Donate" (Donor Portal), and "Volunteer" (Volunteer Portal)
2. EACH navigation card SHALL include an icon/illustration, a title, and a brief description of what the user will find
3. WHEN a user clicks "Find Food", THE Router SHALL navigate to `/#/family`
4. WHEN a user clicks "Donate", THE Router SHALL navigate to `/#/donor`
5. WHEN a user clicks "Volunteer", THE Router SHALL navigate to `/#/volunteer`
6. THE Gateway SHALL display translated text based on the active language
7. THE Gateway SHALL be visually warm, welcoming, and non-stigmatizing — avoid clinical or bureaucratic language
8. THE Gateway SHALL be located in `src/components/christian/Gateway.jsx`
9. THE Gateway SHALL include a brief tagline explaining the app's purpose (e.g., "Connecting communities to food resources in the DC/Maryland area")

> **Design Note:** The language of food assistance matters. Use "Find Food" not "Get Assistance." Use "Community Food Resources" not "Food Bank Lookup." The goal is dignity and accessibility.

---

### Requirement 10: Portal Page Placeholders

**User Story:** As a developer, I want placeholder portal pages, so that routing works end-to-end and I can build features incrementally.

#### Acceptance Criteria

1. THE Application SHALL have a FamilyPortal component at `src/pages/FamilyPortal.jsx`
2. THE Application SHALL have a DonorPortal component at `src/pages/DonorPortal.jsx`
3. THE Application SHALL have a VolunteerPortal component at `src/pages/VolunteerPortal.jsx`
4. WHEN a portal page renders, THE Application SHALL display the portal name and a placeholder message (e.g., "Coming soon — this page will show nearby food distribution events")
5. THE portal pages SHALL use the Layout component for consistent structure
6. THE portal pages SHALL import and display data from `locations_sample.json` to verify the data pipeline works end-to-end
7. THE portal pages SHALL include a "Back to Home" navigation element

---

### Requirement 11: GitHub Pages Deployment Configuration

**User Story:** As a team member, I want the app configured for GitHub Pages deployment, so that we can deploy and test the live version early.

#### Acceptance Criteria

1. THE `package.json` SHALL include a `"homepage"` field set to the GitHub Pages URL (e.g., `"https://<username>.github.io/<repo-name>"`)
2. THE Application SHALL use `HashRouter` to ensure all routes work on GitHub Pages without 404 errors
3. THE `package.json` SHALL include a `"deploy"` script using the `gh-pages` npm package (e.g., `"deploy": "npm run build && gh-pages -d dist"`)
4. THE Application SHALL build to static files via `npm run build` without errors
5. THE team SHALL deploy a working version to GitHub Pages by end of Day 1 (Saturday evening) to verify the deployment pipeline works
6. THE `vite.config.js` SHALL set the `base` option to match the GitHub Pages path (e.g., `base: '/<repo-name>/'`)

> **Why deploy on Day 1?** Catching deployment issues early is critical. Many teams lose hours on Monday fixing build/deploy problems. A working (even skeleton) deployment on Saturday night means you spend Sunday polishing features, not debugging CI.

---

### Requirement 12: User Preferences (localStorage)

**User Story:** As a returning user, I want my preferences (language, dietary needs, role) remembered, so that I don't have to re-enter them each visit.

#### Acceptance Criteria

1. THE Application SHALL save user preferences to `localStorage` with the key `"nourishnet_prefs"`
2. THE preferences object SHALL include: `language` (string), `role` (string: "family" | "donor" | "volunteer"), `dietary_tags` (string array), `household_size` (number or null)
3. WHEN the Application loads, THE Application SHALL check `localStorage` for existing preferences
4. IF preferences exist AND a role is set, THE Application MAY offer to navigate directly to the user's preferred portal
5. THE Application SHALL never store personally identifiable information (name, email, address) in localStorage

---

### Requirement 13: Foundation Validation

**User Story:** As a developer, I want to verify the foundation works correctly, so that I can confidently build features on top of it.

#### Acceptance Criteria

1. WHEN the Application starts, THE Application SHALL render without console errors
2. WHEN a user navigates between routes, THE Router SHALL update the URL hash and render the correct component
3. WHEN a user toggles language, THE i18n_System SHALL update all translated content within 500ms
4. WHEN the Application loads `locations_sample.json`, THE Application SHALL parse and display at least one location entry without errors
5. WHEN the Application builds for production, THE build process SHALL complete without errors
6. THE Application SHALL be accessible at `http://localhost:5173` during development (Vite default)
7. THE Application SHALL be deployable to GitHub Pages with all routes functional

---

## Priority Tiers (Risk Mitigation)

In case the team falls behind schedule, features are prioritized as follows:

### P0 — MUST HAVE (Day 1)
- HashRouter routing with all 4 routes
- Gateway page with 3 portal cards
- Layout component (navbar, content area, responsive)
- i18n with EN/ES
- Language toggle
- Data contract (schema.md + locations_sample.json)
- Project folder structure
- GitHub Pages deployment pipeline
- Tailwind config with design tokens

### P1 — SHOULD HAVE (Day 2)
- Real `locations.json` from Joshua replaces sample data
- Chinese (ZH) language support
- localStorage user preferences
- Design system documentation (Ryan)

### P2 — NICE TO HAVE (Day 2-3)
- Additional languages (FR, AM, TL)
- Onboarding flow (dietary preferences, household size before portal selection)
- Animated transitions between routes

---

## Integration Checkpoints

| Time | Checkpoint | Who | What |
|------|-----------|-----|------|
| Sat 10:00 AM | Schema Freeze | Joshua + Christian | `schema.md` and `locations_sample.json` committed |
| Sat 12:00 PM | Foundation Merge | Christian | Router, Layout, Gateway, i18n, Tailwind config pushed to `main` |
| Sat 12:30 PM | Team Pull | Everyone | All team members pull `main`, verify app runs locally |
| Sat 1:00 PM | Data Contract Lock | All | No breaking changes to `locations.json` schema after this point |
| Sat 6:00 PM | Skeleton Deploy | Christian | Working skeleton deployed to GitHub Pages |
| Sun 12:00 PM | Feature Merge | Joe + Christian | Joe's hooks/logic integrated into Christian's portal pages |
| Sun 5:00 PM | Final Deploy | Christian | All features merged, final build deployed |
| Mon 12:00 PM | Repo Freeze | All | No more pushes — final QA only |