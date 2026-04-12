# Tasks — Foundation Setup

## Git Workflow

### Branch Strategy

Each team member works on a dedicated feature branch off `main`. This prevents merge conflicts since tasks are scoped to separate files/directories.

| Member | Branch Name | Key Files Touched |
|--------|------------|-------------------|
| Christian | `christian/foundation-core` | `App.js`, `components/christian/*`, `utils/i18n.js`, `locales/*`, `index.css`, `tailwind.config.js` |
| Joshua | `joshua/data-contract` | `data/schema.md`, `data/locations_sample.json` |
| Ryan | `ryan/portals-and-docs` | `pages/*`, `styles/DESIGN_SYSTEM.md` |
| Joe | `joe/utils-and-tests` | `utils/preferences.js`, `package.json` (deploy scripts), `__tests__/*` |

### Merge Order (Critical Path)

Branches must merge in this order to avoid broken imports:

```
1. joshua/data-contract   → main   (no dependencies — merge first)
2. christian/foundation-core → main   (depends on Joshua's sample data existing)
3. ryan/portals-and-docs  → main   (depends on Christian's Layout, i18n, and Joshua's sample data)
4. joe/utils-and-tests    → main   (depends on all of the above)
```

### Git Commands Cheat Sheet

**Starting work (everyone does this first):**
```bash
git checkout main
git pull origin main
git checkout -b <your-branch-name>
```

**While working — commit often:**
```bash
git add .
git commit -m "feat: <short description>"
```

**Before merging — rebase on latest main:**
```bash
git checkout main
git pull origin main
git checkout <your-branch-name>
git rebase main
# Fix any conflicts, then:
git rebase --continue
```

**Merging to main (one person at a time, follow merge order above):**
```bash
git checkout main
git merge <your-branch-name>
git push origin main
```

**After someone else merges — update your branch:**
```bash
git checkout <your-branch-name>
git rebase main
```

### Conflict Prevention Rules

1. Only edit files in your assigned directories
2. If you need to touch a shared file (e.g., `package.json`), coordinate on Slack/Discord first
3. Christian owns `App.js` — nobody else edits it
4. Joshua owns `src/data/` — nobody else edits data files
5. Joe's `package.json` changes (deploy scripts) should merge BEFORE Christian's branch to avoid conflicts, OR Joe can hand those 2 lines to Christian to include

---

## Task 1: Project Configuration & Tailwind Design System

### 👤 Christian — Tasks 1.1, 1.2 | Ryan — Task 1.5 | Joe — Tasks 1.3, 1.4

- [x] 1.1 **[Christian]** Update `tailwind.config.js` with design system tokens (colors: primary green palette, secondary orange palette, surface, muted, danger, success; borderRadius: 2xl; boxShadow: soft; fontFamily: Inter + system stack)
- [x] 1.2 **[Christian]** Update `src/index.css` to include Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and set base font-family to the design system font stack
- [ ] 1.3 **[Joe]** Add `gh-pages` as a dev dependency (`npm install --save-dev gh-pages --legacy-peer-deps`)
- [ ] 1.4 **[Joe]** Add `"homepage"` field and `"predeploy"` / `"deploy"` scripts to `package.json` for GitHub Pages deployment
- [x] 1.5 **[Ryan]** Create `src/styles/DESIGN_SYSTEM.md` documenting all design tokens (colors, spacing, radii, shadows, fonts, breakpoints) for team reference

## Task 2: i18n System & Translation Files

### 👤 Christian

- [x] 2.1 **[Christian]** Create `src/locales/en.json` with all required translation keys (gateway.title, gateway.subtitle, gateway.familyPortal, gateway.familyPortalDesc, gateway.donorPortal, gateway.donorPortalDesc, gateway.volunteerPortal, gateway.volunteerPortalDesc, common.loading, common.error, common.backToHome, common.nearMe, common.filter, common.search, common.noResults, common.comingSoon, portal.family.title, portal.family.placeholder, portal.donor.title, portal.donor.placeholder, portal.volunteer.title, portal.volunteer.placeholder)
- [x] 2.2 **[Christian]** Create `src/locales/es.json` with corresponding Spanish translations for all keys in `en.json`
- [x] 2.3 **[Christian]** Create `src/utils/i18n.js` — initialize i18next with `initReactI18next`, bundle EN/ES resources, read saved language from `localStorage` key `nourishnet_prefs`, set `fallbackLng: 'en'`, set `interpolation: { escapeValue: false }`

## Task 3: Data Contract & Sample Data

### 👤 Joshua — ⚡ MERGE FIRST (no dependencies)

- [x] 3.1 **[Joshua]** Create `src/data/schema.md` documenting the frozen LocationEntry schema (all fields, types, required vs optional, example values) and the UserPreferences localStorage schema
- [x] 3.2 **[Joshua]** Create `src/data/locations_sample.json` with 3 mock LocationEntry objects conforming to the schema (include variety: one with all fields populated, one with null optional fields, one with minimal data)

> **Git note:** Joshua can branch, complete, and merge to `main` immediately — this has zero dependencies and unblocks Ryan's portal pages.

## Task 4: Layout & LanguageToggle Components

### 👤 Christian — depends on Task 2

- [x] 4.1 **[Christian]** Create `src/components/christian/LanguageToggle.jsx` — render "EN" and "ES" buttons, call `i18n.changeLanguage()` on click, highlight active language with distinct styling, persist choice to `localStorage` under `nourishnet_prefs.language`, read saved preference on mount
- [x] 4.2 **[Christian]** Create `src/components/christian/Layout.jsx` — accept `children` prop, render top navbar with app name (links to `/`), `LanguageToggle`, and "Back to Home" link (hidden when `useLocation().pathname === '/'`), render children in main content area, mobile-first responsive layout

## Task 5: Gateway Page

### 👤 Christian — depends on Tasks 2, 4

- [x] 5.1 **[Christian]** Create `src/components/christian/Gateway.jsx` — display translated app title (`gateway.title`), tagline (`gateway.subtitle`), and three portal navigation cards in a responsive grid (1 column mobile, 3 columns on `md:`)
- [x] 5.2 **[Christian]** Each portal card uses `<Link>` from react-router-dom: "Find Food" → `/family`, "Donate" → `/donor`, "Volunteer" → `/volunteer`; each card includes an emoji icon, translated title, and translated description; cards use `rounded-2xl`, `shadow-soft`, and `surface` background from design tokens

## Task 6: Portal Placeholder Pages

### 👤 Ryan — depends on Tasks 2 (i18n), 3 (sample data), 4 (Layout)

- [x] 6.1 **[Ryan]** Create `src/pages/FamilyPortal.jsx` — display translated portal title (`portal.family.title`) and placeholder message (`portal.family.placeholder`), import and render at least one entry from `locations_sample.json` showing name and address
- [x] 6.2 **[Ryan]** Create `src/pages/DonorPortal.jsx` — display translated portal title (`portal.donor.title`) and placeholder message (`portal.donor.placeholder`), import and render at least one entry from `locations_sample.json`
- [x] 6.3 **[Ryan]** Create `src/pages/VolunteerPortal.jsx` — display translated portal title (`portal.volunteer.title`) and placeholder message (`portal.volunteer.placeholder`), import and render at least one entry from `locations_sample.json`

> **Git note:** Ryan should wait until Joshua's `data-contract` branch is merged to `main`, then rebase before starting. Ryan also needs Christian's i18n and Layout to be available — either merged or shared via a preview branch.

## Task 7: App Routing Setup

### 👤 Christian — depends on Tasks 4, 5, 6

- [ ] 7.1 **[Christian]** Rewrite `src/App.js` — import `HashRouter`, `Routes`, `Route`, `Navigate` from react-router-dom; import `Layout`, `Gateway`, `FamilyPortal`, `DonorPortal`, `VolunteerPortal`; import `./utils/i18n` for side-effect initialization; wrap app in `<HashRouter>` → `<Layout>` → `<Routes>` with routes for `/` (Gateway), `/family`, `/donor`, `/volunteer`, and `*` (redirect to `/`)
- [ ] 7.2 **[Christian]** Remove default CRA boilerplate from `src/App.js` (logo import, App.css import, default JSX) and delete `src/App.css` if no longer needed

> **Git note:** Christian should merge AFTER Ryan's portal pages are on `main`, so the imports in App.js resolve. Alternatively, Christian can create stub portal files and Ryan overwrites them — coordinate on this.

## Task 8: User Preferences (localStorage)

### 👤 Joe — no hard dependencies (can start immediately)

- [ ] 8.1 **[Joe]** Create `src/utils/preferences.js` — export `getPreferences()` (reads and parses `nourishnet_prefs` from localStorage with try/catch, returns default object if missing/invalid), `savePreferences(prefs)` (merges with existing prefs and saves to localStorage), and `DEFAULT_PREFS` constant (`{ language: 'en', role: null, dietary_tags: [], household_size: null }`)
- [ ] 8.2 **[Joe]** Integrate preferences utility into `LanguageToggle.jsx` (use `savePreferences` when language changes) and `i18n.js` (use `getPreferences` to read saved language on init)

> **Git note:** Task 8.1 (preferences.js) can be built independently. Task 8.2 touches Christian's files — coordinate with Christian. Best approach: Joe creates preferences.js, Christian integrates it into LanguageToggle and i18n.js during his own work.

## Task 9: Smoke & Build Verification

### 👤 Ryan — after all branches merged to main

- [ ] 9.1 **[Ryan]** Run `npm start` and verify the app renders without console errors, Gateway displays with 3 portal cards, navigation between all routes works, language toggle switches between EN/ES, and sample data displays on portal pages
- [ ] 9.2 **[Ryan]** Run `npm run build` and verify the production build completes without errors

> **Git note:** This is the final verification step. All 4 branches must be merged to `main` first. Ryan pulls latest `main` and runs these checks.

## Task 10: Property-Based Tests

### 👤 Joe — after all branches merged to main

- [ ] 10.1 **[Joe]** Install `fast-check` as a dev dependency (`npm install --save-dev fast-check --legacy-peer-deps`)
- [ ] 10.2 **[Joe]** [PBT] Property 1: Defined routes render correct components — *For any* route in the defined route table, navigating to that route should render the mapped component and no other portal component (use `MemoryRouter` with each route, verify correct component text appears)
- [ ] 10.3 **[Joe]** [PBT] Property 2: Undefined routes redirect to Gateway — *For any* URL path string that is not a defined route, navigating to it should redirect to the Gateway page (generate random alphanumeric path strings with fast-check, render in `MemoryRouter`, verify Gateway renders)
- [ ] 10.4 **[Joe]** [PBT] Property 3: LocationEntry schema conformance and null-safety — *For any* LocationEntry object with random combinations of null optional fields, the entry should have all required fields with correct types AND rendering it in a portal component should not throw
- [ ] 10.5 **[Joe]** [PBT] Property 4: Translation key parity and format — *For any* key in `en.json`, that key should also exist in `es.json` with a non-empty string value AND the key should match dot-notation format
- [ ] 10.6 **[Joe]** [PBT] Property 5: Language switch updates all translations — *For any* supported language and any i18n key, after `i18n.changeLanguage(lang)`, `t(key)` should return the value from that language's translation file
- [ ] 10.7 **[Joe]** [PBT] Property 6: Language preference persistence round-trip — *For any* supported language code, selecting it should persist to localStorage such that reading `nourishnet_prefs.language` returns the same code
- [ ] 10.8 **[Joe]** [PBT] Property 7: User preferences localStorage round-trip — *For any* valid UserPreferences object, saving to localStorage and reading back should produce an equivalent object with all required fields

---

## Parallel Execution Timeline

```
9:00 AM  ──────────────────────────────────────────────── 12:00 PM
         
Joshua:  [Task 3: schema + sample data] → MERGE TO MAIN
         
Christian: [Task 1.1-1.2: Tailwind] → [Task 2: i18n + locales] → [Task 4: Layout + Toggle]
         
Joe:     [Task 1.3-1.4: gh-pages] → [Task 8.1: preferences.js] → [Task 10.1: install fast-check]
         
Ryan:    [Task 1.5: DESIGN_SYSTEM.md] → (wait for Joshua merge) → [Task 6: Portal pages]

12:00 PM ──────────────────────────────────────────────── 2:00 PM

Joshua merge → Christian merge → Ryan merge → Joe merge

Christian: [Task 5: Gateway] → [Task 7: App routing] → MERGE TO MAIN
Ryan:    [Task 6: continued] → MERGE TO MAIN → [Task 9: Smoke test]
Joe:     [Task 8.2: integrate prefs] → MERGE TO MAIN → [Task 10: PBT tests]
```
