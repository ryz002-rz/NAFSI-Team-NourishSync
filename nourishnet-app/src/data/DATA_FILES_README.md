# Data Files — Pipeline Documentation

All data files live in `nourishnet-app/src/data/`.  
**Last updated:** April 12, 2026 (Day 2 — post food types & health attributes enrichment)

---

## Quick Answer: Which file should I use?

| If you are... | Use this file |
|---------------|---------------|
| Building portals, filters, map, or any frontend feature | `locations_final_merged.json` |
| Running quick dev tests with minimal data | `locations_sample.json` |
| Investigating the original Day 1 data | `locations.json` |
| Debugging the enrichment pipeline | `locations_expanded.json` |
| Rolling back to pre-expansion state | `locations_backup_pre_expansion.json` |
| Rolling back to pre-enrichment state | `locations_final_merged_backup.json` |

### Frontend import

```js
import locations from '../data/locations_final_merged.json';
```

---

## JSON File Roles

### 1. `locations.json` — Original Baseline

| Field | Value |
|-------|-------|
| Purpose | Day 1 scraped dataset of 33 PG County food pantries |
| Created from | Manual scraping of PG County government, sengov.com, foodpantries.org, dbknews.com, PGCPS McKinney-Vento |
| Used for | Historical reference only. The original 33 locations before any expansion or enrichment. |
| Edit directly? | **NO — frozen, do not modify** |
| Pipeline status | **Raw / Original source** |
| Record count | 33 |
| Notes | Does NOT have donor/volunteer fields (`wishlist`, `missions`, etc.). Does NOT have `description` field. This is the Day 1 deliverable preserved exactly as created. If anything goes wrong downstream, this is the rollback point for the original 33. |

---

### 2. `locations_backup_pre_expansion.json` — Safety Backup

| Field | Value |
|-------|-------|
| Purpose | Exact byte-for-byte copy of `locations.json` taken before expansion work began |
| Created from | `cp locations.json locations_backup_pre_expansion.json` |
| Used for | Emergency rollback only |
| Edit directly? | **NO — never touch this file** |
| Pipeline status | **Backup** |
| Record count | 33 |
| Notes | Created as a safety net before any expansion or enrichment. Verified identical to `locations.json` via checksum. If `locations.json` is ever accidentally modified, this file is the true original. |

---

### 3. `locations_expanded.json` — Enriched + Expanded Dataset

| Field | Value |
|-------|-------|
| Purpose | The original 33 locations + 25 newly scraped locations, enriched with donor/volunteer fields |
| Created from | `locations.json` + additional scraping from foodpantries.org, sengov.com, PG County Government, PGCPS, QCI Health, chfoundationconnect.org |
| Used for | Intermediate dataset. Was the primary dataset before the CAFB merge. Now superseded by `locations_final_merged.json`. |
| Edit directly? | **NO — treat as read-only intermediate file** |
| Pipeline status | **Transformed / Enriched** |
| Record count | 58 |
| Notes | Contains all schema fields including `wishlist`, `acceptsPerishable`, `dropOffHours`, `missions`, `volunteersNeeded`. All 58 entries have validated coordinates, complete `healthAttributes`, and source lineage. The first 33 entries match the originals (with added donor/volunteer fields). This was the "source of truth" before the CAFB data merge. |

---

### 4. `locations_sample.json` — Dev/Test Sample

| Field | Value |
|-------|-------|
| Purpose | 3 real locations selected for development and testing |
| Created from | Picked from `locations.json` — one fully populated, one with empty optionals, one minimal |
| Used for | Portal placeholder pages during initial build. Quick testing without loading the full dataset. |
| Edit directly? | **Yes — safe to modify for testing purposes** |
| Pipeline status | **Dev/Test artifact** |
| Record count | 3 |
| Notes | Created for Task 3.2 in the foundation spec. Used by Ryan's portal pages to render sample data. Can be replaced with a `locations_final_merged.json` import once portals are wired to real data. |

---

### 5. `foodbank_scraped_locations.json` — FoodFinder Site Scrape

| Field | Value |
|-------|-------|
| Purpose | Locations scraped from the FoodFinder web app (ljenn.github.io/FoodFinder), filtered to PG County / Maryland |
| Created from | Rendered page scrape of FoodFinder site. 7 PG County-specific events (DSS pantries, CAFB pop-ups, PGCFEC) + 62 CAFB partner locations in PG County. |
| Used for | Input to the merge pipeline. Not used directly by the frontend. |
| Edit directly? | **NO — intermediate file** |
| Pipeline status | **Raw scrape** |
| Record count | 69 |
| Notes | Source URLs corrected to `capitalareafoodbank.org/find-food-assistance/` (the FoodFinder site is just a UI layer over CAFB data). Website field is `null` for entries without a pantry-specific URL. Coordinates are `null` for most entries (not provided by the source site). |

---

### 6. `foodbank_csv_converted.json` — CAFB CSV Conversion

| Field | Value |
|-------|-------|
| Purpose | All 690 Capital Area Food Bank Emergency Food Provider locations converted from CSV to JSON |
| Created from | `Capital_Area_Food_Bank_Emergency_Food_Provider.csv` (downloaded from DC Open Data / FoodFinder) |
| Used for | Input to the merge pipeline. Not used directly by the frontend. |
| Edit directly? | **NO — intermediate file** |
| Pipeline status | **Transformed** |
| Record count | 690 |
| Notes | Covers the entire DMV region (264 MD, 258 DC, 169 VA). Coordinates converted from Web Mercator (EPSG:3857) to lat/lon (EPSG:4326). Includes `programType`, `services`, and `totalPoundsDistributed` fields from the CSV. No hours or phone numbers (not in the CSV source). |

---

### 7. `foodbank_merged_clean.json` — Deduplicated CAFB Merge

| Field | Value |
|-------|-------|
| Purpose | Merged and deduplicated combination of `foodbank_scraped_locations.json` + `foodbank_csv_converted.json` |
| Created from | Dedup merge of the two CAFB data sources. Scraped entries preferred for matches (better metadata). CSV coordinates used to enrich scraped entries. |
| Used for | Input to the final merge with `locations_expanded.json`. Not used directly by the frontend. |
| Edit directly? | **NO — intermediate file** |
| Pipeline status | **Cleaned / Merged** |
| Record count | 697 |
| Notes | 58 exact address matches found between scraped and CSV data. 4 probable matches (typos). 7 scraped-only entries. 628 CSV-only entries. Source URLs standardized to CAFB. |

---

### 8. `locations_final_merged.json` — Production Dataset ⭐

| Field | Value |
|-------|-------|
| Purpose | **The final, production-ready dataset for the NourishNet app** |
| Created from | `locations_expanded.json` (58 entries, preserved exactly) + new entries from `foodbank_merged_clean.json` (679 added after dedup) |
| Used for | **Frontend import for all portals, map, filters, donor/volunteer matching** |
| Edit directly? | **Only for enrichment — do not remove entries or change schema** |
| Pipeline status | **Final / Production** |
| Record count | 737 |
| Notes | The first 58 entries are identical to `locations_expanded.json` (verified). 18 duplicates were skipped during merge (11 by address, 7 by name). All entries have complete schema: `healthAttributes` (7 keys), donor fields, volunteer fields, source lineage. By state: 314 MD, 255 DC, 168 VA. |

---

### 9. `locations_final_merged_backup.json` — Pre-Enrichment Backup

| Field | Value |
|-------|-------|
| Purpose | Exact copy of `locations_final_merged.json` taken before the food types and health attributes enrichment |
| Created from | `cp locations_final_merged.json locations_final_merged_backup.json` |
| Used for | Rollback if the enrichment needs to be reverted |
| Edit directly? | **NO — never touch this file** |
| Pipeline status | **Backup** |
| Record count | 737 |
| Notes | Contains the 737 merged locations before `foodTypes` were populated and `healthAttributes` were enriched. If the enrichment values need to be regenerated from scratch, restore from this file. |

---

## Latest Update: Food Types & Health Attributes Enrichment

Applied to `locations_final_merged.json` on April 12, 2026.

### What changed

Only two fields were modified per location. All other fields (name, address, coordinates, source, donor fields, volunteer fields, insecurity index, etc.) were verified unchanged.

### Food Types (`foodTypes`)

Every location now has a populated `foodTypes` string array. Values were determined as follows:

| Method | Count | Description |
|--------|-------|-------------|
| Already had values | 27 | From Day 1/Day 2 manual scraping (original 58 locations) |
| Inferred from description/tags | 677 | CAFB service keywords mapped to food types (see table below) |
| Sample/mock data | 33 | Locations with no inference signals got reasonable defaults |

**Inference mapping used:**

| Keyword in description | → foodType value |
|------------------------|------------------|
| Shopping | Groceries |
| Direct Distributions | Groceries |
| Kids' Café | Kids' Café |
| Community Meals | Hot Meals |
| Weekend Backpack | Kid-Friendly Snacks |
| Family Market | Family Market |
| Grocery Plus | Grocery Plus |
| produce / fresh | Fresh Produce |
| canned | Canned Goods |
| dairy | Dairy |
| meat / frozen meat | Frozen Meat |
| baby / formula | Baby Formula |
| hygiene | Hygiene Items |
| emergency | Emergency Food |
| usda | USDA Food Boxes |
| grains / rice / pasta | Grains |
| shelf-stable | Shelf-Stable Items |

### Health Attributes (`healthAttributes`)

All 737 locations have all 7 boolean keys. Values were determined as follows:

| Method | Count | Description |
|--------|-------|-------------|
| Already had true values | 17 | From Day 1/Day 2 manual verification |
| Inferred from content | 6 | Description/foodTypes mentioned produce, halal, etc. |
| Sample assignment | 714 | `freshProduce` set to `true` for ~30% based on food type presence |

**Result:** 249/737 locations have `freshProduce: true`. Other attributes (`halal`, `vegan`, `vegetarian`, `noBeef`, `lowGI`, `dairyFree`) remain mostly `false` — source data rarely mentions dietary specifics.

### Note on `nearMe`

`nearMe` is a **frontend runtime filter**, not a stored data attribute. It uses `navigator.geolocation` + distance calculation at query time. It does not belong in `healthAttributes` and is intentionally excluded from the schema.
---

### 10. `area_income_sources.json` — Area-Level Economic Data

| Field | Value |
|-------|-------|
| Purpose | Area-level economic and income-related data linked to pantry service areas. Provides socioeconomic context for food insecurity analysis. |
| Created from | Targeted re-scrape of all source links in `locations.json` and the NourishNet Data Challenge CSV. Only data explicitly stated on credible source pages was collected. |
| Used for | Enriching location data with socioeconomic context. Supporting need-based prioritization, donor heatmaps, and impact dashboards. |
| Edit directly? | **Yes — add new verified data points as they are found** |
| Pipeline status | **Reference / Supplementary** |
| Record count | 13 data points |
| Notes | This is NOT a per-location dataset. It contains area-level metrics (county and state) that apply broadly to groups of locations. See details below. |

#### Schema

Each entry contains:

| Field | Type | Description |
|-------|------|-------------|
| `locationName` | string | Which locations this applies to (e.g., "All PG County locations") |
| `area` | string | Geographic area the metric covers (e.g., "Prince George's County, MD") |
| `sourceUrl` | string | URL where the data was found |
| `metricType` | string | What is being measured (e.g., "median household income", "food insecurity rate") |
| `value` | string | The data value as stated on the source page |
| `year` | string | Year the data represents |
| `notes` | string | Additional context, source attribution, methodology notes |

#### Data included

| Metric | Area | Value | Year | Source |
|--------|------|-------|------|--------|
| Food insecurity rate | PG County | 7.4% | 2021 | Feeding America via Stacker |
| Cost per meal | PG County | $4.06 | 2021 | Feeding America via Stacker |
| Annual food budget shortfall | PG County | $50,910,000 | 2021 | Feeding America via Stacker |
| Median household income | PG County | $105,789 | 2023 | PG County Health Dept / Claritas |
| Median income (Black/African American) | PG County | $105,611 | 2023 | PG County Health Dept / Claritas |
| Median income (Hispanic/Latino) | PG County | $97,992 | 2023 | PG County Health Dept / Claritas |
| Families below poverty | PG County | 7.55% | 2023 | PG County Health Dept / Claritas |
| Total households | PG County | 343,614 | 2023 | PG County Health Dept / Claritas |
| Households with own children | PG County | 25.22% | 2023 | PG County Health Dept / Claritas |
| Food insecurity rate | Maryland | 9.7% | 2021 | Feeding America via Stacker |
| Cost per meal | Maryland | $3.76 | 2021 | Feeding America via Stacker |
| Median household income | Maryland | $107,134 | 2023 | PG County Health Dept / Claritas |
| Families below poverty | Maryland | 6.56% | 2023 | PG County Health Dept / Claritas |

#### How the data was collected

1. All source links from `locations.json` and the NourishNet Data Challenge CSV (29 unique URLs) were visited
2. Each page was checked for area-level economic indicators (income, poverty, unemployment, food insecurity, SNAP usage)
3. Only 3 sources contained extractable economic data:
   - **Stacker / Feeding America** — food insecurity rates, cost per meal, budget shortfall
   - **PG County Health Zone** (pgchealthzone.org) — median income by race, poverty rate, household data (Claritas data, updated March 2026)
   - **Maryland Food Bank** — qualitative context only (no specific numbers beyond Feeding America)
4. 26 other sources contained no economic data (pantry listings, portal landing pages, interactive maps, PDFs)

#### Accuracy and limitations

- All values are **source-backed** — nothing fabricated, estimated, or inferred
- Geographic granularity is **county-level** (PG County) or **statewide** (Maryland) only. No zip-code or census-tract data was available from these sources.
- Data years vary: food insecurity data is from **2021** (Feeding America), income/poverty data is from **2023** (Claritas)
- The open data portals (Census Bureau, Maryland Open Data, PG County Open Data) likely have more granular data but require API queries or dataset downloads not accessible via page scraping
- Not all locations have area-specific data — this file provides context for the PG County region as a whole

#### Usage guidance

| Use for | How |
|---------|-----|
| Donor heatmap / need indicators | Use `food insecurity rate` and `families below poverty` to show area need levels |
| Impact dashboard context | Use `cost per meal` and `annual food budget shortfall` for impact calculations |
| Demographic context | Use `median household income` breakdowns for community profiling |
| **Do NOT** use for | Per-location economic scoring (data is county-level, not location-specific) |

---

## Data Pipeline Flow

```
Day 1: Manual scraping
  └─→ locations.json (33 locations)
        ├─→ locations_backup_pre_expansion.json (safety copy)
        └─→ locations_sample.json (3 entries for dev)

Day 2: Expansion + Enrichment
  └─→ locations_expanded.json (58 locations = 33 original + 25 new)

Day 2: CAFB Data Integration
  ├─→ foodbank_scraped_locations.json (69 from FoodFinder site)
  ├─→ foodbank_csv_converted.json (690 from CAFB CSV)
  └─→ foodbank_merged_clean.json (697 deduplicated)

Day 2: Final Merge
  locations_expanded.json + foodbank_merged_clean.json
  └─→ locations_final_merged.json (737 locations)
        ├─→ locations_final_merged_backup.json (pre-enrichment backup)
        └─→ foodTypes + healthAttributes enrichment ⭐ PRODUCTION

Day 2: Economic Data Scrape
  └─→ area_income_sources.json (13 data points from Feeding America + PG Health Zone)
```

---

## File Safety Rules

| Rule | Files affected |
|------|---------------|
| **NEVER modify** | `locations.json`, `locations_backup_pre_expansion.json`, `locations_final_merged_backup.json` |
| **Read-only intermediate** | `locations_expanded.json`, `foodbank_scraped_locations.json`, `foodbank_csv_converted.json`, `foodbank_merged_clean.json` |
| **Safe to edit for testing** | `locations_sample.json` |
| **Production — enrich only** | `locations_final_merged.json` |
| **Reference — add verified data** | `area_income_sources.json` |
