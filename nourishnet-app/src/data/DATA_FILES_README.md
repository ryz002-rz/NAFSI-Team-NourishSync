# Data Files — Quick Reference

All data files live in `nourishnet-app/src/data/`.

---

## JSON Files

### `locations.json` — Original Dataset (DO NOT EDIT)
- **33 locations** — the Day 1 scraped and geocoded dataset
- This is the original baseline. It is frozen and should not be modified.
- Does NOT have donor/volunteer fields.
- Kept for safety and rollback purposes.

### `locations_expanded.json` — Production Dataset (USE THIS ONE)
- **58 locations** — includes all original 33 + 25 newly scraped locations
- Has all fields the app needs: donor fields (`wishlist`, `acceptsPerishable`, `dropOffHours`), volunteer fields (`missions`, `volunteersNeeded`), health attributes, coordinates, source lineage
- **This is the file the frontend should import.**

### `locations_sample.json` — Dev/Test Sample (3 entries)
- **3 locations** picked from the real dataset for development and testing
- One fully populated, one with empty optionals, one minimal
- Used by portal placeholder pages during initial build. Safe to replace with `locations_expanded.json` import once portals are wired up.

### `locations_backup_pre_expansion.json` — Safety Backup
- Exact copy of `locations.json` taken before expansion work started
- Exists purely as a rollback safety net. Do not import or use in the app.

---

## Which file should I use?

| If you are... | Use this file |
|---------------|---------------|
| Building the Customer/Donor/Volunteer portals | `locations_expanded.json` |
| Writing filter logic or map integration | `locations_expanded.json` |
| Running quick dev tests with minimal data | `locations_sample.json` |
| Checking the original pre-expansion data | `locations.json` |
| Rolling back if something breaks | `locations_backup_pre_expansion.json` |

## Import example

```js
import locations from '../data/locations_expanded.json';
```
