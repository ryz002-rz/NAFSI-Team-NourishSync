# NourishNet Pipeline Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NourishNet Pipeline Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   User       │───▶│  Language    │───▶│   i18n       │───▶│  UI Renders  │
│   Arrives    │    │  Selection   │    │  System      │    │  in Language │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  localStorage │
                    │  (persist)    │
                    └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   User       │───▶│  Voice/Text  │───▶│  Search      │───▶│  Filtered    │
│   Searches   │    │  Input (STT) │    │  Utils       │    │  Results     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                   │
                           ▼                   ▼
                    ┌──────────────┐    ┌──────────────┐
                    │  Web Speech  │    │  locations   │
                    │  API         │    │  _sample.json│
                    └──────────────┘    └──────────────┘
```

## Component Pipeline

### 1. Language Selection Pipeline

```
LanguageToggle.jsx
       │
       ├─▶ User clicks EN/ES button
       │
       ├─▶ i18n.changeLanguage(langCode)
       │       │
       │       └─▶ All useTranslation() hooks re-render
       │
       └─▶ localStorage.setItem('nourishnet_prefs', { language: langCode })
               │
               └─▶ On next visit, i18n.js reads saved preference
```

### 2. Search Pipeline (Voice + Text)

```
VoiceSearch.jsx
       │
       ├─▶ Text Input ─────────────────────────────────┐
       │                                                │
       └─▶ Voice Button                                 │
               │                                        │
               ├─▶ Web Speech API (SpeechRecognition)  │
               │       │                                │
               │       └─▶ recognition.lang = i18n.language
               │               │
               │               └─▶ Transcript returned  │
               │                                        │
               └───────────────────────────────────────▶│
                                                        │
                                                        ▼
                                              searchUtils.js
                                                        │
                                    ┌───────────────────┼───────────────────┐
                                    │                   │                   │
                                    ▼                   ▼                   ▼
                            extractDietaryTags   searchLocations   sortByRelevance
                                    │                   │                   │
                                    └───────────────────┼───────────────────┘
                                                        │
                                                        ▼
                                              Filtered Results
                                                        │
                                                        ▼
                                              LocationCard.jsx (display)
```

### 3. Routing Pipeline

```
App.js (HashRouter)
       │
       └─▶ Layout.jsx (wrapper)
               │
               ├─▶ Navbar
               │       ├─▶ Logo (links to /)
               │       ├─▶ LanguageToggle
               │       └─▶ Back to Home (hidden on /)
               │
               └─▶ Routes
                       │
                       ├─▶ / ─────────▶ Gateway.jsx
                       │                    │
                       │                    └─▶ Portal Cards
                       │                            ├─▶ /family
                       │                            ├─▶ /donor
                       │                            └─▶ /volunteer
                       │
                       ├─▶ /family ───▶ FamilyPortal.jsx
                       │                    │
                       │                    ├─▶ VoiceSearch
                       │                    └─▶ LocationCards
                       │
                       ├─▶ /donor ────▶ DonorPortal.jsx
                       │                    │
                       │                    ├─▶ VoiceSearch
                       │                    └─▶ DonorCards
                       │
                       ├─▶ /volunteer ▶ VolunteerPortal.jsx
                       │                    │
                       │                    ├─▶ VoiceSearch
                       │                    └─▶ VolunteerCards
                       │
                       └─▶ * ─────────▶ Redirect to /
```

## Data Flow

```
locations_sample.json
       │
       └─▶ Imported by Portal Pages
               │
               ├─▶ FamilyPortal: All locations
               ├─▶ DonorPortal: Filtered by donation_info
               └─▶ VolunteerPortal: Filtered by volunteer_needs
                       │
                       └─▶ User Search Query
                               │
                               └─▶ searchUtils.searchLocations()
                                       │
                                       └─▶ Filtered & Sorted Results
                                               │
                                               └─▶ Rendered as Cards
```

## File Structure

```
src/
├── components/
│   ├── christian/
│   │   ├── Gateway.jsx      # Landing page with portal cards
│   │   ├── Layout.jsx       # App wrapper with navbar
│   │   └── LanguageToggle.jsx # EN/ES language switcher
│   └── joe/
│       └── VoiceSearch.jsx  # STT search input
├── pages/
│   ├── FamilyPortal.jsx     # Find food resources
│   ├── DonorPortal.jsx      # Find donation opportunities
│   └── VolunteerPortal.jsx  # Find volunteer missions
├── utils/
│   ├── i18n.js              # i18next configuration
│   └── searchUtils.js       # Search/filter logic
├── locales/
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
├── data/
│   └── locations_sample.json # Sample location data
└── App.js                   # Root component with routing
```

## Key Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| Routing | React Router DOM v6 (HashRouter) | GitHub Pages compatible routing |
| i18n | react-i18next | Multi-language support |
| STT | Web Speech API | Voice search input |
| Styling | Tailwind CSS v3 | Utility-first CSS |
| State | React useState/useMemo | Local component state |
| Persistence | localStorage | Save user preferences |

## Future Enhancements

1. **Backend Integration**: Connect to real API for location data
2. **Geolocation**: Add "Near Me" functionality
3. **Map View**: Integrate Leaflet.js for map display
4. **More Languages**: Add ZH, FR, AM, TL support
5. **Filters UI**: Add dietary filter toggles
6. **Impact Calculator**: Track donation/volunteer impact
