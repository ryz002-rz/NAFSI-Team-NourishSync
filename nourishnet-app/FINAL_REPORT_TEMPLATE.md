# NourishOne

**One Tool. One Community. One Mission.**

*Connecting families, donors, and volunteers to food resources across metropolitan Washington, DC*

---

**Team Members**: Joshua (Data), Christian (Lead Developer), Joe (Logic & Innovation), Ryan (UX & Logic Support)

**University**: University of Maryland

**Challenge**: NourishNet Data Challenge 2026

**Date**: April 13, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Why "NourishOne" — Our Name & Vision](#2-why-nourishone--our-name--vision)
3. [Intended Users & How NourishOne Supports Them](#3-intended-users--how-nourishone-supports-them)
4. [User Interface: Core Features & Flow](#4-user-interface-core-features--flow)
5. [Data Ingestion & Architecture](#5-data-ingestion--architecture)
6. [Additional Data Sources](#6-additional-data-sources)
7. [Prompt Engineering Experience with Kiro](#7-prompt-engineering-experience-with-kiro)
8. [Future Improvements](#8-future-improvements)
9. [Code Improvements Beyond Kiro](#9-code-improvements-beyond-kiro)

---

## 1. Executive Summary

Food distribution events are vital for connecting resources to families experiencing food insecurity — yet information about these events is scattered across social media posts, flyers, websites, and word-of-mouth. Donors don't know where help is needed most. Volunteers can't find where their skills matter.

NourishOne solves this. We built a single, unified tool that transforms fragmented community data into an accessible, multilingual platform serving three audiences: families seeking food, donors wanting to give, and volunteers ready to serve. With 737 locations across the PG County and metropolitan DC area, interactive maps, dietary health filters, voice search in 6 languages, and a food insecurity heatmap, NourishOne ensures that the people who need food resources the most can actually find and access them.

---

## 2. Why "NourishOne" — Our Name & Vision

### The Name

We chose **NourishOne** because it carries a dual meaning that captures our mission:

- **Nourish every single one** — every hungry family, every willing donor, every available volunteer. No one gets left out.
- **One stop** — one place to find food, one place to give, one place to volunteer. The fragmentation ends here.

The name is personal: nourish *one* person at a time. And it's collective: bring everyone into *one* system.

### Built for NourishNet

NourishOne was designed specifically as a response to the NourishNet challenge. The NourishNet team at the University of Maryland is building infrastructure to recover and redistribute surplus food — tools like FoodLoops for food recovery and Quantum Nose for spoilage detection. These tools handle the supply chain.

NourishOne is the **front door**. While NourishNet manages food recovery and redistribution behind the scenes, NourishOne is the community-facing layer that connects real people to those resources. We intentionally designed our tool to complement NourishNet's ecosystem:

- Our **data schema** mirrors the structure needed for future integration with NourishNet's backend systems
- Our **tri-portal architecture** (Family, Donor, Volunteer) maps directly to the three stakeholder groups identified in the challenge
- Our **insecurity index** and **heatmap visualization** address the challenge's concern about misalignment between event locations and community needs
- Our **6-language support** directly responds to the need for accessibility for non-English speakers

NourishOne isn't just a hackathon project — it's a prototype for what the community-facing layer of NourishNet could become.

---

## 3. Intended Users & How NourishOne Supports Them

### 3.1 Families Seeking Food Assistance

**The Problem**: For those who need assistance the most, finding accurate and timely information about events — location, schedule, eligibility, and transportation options — is difficult. Information is spread across dozens of disconnected websites and social media pages.

**How NourishOne Helps**:

- **737 searchable locations** across the PG County and DC metro area, all in one place
- **Dietary health filters** — families can filter by Halal, Vegan, Vegetarian, No Beef, Low Glycemic Index, Fresh Produce, and Dairy Free. This matters for families with medical dietary needs, religious requirements, or cultural preferences
- **Voice search in 6 languages** — a parent who speaks Spanish can say "halal" or "vegetales" into their phone and the right filters activate automatically. No typing, no English required
- **"Near Me" geolocation** — one tap shows the closest food locations with distance in miles and a "Get Directions" link to Google Maps
- **Interactive map** with color-coded markers and a **heatmap overlay** showing food insecurity density, so families can see where resources are concentrated
- **Full multilingual support** — English, Spanish, Chinese, French, Amharic, and Tagalog. Every label, every filter, every location card is translated

> *[INSERT SCREENSHOT: Customer Portal showing location cards with dietary badges, map view, and language selector]*

### 3.2 Donors

**The Problem**: Individuals and organizations that want to donate food or funds often lack clarity on which distribution groups are active in their area, what their needs are, and how to reach them effectively.

**How NourishOne Helps**:

- **"Sort by Need"** — locations are ranked by food insecurity index so donors can direct resources where they matter most
- **Wishlist tags** — see exactly what each location needs (canned goods, fresh produce, hygiene products)
- **"High Need Area" indicators** — locations with insecurity index ≥ 7 are flagged so donors can prioritize
- **Impact Calculator** — enter pounds of food donated and instantly see the equivalent CO₂ saved, meals provided, and water conserved. Makes the impact tangible and shareable
- **"Share Your Impact"** — copy impact stats to clipboard for social media sharing, encouraging more donations

> *[INSERT SCREENSHOT: Donor Portal showing Sort by Need, wishlist tags, and Impact Calculator]*

### 3.3 Volunteers

**The Problem**: Potential volunteers may not know which organizations are nearest to them or where their support is most urgently needed.

**How NourishOne Helps**:

- **Mission cards** — each volunteer opportunity shows the title, description, required skills, language needs, date, and how many volunteers are still needed
- **Skill and language filters** — a bilingual volunteer who speaks Spanish can filter for missions that need Spanish speakers. A volunteer with food handling experience can find missions that match
- **Map view** — see volunteer opportunities geographically to find the closest ones
- **Text search** — search across mission titles, descriptions, and organization names

> *[INSERT SCREENSHOT: Volunteer Portal showing mission cards with skill/language filters]*

---

## 4. User Interface: Core Features & Flow

Our design philosophy: **simple enough for someone with limited technical literacy, powerful enough to surface the right information fast.**

### 4.1 First Visit — Language Selection

When a user opens NourishOne for the first time, they see a full-screen language selector before anything else. This is intentional — we want every user to feel welcome in their own language from the very first interaction. The selector is searchable and shows each language in its native script with a flag icon.

The selected language persists in localStorage, so returning users go straight to the Gateway.

> *[INSERT SCREENSHOT: Full-screen language selector]*

### 4.2 Gateway — Three Clear Paths

The Gateway presents three portal cards:

| Portal | Label | Icon | Purpose |
|--------|-------|------|---------|
| **Find Food** | "I need food assistance" | 🍎 | Families seeking food locations |
| **Donate** | "I want to donate" | 🤝 | Donors looking to give food or funds |
| **Volunteer** | "I want to volunteer" | 💪 | Volunteers seeking missions |

No clutter, no login walls, no confusion. One tap and you're in.

> *[INSERT SCREENSHOT: Gateway with tri-portal cards]*

### 4.3 Customer Portal — The Core Experience

The Customer Portal is the heart of NourishOne. The user flow:

1. **Search** — Type a name, address, food type, or keyword. Results filter in real-time.
2. **Filter** — Toggle dietary health filters (7 options). Switch between AND mode ("must have ALL selected") and OR mode ("must have ANY selected"). Filters persist across sessions.
3. **Voice Search** — Tap the microphone. Speak in any of 6 supported languages. The system transcribes speech, maps keywords to filters, and activates them automatically. Visual feedback shows the transcript and which filters were activated.
4. **Locate** — Tap "Near Me" to detect location. Choose a radius (1, 5, 10, or 25 miles). Location cards show distance badges.
5. **Map** — Toggle the interactive map. Color-coded markers (green/orange/blue by type) with rich popups showing name, category, address, hours, health badges, and a "Get Directions" link. Switch to heatmap view to see food insecurity density with a 5-level urgency legend.
6. **Browse** — Scroll through location cards showing name, category, address, hours, health attribute badges (emoji + translated label), food types, phone, and website.

> *[INSERT SCREENSHOT: Customer Portal full view — search bar, filters, map, location cards]*
> *[INSERT SCREENSHOT: Heatmap view with urgency legend]*
> *[INSERT SCREENSHOT: Voice search in action with transcript feedback]*

### 4.4 Donor Portal

1. **Browse** organizations accepting donations
2. **Sort by Need** to prioritize high-insecurity areas
3. **View wishlists** to see what each location actually needs
4. **Calculate impact** using the Impact Calculator
5. **Share** impact stats to encourage others

### 4.5 Volunteer Portal

1. **Browse** available missions
2. **Filter** by required skills and languages
3. **Search** across mission details
4. **Map** to find nearby opportunities
5. **View** volunteer counts needed per mission

### 4.6 Accessibility & Inclusivity

- **6 languages**: English, Spanish, Chinese, French, Amharic, Tagalog — covering the major language communities in the DC metro area
- **Voice search**: Removes the typing barrier for users with limited literacy or physical disabilities
- **Emoji health badges**: Visual indicators that transcend language
- **Simple card layout**: No nested menus, no complex navigation. Every feature is 1-2 taps away
- **Persistent preferences**: The app remembers your language, dietary filters, and search — no re-entering information on every visit

---

## 5. Data Ingestion & Architecture

### 5.1 Data Pipeline

```
CSV Data Sources (provided + supplemental)
        │
        ▼
Python Processing Script (build_locations.py)
        │
        ├── Parse CSV records
        ├── Geocode addresses → lat/lng coordinates
        ├── Validate coordinates (PG County bounds check)
        ├── Enrich with health attributes (7 boolean flags)
        ├── Calculate food insecurity index per location
        ├── Merge and deduplicate
        └── Track source/lineage per record
        │
        ▼
locations.json (737 validated locations)
        │
        ▼
React SPA (client-side, no backend)
```

### 5.2 Data Schema

Each location in our dataset follows this structure:

```json
{
  "id": "loc-001",
  "name": "Capital Area Food Bank - Distribution Center",
  "address": "123 Main St, Hyattsville, MD 20781",
  "lat": 38.9529,
  "lng": -76.9452,
  "hours": "Monday-Friday 9AM-5PM",
  "requirements": ["Photo ID", "Proof of address"],
  "foodTypes": ["Canned goods", "Fresh produce", "Dairy"],
  "halal": false,
  "vegan": true,
  "vegetarian": true,
  "noBeef": false,
  "lowGI": true,
  "freshProduce": true,
  "dairyFree": false,
  "insecurityIndex": 7.2,
  "type": "customer",
  "phone": "(301) 555-0100",
  "website": "https://example.org",
  "source": "Capital Area Food Bank CSV",
  "wishlist": ["Canned vegetables", "Rice", "Cooking oil"],
  "acceptsPerishable": true,
  "dropOffHours": "Mon-Fri 8AM-4PM",
  "missions": [],
  "volunteersNeeded": 0
}
```

### 5.3 Application Architecture

```
┌─────────────────────────────────────────────┐
│              GitHub Pages (Static Host)       │
├─────────────────────────────────────────────┤
│  React SPA (Create React App)                │
│  ├── HashRouter (client-side routing)        │
│  ├── react-i18next (6 languages)             │
│  ├── Leaflet + OpenStreetMap (maps)          │
│  ├── Web Speech API (voice search)           │
│  ├── Tailwind CSS (design system)            │
│  └── localStorage (user preferences)         │
├─────────────────────────────────────────────┤
│  Static Data Layer                           │
│  ├── locations.json (737 records)            │
│  └── locales/*.json (6 translation files)    │
└─────────────────────────────────────────────┘
```

**Key architectural decisions**:

- **No backend required** — all data is bundled as static JSON, making deployment simple and the app fast
- **HashRouter** instead of BrowserRouter for GitHub Pages compatibility
- **localStorage** for preference persistence — no accounts, no login, no friction
- **All open-source tools and libraries** — React, Leaflet, i18next, Tailwind, Web Speech API

---

## 6. Additional Data Sources

Beyond the provided CSV of DC-area food bank websites, we incorporated:

- **Capital Area Food Bank Emergency Food Provider dataset** — the primary source for location records, addresses, hours, and service details
- **Scraped food bank location data** — supplemental locations gathered from community organization websites
- **Area income source data** — used to calculate the food insecurity index for each location, enabling the heatmap visualization and "Sort by Need" functionality

All data processing is documented in `DATA_DICTIONARY.md` and `DATA_FILES_README.md` within the repository.

---

## 7. Prompt Engineering Experience with Kiro

### 7.1 Our Approach

We used Kiro's **spec-driven development** workflow throughout the hackathon. Rather than writing code directly, we:

1. Created **steering files** that gave Kiro persistent context about our tech stack, project structure, and product vision
2. Used Kiro's **spec workflow** (Requirements → Design → Tasks) to break complex features into structured, implementable plans
3. Iterated on prompts when initial outputs needed refinement

### 7.2 Steering Files — Setting the Foundation

We created three steering files that Kiro referenced throughout development:

- **`tech.md`** — Defined our exact tech stack (React 19, Tailwind 4, Leaflet, i18next, Web Speech API) and common commands
- **`structure.md`** — Defined our file organization, including the developer-ownership folder structure that prevented merge conflicts
- **`product.md`** — Defined NourishOne's core features, target users, and deployment target

These steering files meant every prompt Kiro processed had the right context. We didn't have to repeat "use Tailwind" or "we're deploying to GitHub Pages" in every prompt.

### 7.3 Example: Heatmap Visualization

One of our most complex features was the food insecurity heatmap. Here's how we built it with Kiro:

**Spec workflow**:
- **Requirements**: We described the need for a visual overlay showing food insecurity density on the map, with color coding from green (low need) to red (critical need)
- **Design**: Kiro produced a technical design using Leaflet circle overlays with radius and color based on insecurity index values
- **Tasks**: Kiro broke this into implementable subtasks — data preparation, circle rendering, legend component, toggle between markers and heatmap

**What worked**: The spec workflow forced us to think through the feature before writing code. The generated tasks were specific enough to implement directly.

**What needed iteration**: [YOUR HONEST EXPERIENCE HERE — e.g., "The initial heatmap colors were too similar to distinguish. We refined the prompt to specify exact hex values for each urgency level."]

### 7.4 Example: Multi-Language Voice Search

[DESCRIBE YOUR PROMPT ENGINEERING EXPERIENCE FOR VOICE SEARCH]

- What prompts you used
- How Kiro handled the Web Speech API integration
- What worked on the first try vs. what needed refinement

### 7.5 Example: [THIRD FEATURE]

[DESCRIBE ANOTHER KEY PROMPT ENGINEERING EXPERIENCE]

### 7.6 Lessons Learned

- [WHAT WORKED WELL WITH KIRO]
- [WHAT WAS CHALLENGING]
- [HOW YOU ADAPTED YOUR PROMPTING STRATEGY]

---

## 8. Future Improvements

NourishOne is a working prototype. Here's where we'd take it next:

### Real-Time Data Ingestion
The original challenge asks: "Can you take unstructured data and build a system capable of ingesting and processing data in real time as websites are updated?" Our current dataset is static JSON. The next step is building a scraping and NLP pipeline that monitors community websites and automatically updates location data — hours changes, new events, closed locations.

### Event Calendar
A calendar view showing upcoming food distribution events, sorted by date and filterable by location. With real-time ingestion, this becomes a live schedule.

### Expanded Geography
Our current dataset covers PG County. Expanding to all of metropolitan DC, Maryland, and Northern Virginia would serve the full challenge area.

### Reservation System
Allow families to reserve a pickup slot at a food distribution event, reducing wait times and helping organizers plan.

### Volunteer Mission Sign-Up
Full sign-up flow with confirmation, calendar sync (Google/Apple), and reminder notifications.

### Community Features
- Donor rankings and gamification to encourage repeat donations
- Community reviews and ratings for food locations
- Weekly email/SMS reminders for regular distribution events

### Demographic Alignment
Personalized recommendations based on household size, age, and gender — matching families to locations that serve their specific demographic needs.

---

## 9. Code Improvements Beyond Kiro

[IF YOU MADE MANUAL CHANGES TO KIRO'S OUTPUT, DESCRIBE THEM HERE]

Example areas to discuss:
- UI/UX refinements that required manual CSS tweaking
- Data processing scripts that were written outside of Kiro
- Bug fixes or edge cases that needed human judgment
- Performance optimizations

[IF MINIMAL CHANGES WERE MADE]:
The majority of NourishOne's codebase was generated through Kiro's spec-driven workflow. Our manual interventions were primarily [describe: data enrichment, minor styling adjustments, etc.].

---

## Appendix

### A. Tech Stack Summary

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.5 | UI framework |
| React Router DOM | 6.30.3 | Client-side routing |
| Tailwind CSS | 4.2.2 | Styling |
| Leaflet | 1.9.4 | Map visualization |
| react-i18next | 17.0.2 | Internationalization |
| Web Speech API | Native | Voice search |
| GitHub Pages | — | Deployment |

### B. Team Contributions

| Member | Role | Key Contributions |
|--------|------|-------------------|
| Joshua | Data Engine | Data extraction, schema design, 737-location dataset, insecurity index calculation |
| Christian | Lead Developer | Project architecture, routing, i18n system, Gateway, portal pages, deployment |
| Joe | Logic & Innovation | Voice search, filter engine, impact calculator, keyword mapping |
| Ryan | UX & Logic Support | Map visualization, location cards, design system, heatmap, UI polish |

### C. Repository Structure

```
nourishnet-app/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── christian/       # Gateway, LanguageToggle, Layout
│   │   ├── joe/             # VoiceSearch, FilterEngine, ImpactCalculator
│   │   ├── ryan/            # MapView, HeatmapLayer, Legend, LocationCard
│   │   └── shared/          # Reusable components
│   ├── data/                # locations.json (737 records)
│   ├── locales/             # Translation files (6 languages)
│   ├── utils/               # filterUtils.js, i18n.js
│   └── App.js               # Main app with routing
├── .kiro/                   # Kiro specs and steering files
└── package.json
```

---

*NourishOne — because no one should go hungry when help exists. They just need to find it.*
