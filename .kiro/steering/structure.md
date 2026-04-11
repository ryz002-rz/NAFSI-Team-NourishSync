# Project Structure

## Root Organization

```
nourishnet-app/          # Main application directory
├── public/              # Static assets
├── src/                 # Source code
└── node_modules/        # Dependencies
```

## Source Code Structure

### Component Organization

Components are organized by developer ownership to prevent merge conflicts during collaborative development:

```
src/
├── components/
│   ├── christian/       # Lead developer components (Gateway, LanguageToggle, Layout)
│   ├── joe/            # Logic components (VoiceSearch, FilterEngine, ImpactCalculator)
│   ├── ryan/           # UX components (MapView, LocationCard, DietaryFilters)
│   └── shared/         # Shared/reusable components (Button, etc.)
├── pages/              # Top-level page components
│   ├── CustomerPortal.jsx
│   ├── DonorPortal.jsx
│   └── VolunteerPortal.jsx
├── data/               # Static data files
│   └── locations.json  # Location data with health attributes
├── locales/            # i18n translation files
│   ├── en.json
│   ├── es.json
│   ├── zh.json
│   ├── fr.json
│   ├── am.json
│   └── tl.json
├── utils/              # Utility functions
│   ├── filterUtils.js  # Filter logic
│   └── i18n.js         # i18n configuration
├── App.jsx             # Main app component with routing
└── index.js            # Application entry point
```

## Key Conventions

### File Naming
- React components: PascalCase with `.jsx` extension (e.g., `CustomerPortal.jsx`)
- Utilities: camelCase with `.js` extension (e.g., `filterUtils.js`)
- Data files: lowercase with `.json` extension (e.g., `locations.json`)

### Component Ownership
- Keep components in designated developer folders during active development
- Move to `shared/` only when component is stable and reusable
- This structure minimizes merge conflicts in team environments

### Data Schema
Location data in `locations.json` follows this structure:
- Basic info: id, name, address, lat, lng, hours, requirements
- Food types and health attributes (halal, vegan, vegetarian, noBeef, lowGI, freshProduce, dairyFree)
- Insecurity index for prioritization
- Type classification (customer/donor/volunteer)

### Routing
- React Router handles client-side navigation
- Routes defined in `App.jsx`
- Three main portals: Customer, Donor, Volunteer

### Internationalization
- Translation files in `locales/` directory
- i18n configuration in `utils/i18n.js`
- Support for 6 languages: EN, ES, ZH, FR, AM, TL
