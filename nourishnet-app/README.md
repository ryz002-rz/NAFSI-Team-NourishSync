# 🥦 NourishOne

**One Tool. One Community. One Mission.**

Connecting families, donors, and volunteers to food resources across metropolitan Washington, DC.

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)](https://github.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)

---

## What is NourishOne?

NourishOne is a static React web app that helps people in the DC/Maryland/Virginia region find food assistance. It aggregates **737 verified food pantry locations** into a searchable, filterable, map-driven interface with three dedicated portals:

- **Find Food** — Families search for nearby pantries by food type, dietary need, and distance
- **Donate** — Donors see wishlists and high-need areas to direct their contributions
- **Volunteer** — Volunteers find missions matching their skills and languages

Built in 72 hours for the **NourishNet Data Challenge 2026** at the University of Maryland.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/NAFSI-Team-NourishSync.git
cd NAFSI-Team-NourishSync/nourishnet-app
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is needed because some packages have peer dependency conflicts. This is safe and expected.

### 3. Start the development server

```bash
npm start
```

The app will open automatically at **http://localhost:3000**.

That's it — you're running NourishOne locally.

---

## Available Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Starts the dev server at http://localhost:3000 |
| `npm test` | Runs the test suite (includes property-based tests) |
| `npm run build` | Creates a production build in the `build/` folder |
| `npm run deploy` | Builds and deploys to GitHub Pages |

---

## Deploy to GitHub Pages

### First-time setup

1. In `package.json`, update the `homepage` field with your GitHub Pages URL:

```json
"homepage": "https://YOUR_USERNAME.github.io/NAFSI-Team-NourishSync"
```

2. Make sure `gh-pages` is installed (it should already be in devDependencies):

```bash
npm install --save-dev gh-pages --legacy-peer-deps
```

### Deploy

```bash
npm run deploy
```

This runs `npm run build` automatically, then pushes the `build/` folder to the `gh-pages` branch. Your site will be live at the URL in the `homepage` field within a few minutes.

### Verify deployment

Visit your GitHub Pages URL. If you see a blank page:
- Check that `homepage` in `package.json` matches your actual repo URL
- The app uses `HashRouter`, so routes look like `https://yoursite.github.io/repo/#/family`

---

## Project Structure

```
nourishnet-app/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── christian/       # Gateway, Layout, LanguageToggle
│   │   ├── joe/             # VoiceSearch, FilterEngine, ImpactCalculator
│   │   ├── ryan/            # MapView, LocationCard, HeatmapLayer
│   │   └── shared/          # Reusable components (Button, LocationCard)
│   ├── pages/
│   │   ├── FamilyPortal.jsx # Customer portal — find food
│   │   ├── DonorPortal.jsx  # Donor portal — give food
│   │   └── VolunteerPortal.jsx # Volunteer portal — serve
│   ├── data/
│   │   ├── locations_final_merged.json  # ⭐ Production dataset (737 locations)
│   │   ├── area_income_sources.json     # Economic context data
│   │   └── ...                          # Pipeline files (see DATA_FILES_README.md)
│   ├── locales/             # Translation files (EN, ES, ZH, FR, AM, TL)
│   ├── utils/               # Filter logic, i18n config, preferences
│   ├── App.js               # Root component with routing
│   └── index.js             # Entry point
├── FINAL_REPORT.md          # Hackathon submission report
├── README-HACKATHON.md      # 3-day implementation plan
└── package.json
```

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router 6 | Client-side routing (HashRouter for GitHub Pages) |
| Tailwind CSS 3 | Utility-first styling |
| Leaflet.js + react-leaflet | Interactive maps |
| i18next + react-i18next | Multi-language support (6 languages) |
| Web Speech API | Voice search |
| fast-check | Property-based testing |
| gh-pages | GitHub Pages deployment |

---

## Features

- **737 verified food assistance locations** across MD, DC, and VA
- **Interactive map** with colored markers and popup details
- **Smart filtering** by food type, dietary attributes, distance, and tags
- **Voice search** — speak your needs in English or Spanish
- **6 languages** — English, Spanish, Chinese, French, Amharic, Tagalog
- **Donor wishlists** — see what each pantry needs
- **Volunteer missions** — find opportunities matching your skills
- **Impact calculator** — see the environmental benefit of donations
- **Fully static** — no backend, no API keys, no cloud services required
- **100% real data** — every location traceable to a verified source

---

## Data

The production dataset (`locations_final_merged.json`) contains 737 locations with:

- Name, structured address, geocoded coordinates
- Hours, phone, website, requirements
- Food types (16 categories)
- Health/dietary attributes (7 boolean flags)
- Donor fields (wishlist, accepts perishable, drop-off hours)
- Volunteer fields (missions with skills/languages, volunteers needed)
- Full source lineage (source name, URL, extraction page)

See `src/data/DATA_FILES_README.md` for complete documentation of all data files and the pipeline.

---

## Team

| Member | Role | Key Contributions |
|--------|------|-------------------|
| **Joshua** | Data Engine | Data pipeline, scraping, geocoding, schema design, enrichment, documentation |
| **Christian** | Lead Developer | React architecture, routing, i18n, Gateway, Layout, portal integration |
| **Joe** | Logic & Innovation | Filter engine, voice search, impact calculator, preferences, property-based tests |
| **Ryan** | UX & Logic Support | Map integration, location cards, design system, responsive UI, smoke testing |

---

## Troubleshooting

**`npm install` fails with peer dependency errors**
```bash
npm install --legacy-peer-deps
```

**Map doesn't render**
Make sure Leaflet CSS is imported. Check that `src/index.js` or `src/index.css` includes:
```css
@import 'leaflet/dist/leaflet.css';
```

**Blank page after deploy**
- Verify `homepage` in `package.json` matches your GitHub Pages URL
- The app uses `HashRouter` — URLs should have `/#/` in them
- Check the browser console for 404 errors on assets

**i18n not working**
- Verify `src/utils/i18n.js` is imported in `App.js`
- Check that locale files exist in `src/locales/`

**Only seeing 58 locations instead of 737**
- Make sure all portal files import from `locations_final_merged.json`, not `locations_expanded.json`

---

## License

Built for the NourishNet Data Challenge 2026. All data sourced from public government and nonprofit websites.

---

*Built with care at the University of Maryland. April 11–13, 2026.*
