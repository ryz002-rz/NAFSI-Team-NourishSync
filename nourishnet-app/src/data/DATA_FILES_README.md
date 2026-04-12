# Data Files — Pipeline Documentation

All data files live in `nourishnet-app/src/data/`.  
**Last updated:** April 12, 2026 (Day 2)

---

## Quick Answer: Which file should I use?

| If you are... | Use this file |
|---------------|---------------|
| Building portals, filters, map, or any frontend feature | `locations_final_merged.json` |
| Running quick dev tests with minimal data | `locations_sample.json` |
| Investigating the original Day 1 data | `locations.json` |
| Debugging the enrichment pipeline | `locations_expanded.json` |
| Rolling back to pre-expansion state | `locations_backup_pre_expansion.json` |

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
please refer to this dataset.
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
  └─→ locations_final_merged.json (737 locations) ⭐ PRODUCTION
```

---

## File Safety Rules

| Rule | Files affected |
|------|---------------|
| **NEVER modify** | `locations.json`, `locations_backup_pre_expansion.json` |
| **Read-only intermediate** | `locations_expanded.json`, `foodbank_scraped_locations.json`, `foodbank_csv_converted.json`, `foodbank_merged_clean.json` |
| **Safe to edit for testing** | `locations_sample.json` |
| **Production — enrich only** | `locations_final_merged.json` |
