#!/usr/bin/env python3
"""
Build locations.json from scraped_pantries.csv with geocoding via Nominatim.
Usage: python3 build_locations.py
"""
import csv
import json
import hashlib
import time
import urllib.request
import urllib.parse

CSV_PATH = "scraped_pantries.csv"
OUTPUT_PATH = "locations.json"

def geocode(street, city, state, zip_code):
    """Geocode an address using OpenStreetMap Nominatim (free, no key needed)."""
    if not street or street.strip() == "":
        return None, None
    query = f"{street}, {city}, {state} {zip_code}"
    params = urllib.parse.urlencode({
        "q": query,
        "format": "json",
        "limit": 1,
        "countrycodes": "us"
    })
    url = f"https://nominatim.openstreetmap.org/search?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "NourishNet-DataPipeline/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data:
                return round(float(data[0]["lat"]), 6), round(float(data[0]["lon"]), 6)
    except Exception as e:
        print(f"  ⚠ Geocode failed for '{query}': {e}")
    return None, None


def build_location(row, lat, lng):
    """Convert a CSV row + geocoded coords into the app schema."""
    return {
        "id": f"loc-{row['id'].zfill(3)}",
        "name": row["name"],
        "address": {
            "street": row["street"],
            "city": row["city"],
            "state": row["state"],
            "zip": row["zip"]
        },
        "lat": lat if lat else 0.0,
        "lng": lng if lng else 0.0,
        "hours": row["hours"],
        "phone": row["phone"],
        "website": row["website"],
        "requirements": [],
        "foodTypes": [],
        "healthAttributes": {
            "halal": False,
            "vegan": False,
            "vegetarian": False,
            "noBeef": False,
            "lowGI": False,
            "freshProduce": False,
            "dairyFree": False
        },
        "tags": ["family-friendly"],
        "insecurityIndex": 7.0,
        "type": "customer",
        "lastVerified": "2026-04-11",
        "source": {
            "source_name": row["source_name"],
            "source_url": row["source_url"],
            "extracted_from": row["extracted_from"]
        }
    }


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    print(f"📂 Loaded {len(rows)} rows from {CSV_PATH}")

    locations = []
    skipped = []

    for row in rows:
        street = row.get("street", "").strip()
        city = row.get("city", "").strip()
        state = row.get("state", "").strip()
        zip_code = row.get("zip", "").strip()

        if not street:
            print(f"  ⏭ Skipping '{row['name']}' — no street address")
            skipped.append(row["name"])
            continue

        print(f"  🌍 Geocoding: {street}, {city}, {state} {zip_code} ...", end=" ")
        lat, lng = geocode(street, city, state, zip_code)

        if lat and lng:
            print(f"✅ ({lat}, {lng})")
        else:
            print(f"❌ not found — using 0,0")

        locations.append(build_location(row, lat, lng))
        time.sleep(1.1)  # Nominatim rate limit: 1 req/sec

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(locations, f, indent=2, ensure_ascii=False)

    geocoded = sum(1 for loc in locations if loc["lat"] != 0.0)
    print(f"\n✅ Done! {len(locations)} locations written to {OUTPUT_PATH}")
    print(f"   {geocoded} geocoded, {len(locations) - geocoded} missing coords")
    if skipped:
        print(f"   {len(skipped)} skipped (no street): {', '.join(skipped)}")


if __name__ == "__main__":
    main()
