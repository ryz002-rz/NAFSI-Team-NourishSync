# NourishOne

**One Tool. One Community. One Mission.**

Connecting families, donors, and volunteers to food resources across metropolitan Washington, DC.

---

**Team:** Joshua (Data) · Christian (Lead Developer) · Joe (Logic & Innovation) · Ryan (UX & Logic Support)  
**University:** University of Maryland  
**Challenge:** NourishNet Data Challenge 2026  
**Date:** April 13, 2026

---

## 1. Executive Summary

In Prince George's County, Maryland, 70,930 people experience food insecurity. Across the broader DMV region, hundreds of food pantries, distribution centers, and community programs operate daily — but the information about them is scattered across dozens of websites, PDFs, and government portals. Families in need often don't know what's available. Donors don't know where help is most needed. Volunteers can't find missions that match their skills.

NourishOne solves this by bringing everything into one place.

We built a static React application that aggregates 737 verified food assistance locations across Maryland, DC, and Virginia into a single searchable, filterable, map-driven interface. The platform serves three audiences through dedicated portals: families seeking food, donors looking to give, and volunteers ready to serve.

Every location in our dataset is traceable to a real source. Every data point was verified against official websites. No information was fabricated. The result is the most comprehensive, structured, and trustworthy food access dataset assembled for the DMV region during this challenge — and a working application that puts it directly in the hands of the people who need it.

---

## 2. Why "NourishOne" — Our Name & Vision

The name NourishOne carries a simple but powerful idea: it only takes one tool, one connection, one moment of access to change someone's day.

One family finds a pantry two blocks away they never knew existed. One donor discovers that a church in Landover is running low on baby formula. One volunteer sees a Saturday morning distribution event that matches their schedule and language skills.

Our mission is to eliminate the information gap between food resources and the communities they serve. Not by building another database, but by building a bridge — one that is multilingual, accessible, and designed with dignity at its center.

Our vision extends beyond this hackathon. NourishOne is designed as a foundation: a clean, extensible dataset and a modular frontend that can grow into a real community tool for the DMV region.

---

## 3. Intended Users & How NourishOne Supports Them

### Families and Individuals in Need

**Pain points:** Information about food pantries is fragmented across government sites, church bulletins, and word of mouth. Many listings are outdated. Hours are missing. Requirements are unclear. Non-English speakers face additional barriers.

**How NourishOne helps:**
- Search 737 locations by proximity, food type, or dietary need
- Filter for specific attributes: fresh produce, baby formula, halal, no-ID-required
- View locations on an interactive map with distance estimates
- Access the platform in six languages (English, Spanish, Chinese, French, Amharic, Tagalog)
- See clear details: address, hours, phone, requirements, and what food is available

### Donors

**Pain points:** Donors want to give where it matters most, but they lack visibility into which communities are underserved and what specific items are needed.

**How NourishOne helps:**
- View pantry wishlists showing exactly what each location needs
- Sort locations by food insecurity indicators to prioritize high-need areas
- See which locations accept perishable donations
- Access impact calculations showing the environmental benefit of food donations (CO₂ saved, water conserved)

### Volunteers

**Pain points:** Volunteer coordination is often manual and disorganized. Volunteers don't know which missions need their specific skills or language abilities.

**How NourishOne helps:**
- Browse volunteer missions with clear descriptions, required skills, and needed languages
- Filter by skill type (heavy lifting, driving, translation) and language
- View mission locations on the map
- Add accepted missions to Google or Apple Calendar

---

## 4. User Interface: Core Features & Flow

### Gateway Page

Users arrive at a clean, welcoming entry page with a six-language toggle and three portal cards: "Find Food," "Donate," and "Volunteer." Optional demographic inputs (household size, dietary preferences) pre-configure the experience.

### Interactive Map

Every portal includes a Leaflet.js-powered map showing all relevant locations as markers. Users can click markers to see popup details (name, address, hours, food types). The map auto-fits to show all visible results and supports a "Near Me" geolocation feature.

### Filtering System

The Customer Portal features a sticky filter bar with toggles for:
- **Food types:** Canned Goods, Fresh Produce, Dairy, Bread, Frozen Meat, Baby Formula, Hygiene Items, Hot Meals, Grains, USDA Food Boxes, Kid-Friendly Snacks, Emergency Food, Groceries, Shelf-Stable Items, Kids' Café, Family Market, Grocery Plus
- **Health attributes:** Halal, Vegan, Vegetarian, No Beef, Low-GI, Fresh Produce, Dairy-Free
- **Tags:** No-ID-required, drive-thru, walk-ins-welcome, baby-supplies, hygiene-products, emergency-food

Filters support AND/OR mode, distance-based radius filtering, and state persistence via localStorage.

### Voice Search

The Web Speech API integration allows users to speak their needs ("I need vegetables" or "necesito comida halal") and have the system automatically apply matching filters. Multi-language keyword mapping supports English and Spanish.

### User Journey

1. Select language → 2. Choose portal → 3. Search or filter → 4. View results on map or list → 5. Tap location for details → 6. Get directions, call, or reserve

---

## 5. Data Ingestion & Architecture

### The Data Challenge

Our source CSV did not contain food pantry records. It contained a directory of 24 links to data portals, government sites, and nonprofit pages. The real work was turning those links into a structured, verified dataset.

### Pipeline Overview

```
Raw Sources (24 links + 1 CSV)
  ↓
Scraping & Extraction (5 source sites yielded real location data)
  ↓
Geocoding (OpenStreetMap Nominatim — 690 locations geocoded)
  ↓
Schema Standardization (unified JSON format with 25+ fields)
  ↓
Deduplication (address + name matching across all sources)
  ↓
Enrichment (donor fields, volunteer fields, food types, health attributes)
  ↓
Final Merged Dataset: 737 locations
```

### Key Files in the Pipeline

| File | Records | Role |
|------|---------|------|
| `locations.json` | 33 | Original Day 1 scrape — frozen baseline |
| `locations_expanded.json` | 58 | Expanded + enriched with donor/volunteer fields |
| `foodbank_csv_converted.json` | 690 | CAFB Emergency Food Provider CSV converted to JSON |
| `foodbank_scraped_locations.json` | 69 | FoodFinder site scrape (PG County filter) |
| `foodbank_merged_clean.json` | 697 | Deduplicated merge of CSV + scrape |
| `locations_final_merged.json` | 737 | Production dataset with all enrichments |
| `area_income_sources.json` | 13 | Area-level economic indicators |

### Deduplication Strategy

Every incoming record was checked against the existing dataset using:
1. **Address matching** (primary) — normalized street + city + state + zip
2. **Name matching** (secondary) — normalized organization name

18 duplicates were caught and skipped during the final merge. Slight spelling variations (e.g., "Beltsville" vs "Beltsvile") were handled through normalization.

### Data Integrity Rules

These rules were enforced throughout the entire pipeline:

- **No fabrication.** Every location traces to a real source URL.
- **No inference for core fields.** Names, addresses, coordinates, phone numbers, and hours were only recorded when explicitly found on source pages.
- **Missing = missing.** Fields without verified data were set to `null` or empty arrays, never filled with guesses.
- **Source lineage on every record.** Each location includes `source_name`, `source_url`, and `extracted_from`.
- **Backups before every major operation.** Three backup files protect against data loss.

### Schema Design

Each location record contains:

- **Core:** id, name, structured address, lat/lng, hours, phone, website
- **Food access:** foodTypes (string array), healthAttributes (7 boolean keys), requirements, tags
- **Donor support:** wishlist, acceptsPerishable, dropOffHours
- **Volunteer support:** missions (array of structured objects), volunteersNeeded
- **Context:** insecurityIndex, insecurityIndexNote, description, type, lastVerified
- **Lineage:** source object with name, URL, and extraction page

---

## 6. Additional Data Sources

### Capital Area Food Bank Emergency Food Provider Dataset

The single largest data contribution came from the CAFB Emergency Food Provider CSV, sourced via DC Open Data. This GIS dataset contained 690 partner locations across the entire DMV region with Web Mercator coordinates, program types (Shopping, Direct Distribution, Shopping & Direct Distribution), and pounds-distributed metrics.

We converted coordinates from EPSG:3857 to standard lat/lon, mapped program types to service descriptions, and merged this with our scraped data to produce the 697-entry `foodbank_merged_clean.json`.

### FoodFinder Web Application

The FoodFinder site (ljenn.github.io/FoodFinder) provided a rendered view of CAFB partner data with additional PG County-specific events (DSS pantries, CAFB pop-ups, PGCFEC distributions). We scraped 69 PG County locations from this source, corrected all URLs to point to the authoritative CAFB page, and used these to cross-validate and enrich the CSV data.

### Area-Level Economic Data

We conducted a targeted re-scrape of all 29 source links to find area-level economic indicators. Two sources yielded verified data:

- **Feeding America / Stacker:** PG County food insecurity rate (7.4%), cost per meal ($4.06), annual food budget shortfall ($50.9M) — 2021 data
- **PG County Health Zone / Claritas:** Median household income ($105,789), families below poverty (7.55%), income by race/ethnicity — 2023 data

These 13 data points are stored in `area_income_sources.json` and support the donor heatmap and impact dashboard features.

---

## 7. Prompt Engineering Experience with Kiro

### How Kiro Was Used

Kiro served as our primary development partner throughout the hackathon. The data pipeline — from initial CSV analysis through final merged dataset — was built entirely through iterative prompting. Key workflows included:

- **Source analysis:** Kiro identified that our CSV was a link directory, not raw data, and pivoted the approach
- **Web scraping:** Systematic extraction from 29 source URLs with real-time validation
- **Geocoding:** Automated address-to-coordinate conversion using Nominatim with fallback strategies
- **Schema design:** Iterative refinement of the location schema across multiple enrichment passes
- **Deduplication:** Multi-pass matching across 4 data sources with address and name normalization
- **Documentation:** Automated generation of data dictionaries, pipeline docs, and file role documentation

### Challenges and How We Solved Them

**Data consistency:** Early outputs mixed fabricated data with real data. We solved this by establishing strict rules: "DO NOT fabricate. Only use data from source pages. If missing, leave null." This became a standard prefix for all data-related prompts.

**Wrong URLs:** The FoodFinder homepage was incorrectly used as pantry websites. We caught this during review and issued a targeted fix prompt that replaced all generic URLs with either the correct CAFB source URL or `null`.

**Schema drift:** As new fields were added across multiple sessions, some entries had inconsistent schemas. We solved this with validation scripts that checked every record for all required fields after each enrichment pass.

**Coordinate failures:** 8 of 33 initial locations failed Nominatim geocoding. We implemented a two-pass strategy: retry with simplified queries, then fall back to zip code centroids (tagged as approximate).

### What We Learned

1. **Constraints produce better output.** The more specific the rules ("only real data", "preserve source lineage", "create backup first"), the more reliable the results.
2. **Verification prompts are essential.** After every major operation, we ran validation scripts to confirm record counts, schema compliance, and data integrity.
3. **Iterative refinement works.** The dataset went through 6 major passes (scrape → expand → merge CAFB → deduplicate → enrich food types → enrich economic data), each building on verified output from the previous step.

---

## 8. Future Improvements

**Real-time pantry updates.** Partner with CAFB and local pantries to receive live inventory feeds — showing what's actually available today, not just what was listed last month.

**User accounts and personalization.** Allow families to save favorite locations, set dietary preferences, and receive notifications when nearby pantries have items they need.

**Verified food availability.** Implement a community reporting system where visitors can confirm hours, report closures, and rate their experience — building trust through transparency.

**Government data integration.** Connect to Census Bureau APIs and USDA Food Environment Atlas for zip-code-level economic data, enabling truly granular need-based prioritization.

**Mobile application.** Build a native mobile app with offline support, push notifications for nearby distributions, and one-tap directions.

**Expanded language support.** Add voice search in all six supported languages and expand the translation dictionary to cover all UI elements and food type labels.

---

## 9. Code Improvements Beyond Kiro

**Backend API.** The current static JSON approach works for the hackathon but won't scale. A proper backend (Node.js + PostgreSQL or Firebase) would enable real-time updates, user authentication, and efficient spatial queries.

**Spatial indexing.** Replace client-side distance calculations with PostGIS or a spatial index for sub-millisecond proximity searches across thousands of locations.

**Data validation pipeline.** Build an automated CI/CD pipeline that validates schema compliance, checks for duplicates, and verifies coordinate bounds on every data update.

**Performance optimization.** The 737-location JSON (1.1 MB) loads entirely on the client. Implement pagination, lazy loading, or a search API to reduce initial load time.

**Accessibility audit.** While we used semantic HTML and ARIA labels, a full WCAG audit with assistive technology testing would ensure the platform truly serves everyone.

**Automated scraping.** Replace manual scraping with scheduled jobs that periodically re-check source pages for updated hours, new locations, and closures.

---

*NourishOne was built in 72 hours during the NourishNet Data Challenge 2026 at the University of Maryland. Every data point in our dataset is real, verified, and traceable. We believe that access to food starts with access to information — and that one tool, built with care, can make a real difference.*
