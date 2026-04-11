#!/usr/bin/env python3
"""
NourishNet Data Pipeline
========================
Transforms raw CSV/scraped data into the standardized locations.json format.

Usage:
    python pipeline.py --input raw_data.csv --output locations.json

Requirements:
    pip install pandas geopy
"""

import json
import hashlib
import argparse
from datetime import date

try:
    import pandas as pd
except ImportError:
    print("Install pandas: pip install pandas")
    exit(1)


# ---------------------------------------------------------------------------
# Schema definition
# ---------------------------------------------------------------------------
LOCATION_SCHEMA = {
    "id": str,
    "name": str,
    "address": {"street": str, "city": str, "state": str, "zip": str},
    "lat": float,
    "lng": float,
    "hours": str,
    "phone": str,
    "website": str,
    "requirements": list,
    "foodTypes": list,
    "healthAttributes": {
        "halal": bool,
        "vegan": bool,
        "vegetarian": bool,
        "noBeef": bool,
        "lowGI": bool,
        "freshProduce": bool,
        "dairyFree": bool,
    },
    "tags": list,
    "insecurityIndex": float,
    "type": str,  # "customer" | "donor" | "volunteer"
    "lastVerified": str,
}

# Keyword → healthAttribute mapping (used for auto-tagging food descriptions)
HEALTH_KEYWORDS = {
    "halal": "halal",
    "vegan": "vegan",
    "vegetarian": "vegetarian",
    "no beef": "noBeef",
    "low gi": "lowGI",
    "low glycemic": "lowGI",
    "fresh produce": "freshProduce",
    "produce": "freshProduce",
    "fruits": "freshProduce",
    "vegetables": "freshProduce",
    "dairy free": "dairyFree",
    "dairy-free": "dairyFree",
    "non-dairy": "dairyFree",
}


def generate_id(name: str, address: str) -> str:
    """Deterministic ID from name + address so duplicates are caught."""
    raw = f"{name.strip().lower()}|{address.strip().lower()}"
    return "loc-" + hashlib.md5(raw.encode()).hexdigest()[:8]


def parse_address(raw: str) -> dict:
    """Best-effort address parsing. Expects 'street, city, state zip'."""
    parts = [p.strip() for p in raw.split(",")]
    if len(parts) >= 3:
        state_zip = parts[-1].split()
        return {
            "street": parts[0],
            "city": parts[1],
            "state": state_zip[0] if state_zip else "",
            "zip": state_zip[1] if len(state_zip) > 1 else "",
        }
    return {"street": raw, "city": "", "state": "", "zip": ""}


def infer_health_attributes(food_description: str) -> dict:
    """Auto-tag health attributes from a free-text food description."""
    attrs = {k: False for k in LOCATION_SCHEMA["healthAttributes"]}
    lower = food_description.lower()
    for keyword, attr in HEALTH_KEYWORDS.items():
        if keyword in lower:
            attrs[attr] = True
    return attrs


def clean_phone(raw: str) -> str:
    """Normalize phone to (XXX) XXX-XXXX."""
    digits = "".join(c for c in str(raw) if c.isdigit())
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits[0] == "1":
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return str(raw).strip()


def transform_row(row: dict, idx: int) -> dict | None:
    """Transform a single CSV row into the locations.json schema.

    Adjust the column name mappings below to match YOUR CSV headers.
    """
    # --- COLUMN MAPPINGS (edit these to match your CSV) ---
    name = str(row.get("name", row.get("Name", row.get("organization", "")))).strip()
    raw_address = str(row.get("address", row.get("Address", row.get("full_address", "")))).strip()
    lat = row.get("lat", row.get("latitude", row.get("Latitude", None)))
    lng = row.get("lng", row.get("longitude", row.get("Longitude", None)))
    hours = str(row.get("hours", row.get("Hours", row.get("schedule", "")))).strip()
    phone = str(row.get("phone", row.get("Phone", row.get("contact", "")))).strip()
    website = str(row.get("website", row.get("Website", row.get("url", "")))).strip()
    food_desc = str(row.get("food_types", row.get("Food Types", row.get("services", "")))).strip()

    # Skip rows missing critical fields
    if not name or name == "nan":
        return None
    if not raw_address or raw_address == "nan":
        return None

    address = parse_address(raw_address)

    # Try to parse lat/lng as floats
    try:
        lat = float(lat) if lat and str(lat) != "nan" else None
        lng = float(lng) if lng and str(lng) != "nan" else None
    except (ValueError, TypeError):
        lat, lng = None, None

    return {
        "id": generate_id(name, raw_address),
        "name": name,
        "address": address,
        "lat": lat or 0.0,
        "lng": lng or 0.0,
        "hours": hours if hours != "nan" else "",
        "phone": clean_phone(phone) if phone != "nan" else "",
        "website": website if website != "nan" else "",
        "requirements": [],
        "foodTypes": [f.strip() for f in food_desc.split(",") if f.strip() and f.strip() != "nan"],
        "healthAttributes": infer_health_attributes(food_desc),
        "tags": [],
        "insecurityIndex": 5.0,  # default; enrich later
        "type": "customer",
        "lastVerified": date.today().isoformat(),
    }


def deduplicate(locations: list[dict]) -> list[dict]:
    """Remove duplicates by ID."""
    seen = set()
    unique = []
    for loc in locations:
        if loc["id"] not in seen:
            seen.add(loc["id"])
            unique.append(loc)
    return unique


def validate(locations: list[dict]) -> list[dict]:
    """Drop records missing required fields and log warnings."""
    valid = []
    for loc in locations:
        missing = []
        if not loc.get("name"):
            missing.append("name")
        if not loc["address"].get("street"):
            missing.append("address.street")
        if loc["lat"] == 0.0 and loc["lng"] == 0.0:
            missing.append("lat/lng (needs geocoding)")
        if missing:
            print(f"  ⚠  {loc.get('name', 'UNKNOWN')}: missing {', '.join(missing)}")
        valid.append(loc)
    return valid


def geocode_missing(locations: list[dict]) -> list[dict]:
    """Attempt to geocode locations with missing lat/lng using geopy.

    Requires: pip install geopy
    Uses the free Nominatim geocoder (rate-limited to 1 req/sec).
    """
    try:
        from geopy.geocoders import Nominatim
        from geopy.extra.rate_limiter import RateLimiter
    except ImportError:
        print("  ℹ  Install geopy for geocoding: pip install geopy")
        return locations

    geolocator = Nominatim(user_agent="nourishnet-pipeline")
    geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1.1)

    for loc in locations:
        if loc["lat"] == 0.0 and loc["lng"] == 0.0:
            addr = loc["address"]
            query = f"{addr['street']}, {addr['city']}, {addr['state']} {addr['zip']}"
            print(f"  🌍 Geocoding: {query}")
            result = geocode(query)
            if result:
                loc["lat"] = round(result.latitude, 6)
                loc["lng"] = round(result.longitude, 6)
                print(f"     → {loc['lat']}, {loc['lng']}")
            else:
                print(f"     → Not found")
    return locations


def run_pipeline(input_path: str, output_path: str, do_geocode: bool = False):
    """Main pipeline: CSV → clean → transform → validate → JSON."""
    print(f"\n📂 Reading {input_path}...")
    df = pd.read_csv(input_path)
    print(f"   {len(df)} rows loaded, columns: {list(df.columns)}")

    print("\n🔄 Transforming rows...")
    locations = []
    for idx, row in df.iterrows():
        result = transform_row(row.to_dict(), idx)
        if result:
            locations.append(result)
    print(f"   {len(locations)} valid locations extracted")

    print("\n🧹 Deduplicating...")
    locations = deduplicate(locations)
    print(f"   {len(locations)} unique locations")

    print("\n✅ Validating...")
    locations = validate(locations)

    if do_geocode:
        print("\n🌍 Geocoding missing coordinates...")
        locations = geocode_missing(locations)

    print(f"\n💾 Writing {output_path}...")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(locations, f, indent=2, ensure_ascii=False)
    print(f"   ✅ Done! {len(locations)} locations written.\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NourishNet Data Pipeline")
    parser.add_argument("--input", "-i", required=True, help="Path to input CSV")
    parser.add_argument("--output", "-o", default="locations.json", help="Output JSON path")
    parser.add_argument("--geocode", action="store_true", help="Attempt to geocode missing lat/lng")
    args = parser.parse_args()
    run_pipeline(args.input, args.output, args.geocode)
