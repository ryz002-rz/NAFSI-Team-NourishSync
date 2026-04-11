# NourishNet Food Access Tool - 3-Day Hackathon Plan

**Timeline**: Saturday April 11 → Monday April 13, 2PM PT (Hard Deadline)  
**Team**: Joshua (Data), Christian (Lead Vibe), Joe (Logic), Ryan (UX/Logic Support)

---

## 🎯 Priority Tiers

### P0 - MUST HAVE (Core MVP)
- Gateway page with language toggle (EN/ES minimum)
- Customer portal with basic location listing
- Basic map integration (Leaflet)
- locations.json data file
- GitHub Pages deployment

### P1 - SHOULD HAVE (Enhanced Experience)
- All 6 languages (EN, ES, ZH, FR, AM, TL)
- Dietary filters (Halal, Vegan, Vegetarian, No Beef)
- Donor portal with basic organization listing
- Volunteer portal with mission listing
- Voice search (Web Speech API)

### P2 - NICE TO HAVE (Innovation Features)
- Heatmap visualization
- Impact calculator
- LocalStorage reservation system
- Calendar sync
- Community rankings

---

## 📁 File Structure (Merge Conflict Prevention)

```
nourishnet-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── christian/          # Christian's components
│   │   │   ├── Gateway.jsx
│   │   │   ├── LanguageToggle.jsx
│   │   │   └── Layout.jsx
│   │   ├── joe/                # Joe's components
│   │   │   ├── VoiceSearch.jsx
│   │   │   ├── FilterEngine.jsx
│   │   │   └── ImpactCalculator.jsx
│   │   ├── ryan/               # Ryan's components
│   │   │   ├── MapView.jsx
│   │   │   ├── LocationCard.jsx
│   │   │   └── DietaryFilters.jsx
│   │   └── shared/             # Shared components
│   │       └── Button.jsx
│   ├── pages/
│   │   ├── CustomerPortal.jsx
│   │   ├── DonorPortal.jsx
│   │   └── VolunteerPortal.jsx
│   ├── data/
│   │   └── locations.json      # Joshua's data file
│   ├── locales/
│   │   ├── en.json
│   │   ├── es.json
│   │   ├── zh.json
│   │   ├── fr.json
│   │   ├── am.json
│   │   └── tl.json
│   ├── utils/
│   │   ├── filterUtils.js      # Joe's utilities
│   │   └── i18n.js             # Christian's i18n config
│   ├── App.jsx
│   ├── index.js
│   └── index.css
└── package.json
```

---

## 📅 DAY 1 - Saturday April 11 (Foundation Day)

### Morning Block (9:00 AM - 12:00 PM)

#### Joshua (Data Engine) - 3 hours
**9:00 - 12:00**: Data extraction and schema design
- [ ] Analyze CSV data sources
- [ ] Define locations.json schema with health attributes
- [ ] Extract PG County data (minimum 20 locations for MVP)
- [ ] Create sample data structure

**Deliverable**: `src/data/locations.json` with schema:
```json
{
  "id": "string",
  "name": "string",
  "address": "string",
  "lat": "number",
  "lng": "number",
  "hours": "string",
  "requirements": "string[]",
  "foodTypes": "string[]",
  "healthAttributes": {
    "lowGI": "boolean",
    "freshProduce": "boolean",
    "dairyFree": "boolean",
    "halal": "boolean",
    "vegan": "boolean",
    "vegetarian": "boolean",
    "noBeef": "boolean"
  },
  "insecurityIndex": "number",
  "type": "customer|donor|volunteer"
}
```

#### Christian (Lead Vibe Coder) - 3 hours
**9:00 - 10:30**: Project setup and routing
- [ ] Set up React Router structure
- [ ] Create App.jsx with route definitions
- [ ] Create basic Layout component

**10:30 - 12:00**: i18n foundation (P0: EN/ES only)
- [ ] Configure react-i18next in `utils/i18n.js`
- [ ] Create `locales/en.json` and `locales/es.json`
- [ ] Build LanguageToggle component (EN/ES toggle)

**Deliverables**:
- `src/App.jsx` with routing
- `src/utils/i18n.js`
- `src/components/christian/LanguageToggle.jsx`
- `src/locales/en.json`, `src/locales/es.json`

#### Joe (Logic & Innovation) - 3 hours
**9:00 - 12:00**: Core filtering logic
- [ ] Design filter state management architecture
- [ ] Create `utils/filterUtils.js` with filter functions
- [ ] Implement dietary filter logic
- [ ] Create FilterEngine component skeleton

**Deliverables**:
- `src/utils/filterUtils.js`
- `src/components/joe/FilterEngine.jsx`

#### Ryan (UX Spec & Logic Support) - 3 hours
**9:00 - 10:30**: Tailwind design system
- [ ] Define color palette in `tailwind.config.js`
- [ ] Create utility classes (gap-4, rounded-2xl, shadow-soft)
- [ ] Document design tokens

**10:30 - 12:00**: Map component foundation
- [ ] Set up Leaflet.js integration
- [ ] Create basic MapView component
- [ ] Test map rendering with sample coordinates

**Deliverables**:
- Updated `tailwind.config.js`
- `src/components/ryan/MapView.jsx`

---

### Afternoon Block (1:00 PM - 5:00 PM)

#### Joshua (Data Engine) - 4 hours
**1:00 - 3:00**: Data enrichment
- [ ] Add health attributes to all locations
- [ ] Calculate insecurity index for locations
- [ ] Validate data completeness

**3:00 - 5:00**: Data documentation
- [ ] Create data dictionary
- [ ] Document attribute meanings
- [ ] Prepare sample queries for team

**Deliverable**: Complete `locations.json` with 50+ locations

#### Christian (Lead Vibe Coder) - 4 hours
**1:00 - 3:00**: Gateway page (P0)
- [ ] Build Gateway.jsx with tri-portal navigation
- [ ] Implement language toggle integration
- [ ] Create routing to Customer/Donor/Volunteer portals

**3:00 - 5:00**: Global styling
- [ ] Apply Tailwind to Gateway
- [ ] Create reusable button/card components in shared/
- [ ] Ensure responsive design

**Deliverables**:
- `src/components/christian/Gateway.jsx`
- `src/components/shared/Button.jsx`

#### Joe (Logic & Innovation) - 4 hours
**1:00 - 3:00**: Voice API research and prototyping
- [ ] Research Web Speech API browser compatibility
- [ ] Create VoiceSearch component prototype
- [ ] Test speech recognition with sample keywords

**3:00 - 5:00**: Voice-to-filter mapping
- [ ] Build keyword mapping logic ("vegetables" → freshProduce filter)
- [ ] Integrate with FilterEngine
- [ ] Handle edge cases and errors

**Deliverable**: `src/components/joe/VoiceSearch.jsx` (P1 feature)

#### Ryan (UX Spec & Logic Support) - 4 hours
**1:00 - 3:00**: Location card design
- [ ] Create LocationCard component
- [ ] Implement card layout with Tailwind
- [ ] Add distance display logic

**3:00 - 5:00**: Dietary filter UI
- [ ] Build DietaryFilters component
- [ ] Create toggle buttons for filters
- [ ] Integrate with Joe's FilterEngine

**Deliverables**:
- `src/components/ryan/LocationCard.jsx`
- `src/components/ryan/DietaryFilters.jsx`

---

### Evening Block (6:00 PM - 9:00 PM) - Optional

**Team Sync**: 6:00 - 6:30 PM
- Demo progress
- Identify blockers
- Adjust Day 2 priorities

**Individual Work**: 6:30 - 9:00 PM
- Catch up on incomplete tasks
- Bug fixes
- Prepare for Day 2 integration

---

## 📅 DAY 2 - Sunday April 12 (Integration Day)

### Morning Block (9:00 AM - 12:00 PM)

#### Joshua (Data Engine) - 3 hours
**9:00 - 12:00**: Data refinement and support
- [ ] Add donor-specific data (wishlists, needs)
- [ ] Add volunteer-specific data (missions, skills required)
- [ ] Support team with data queries
- [ ] Create data loading utilities

**Deliverable**: Enhanced `locations.json` with donor/volunteer data

#### Christian (Lead Vibe Coder) - 3 hours
**9:00 - 12:00**: Customer Portal (P0)
- [ ] Build CustomerPortal.jsx page
- [ ] Integrate LocationCard list
- [ ] Connect to locations.json data
- [ ] Implement basic search

**Deliverable**: `src/pages/CustomerPortal.jsx`

#### Joe (Logic & Innovation) - 3 hours
**9:00 - 12:00**: Advanced filtering
- [ ] Implement multi-filter logic (AND/OR conditions)
- [ ] Add distance-based filtering
- [ ] Optimize filter performance
- [ ] Add filter state persistence (LocalStorage)

**Deliverable**: Production-ready FilterEngine

#### Ryan (UX Spec & Logic Support) - 3 hours
**9:00 - 12:00**: Map integration
- [ ] Connect MapView to locations data
- [ ] Add markers for each location
- [ ] Implement marker click → location details
- [ ] Add user location detection

**Deliverable**: Functional MapView with markers

---

### Afternoon Block (1:00 PM - 5:00 PM)

#### Joshua (Data Engine) - 4 hours
**1:00 - 5:00**: Quality assurance and data testing
- [ ] Validate all location coordinates
- [ ] Test data loading in app
- [ ] Fix data inconsistencies
- [ ] Create backup data file

**Deliverable**: Validated, production-ready data

#### Christian (Lead Vibe Coder) - 4 hours
**1:00 - 3:00**: Donor Portal (P1)
- [ ] Build DonorPortal.jsx page
- [ ] Create organization listing
- [ ] Add wishlist display
- [ ] Implement donor filters

**3:00 - 5:00**: Volunteer Portal (P1)
- [ ] Build VolunteerPortal.jsx page
- [ ] Create mission listing
- [ ] Add skill/language filters
- [ ] Implement mission cards

**Deliverables**:
- `src/pages/DonorPortal.jsx`
- `src/pages/VolunteerPortal.jsx`

#### Joe (Logic & Innovation) - 4 hours
**1:00 - 3:00**: Impact Calculator (P2)
- [ ] Design impact calculation formulas
- [ ] Create ImpactCalculator component
- [ ] Calculate carbon footprint saved
- [ ] Calculate food waste diverted

**3:00 - 5:00**: Voice search refinement
- [ ] Improve keyword recognition
- [ ] Add voice feedback UI
- [ ] Handle multiple languages (if time permits)
- [ ] Error handling and fallbacks

**Deliverables**:
- `src/components/joe/ImpactCalculator.jsx`
- Polished VoiceSearch

#### Ryan (UX Spec & Logic Support) - 4 hours
**1:00 - 3:00**: UI polish and responsiveness
- [ ] Test all components on mobile
- [ ] Fix responsive issues
- [ ] Add loading states
- [ ] Add error states

**3:00 - 5:00**: Logic testing with Joe
- [ ] Test voice search flow
- [ ] Test filter combinations
- [ ] Test map interactions
- [ ] Document bugs

**Deliverable**: Responsive, polished UI

---

### Evening Block (6:00 PM - 9:00 PM)

**Team Integration Session**: 6:00 - 9:00 PM
- Merge all components
- End-to-end testing
- Fix integration bugs
- Prepare for final day

---

## 📅 DAY 3 - Monday April 13 (Polish & Deploy Day)

### Morning Block (9:00 AM - 12:00 PM)

#### All Team Members
**9:00 - 10:00**: Final feature decisions
- Review P1/P2 features
- Cut features if behind schedule
- Prioritize bug fixes

**10:00 - 12:00**: Bug bash
- Test all user flows
- Fix critical bugs
- Improve error handling
- Add loading indicators

---

### Afternoon Block (12:00 PM - 2:00 PM) - FINAL PUSH

#### Joshua (Data Engine)
**12:00 - 1:00**: Data final check
- [ ] Verify all data accuracy
- [ ] Minify locations.json if needed
- [ ] Create data backup

**1:00 - 2:00**: Deployment support
- [ ] Help with build issues
- [ ] Verify data loads in production

#### Christian (Lead Vibe Coder)
**12:00 - 1:00**: GitHub Pages deployment
- [ ] Configure gh-pages package
- [ ] Set up deployment script
- [ ] Test build process
- [ ] Deploy to GitHub Pages

**1:00 - 2:00**: Final polish
- [ ] Fix deployment issues
- [ ] Update README
- [ ] Add demo instructions

#### Joe (Logic & Innovation)
**12:00 - 2:00**: Performance optimization
- [ ] Optimize filter performance
- [ ] Lazy load components
- [ ] Minimize bundle size
- [ ] Test on slow connections

#### Ryan (UX Spec & Logic Support)
**12:00 - 2:00**: Final UX review
- [ ] Test all user flows
- [ ] Fix visual bugs
- [ ] Ensure accessibility basics
- [ ] Create demo script

---

## 🚨 Risk Mitigation & Fallback Plans

### If Behind Schedule (End of Day 1)
**Cut from P1**:
- Voice search → Manual text search only
- 6 languages → Keep EN/ES only
- Impact calculator → Remove entirely

### If Behind Schedule (End of Day 2)
**Cut from P1**:
- Donor portal → Focus on Customer portal only
- Volunteer portal → Focus on Customer portal only
- Advanced filters → Keep basic filters only

### Critical Path (Minimum Viable Product)
1. Gateway page with EN/ES toggle ✅
2. Customer portal with location list ✅
3. Basic map with markers ✅
4. Dietary filters (4 minimum: Halal, Vegan, Vegetarian, No Beef) ✅
5. locations.json with 30+ locations ✅
6. GitHub Pages deployment ✅

### Feature Fallbacks

#### Voice API (P1 → P2)
- **If fails**: Replace with enhanced text search with autocomplete
- **Backup**: Keyword buttons ("Fresh Produce", "Halal", etc.)

#### Heatmap (P2)
- **If fails**: Replace with simple list sorted by insecurity index
- **Backup**: Color-coded location cards (red = high need, green = low need)

#### Impact Calculator (P2)
- **If fails**: Remove feature entirely
- **Backup**: Static impact statistics on Donor portal

#### LocalStorage Reservation (P2)
- **If fails**: Remove feature entirely
- **Backup**: "Add to favorites" with LocalStorage only

---

## 🔧 Technical Setup Commands

### Initial Setup (Already Done)
```bash
npx create-react-app nourishnet-app
cd nourishnet-app
npm install react-router-dom leaflet react-leaflet react-i18next i18next --legacy-peer-deps
npm install -D tailwindcss postcss autoprefixer --legacy-peer-deps
```

### Development
```bash
npm start  # Runs on http://localhost:3000
```

### Deployment
```bash
npm install gh-pages --save-dev
# Add to package.json:
# "homepage": "https://[username].github.io/nourishnet-app"
# "predeploy": "npm run build"
# "deploy": "gh-pages -d build"

npm run deploy
```

---

## 📊 Daily Standup Questions

### Morning (9:00 AM)
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers?

### Evening (6:00 PM)
1. What did you complete today?
2. What's your confidence level for tomorrow? (1-10)
3. What needs help?

---

## ✅ Definition of Done

### For Each Component
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive (mobile, tablet, desktop)
- [ ] No console errors
- [ ] Integrated with i18n (at least EN/ES)
- [ ] Styled with Tailwind
- [ ] Tested with real data

### For Deployment
- [ ] Builds without errors
- [ ] Deploys to GitHub Pages
- [ ] All links work
- [ ] Data loads correctly
- [ ] No broken images/assets

---

## 🎯 Success Metrics

### Minimum Success (P0 Complete)
- Gateway + Customer portal functional
- 30+ locations with filters
- Map integration working
- Deployed to GitHub Pages

### Target Success (P0 + P1 Complete)
- All 3 portals functional
- 50+ locations with full attributes
- Voice search working
- 6 languages supported

### Stretch Success (P0 + P1 + P2)
- Heatmap visualization
- Impact calculator
- LocalStorage features
- Calendar sync

---

## 📞 Emergency Contacts & Resources

### Documentation
- React Router: https://reactrouter.com
- Leaflet.js: https://leafletjs.com
- react-i18next: https://react.i18next.com
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Tailwind CSS: https://tailwindcss.com

### Troubleshooting
- If npm install fails: Use `--legacy-peer-deps` flag
- If map doesn't render: Check Leaflet CSS import
- If i18n doesn't work: Verify i18n.js initialization
- If build fails: Check for console errors first

---

**Last Updated**: Saturday April 11, 2026 - 9:00 AM PT  
**Next Review**: Saturday April 11, 2026 - 6:00 PM PT
