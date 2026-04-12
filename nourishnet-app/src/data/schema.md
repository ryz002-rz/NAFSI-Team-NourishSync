# NourishNet Data Schema

**Status:** Frozen — do not modify field names or types without team agreement.  
**Last updated:** April 11, 2026

---

## LocationEntry Schema

Each object in `locations.json` and `locations_sample.json` conforms to this schema.

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier | `"loc-001"` |
| `name` | string | ✅ | Official name of the food pantry | `"PGCDSS North County Food Pantry"` |
| `address` | object | ✅ | Structured address (see sub-fields below) | — |
| `address.street` | string | ✅ | Street address | `"6505 Bellcrest Road"` |
| `address.city` | string | ✅ | City | `"Hyattsville"` |
| `address.state` | string | ✅ | State abbreviation | `"MD"` |
| `address.zip` | string | ✅ | ZIP code | `"20782"` |
| `lat` | number | ✅ | Latitude | `38.9553` |
| `lng` | number | ✅ | Longitude | `-76.9713` |
| `hours` | string | ❌ | Operating hours (empty string if unknown) | `"Mon-Fri 8:00 AM - 4:30 PM"` |
| `phone` | string | ❌ | Contact phone (empty string if unknown) | `"(301) 322-5700"` |
| `website` | string | ❌ | Official URL (empty string if none) | `"https://www.ucappgc.org"` |
| `requirements` | string[] | ❌ | What visitors need (empty array if unknown) | `["Photo ID required", "Appointment required"]` |
| `foodTypes` | string[] | ❌ | Types of food offered (empty array if unknown) | `["Fresh produce", "Canned goods"]` |
| `healthAttributes` | object | ✅ | Boolean dietary/nutritional flags | — |
| `healthAttributes.halal` | boolean | ✅ | Halal food confirmed | `false` |
| `healthAttributes.vegan` | boolean | ✅ | Vegan options confirmed | `false` |
| `healthAttributes.vegetarian` | boolean | ✅ | Vegetarian options confirmed | `false` |
| `healthAttributes.noBeef` | boolean | ✅ | Beef-free options confirmed | `false` |
| `healthAttributes.lowGI` | boolean | ✅ | Low-glycemic options confirmed | `false` |
| `healthAttributes.freshProduce` | boolean | ✅ | Fresh fruits/vegetables confirmed | `true` |
| `healthAttributes.dairyFree` | boolean | ✅ | Dairy-free options confirmed | `false` |
| `tags` | string[] | ✅ | Searchable filter tags | `["family-friendly", "no-id-required"]` |
| `insecurityIndex` | number | ✅ | Food insecurity rate for the area (%) | `7.4` |
| `insecurityIndexNote` | string | ✅ | Source and granularity of the score | `"County-level rate from Feeding America..."` |
| `type` | string | ✅ | Portal type: `"customer"`, `"donor"`, or `"volunteer"` | `"customer"` |
| `lastVerified` | string | ✅ | ISO date of last verification | `"2026-04-11"` |
| `source` | object | ✅ | Data lineage tracking | — |
| `source.source_name` | string | ✅ | Name of the data source | `"PG County Government"` |
| `source.source_url` | string | ✅ | URL from the CSV link column | `"https://www.princegeorgescountymd.gov/..."` |
| `source.extracted_from` | string | ✅ | Exact page URL where data was found | `"https://www.princegeorgescountymd.gov/..."` |

### Notes on `false` vs missing

- `healthAttributes` booleans set to `false` mean "not confirmed by source" — NOT "confirmed absent"
- Empty `hours`, `phone`, `website` strings mean "not found on source page"
- Empty `foodTypes` and `requirements` arrays mean "not described on source page"

---

## UserPreferences localStorage Schema

Stored under the key `nourishnet_prefs` in localStorage as a JSON string.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `language` | string | `"en"` | Selected language code: `"en"`, `"es"`, `"zh"`, `"fr"`, `"am"`, `"tl"` |
| `role` | string \| null | `null` | Selected portal role: `"customer"`, `"donor"`, `"volunteer"`, or `null` |
| `dietary_tags` | string[] | `[]` | Selected dietary filter tags (e.g., `["halal", "freshProduce"]`) |
| `household_size` | number \| null | `null` | Household size for demographic matching, or `null` if not provided |

### Default object

```json
{
  "language": "en",
  "role": null,
  "dietary_tags": [],
  "household_size": null
}
```

### Read/write pattern

```js
// Read
const prefs = JSON.parse(localStorage.getItem("nourishnet_prefs") || "{}");

// Write (merge with existing)
const existing = JSON.parse(localStorage.getItem("nourishnet_prefs") || "{}");
localStorage.setItem("nourishnet_prefs", JSON.stringify({ ...existing, language: "es" }));
```
