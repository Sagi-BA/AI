"""Build polarsteps.json for the India calendar page.

Maps each Polarsteps step to the local Indian calendar date it happened on, so a
photo taken at 00:30 IST lands on that day rather than sliding to the day before.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

TRIP_ID = os.environ.get("TRIP_ID", "28911836")
API = f"https://api.polarsteps.com/trips/{TRIP_ID}"
OUT = "landing-pages/sagi-india-calendar-interactive/polarsteps.json"

# Without this header the API answers 404 even for a public trip.
HEADERS = {
    "Polarsteps-Api-Version": "69",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; sagi-india-calendar/1.0)",
}

TRIP_TZ = ZoneInfo("Asia/Kolkata")
IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp", ".heic")


def fetch():
    req = urllib.request.Request(API, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)


def step_date(step):
    """Local (India) calendar date for a step."""
    ts = step.get("start_time") or step.get("creation_time")
    if not ts:
        return None
    tz = TRIP_TZ
    name = step.get("timezone_id")
    if name:
        try:
            tz = ZoneInfo(name)
        except Exception:
            pass
    return datetime.fromtimestamp(float(ts), tz=timezone.utc).astimezone(tz).date().isoformat()


def photo_urls(step):
    """Pull image URLs out of a step, tolerating a few shapes of the media list."""
    urls = []
    for key in ("media", "photos"):
        for item in step.get(key) or []:
            if isinstance(item, str):
                cand = item
            elif isinstance(item, dict):
                if item.get("type") in (2, "video"):
                    continue
                cand = next(
                    (item[k] for k in
                     ("large_thumbnail_path", "path", "full_path", "url", "thumbnail_path")
                     if isinstance(item.get(k), str) and item[k].startswith("http")),
                    None,
                )
            else:
                cand = None
            if cand and cand not in urls and cand.lower().split("?")[0].endswith(IMAGE_EXT):
                urls.append(cand)
    return urls


def main():
    trip = fetch()
    steps = trip.get("all_steps") or trip.get("steps") or []
    print(f"trip={trip.get('name')!r} visibility={trip.get('visibility')} steps={len(steps)}")

    days = {}
    for step in steps:
        date = step_date(step)
        if not date:
            continue
        shots = photo_urls(step)
        entry = days.setdefault(date, {"title": "", "photos": []})
        if not entry["title"] and step.get("name"):
            entry["title"] = step["name"]
        for u in shots:
            if u not in entry["photos"]:
                entry["photos"].append(u)
        print(f"  {date}  {len(shots):>2} photo(s)  {step.get('name') or ''}")

    payload = {
        "trip": trip.get("name"),
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "days": days,
    }

    # Never replace real content with an empty file - a transient API hiccup
    # shouldn't blank out the girls' photos.
    if os.path.exists(OUT) and not days:
        with open(OUT, encoding="utf-8") as f:
            existing = json.load(f)
        if existing.get("days"):
            print("API returned no steps but the existing file has photos - keeping it.")
            return

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write("\n")
    total = sum(len(d["photos"]) for d in days.values())
    print(f"wrote {OUT}: {len(days)} day(s), {total} photo(s)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
