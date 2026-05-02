#!/usr/bin/env python3
"""Convert PNG/JPG/JPEG images in a directory tree to WebP and (optionally)
update HTML references to point at the new files.

Designed to be invoked by Claude Code via the `/optimize-images` skill.
Supports both human-readable and JSON output modes.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

# Force UTF-8 stdout so the script works on Windows code pages that lack arrows/x.
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except (AttributeError, OSError):
    pass

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow is not installed. Run: pip install Pillow", file=sys.stderr)
    sys.exit(2)

CONTENT_EXTS = {".png", ".jpg", ".jpeg"}
HTML_EXTS = {".html", ".htm"}
OG_HINTS = ("og", "og-image", "og-preview", "og_image")


@dataclass
class Conversion:
    src: str
    dst: str
    src_bytes: int
    dst_bytes: int
    src_dimensions: tuple[int, int]
    dst_dimensions: tuple[int, int]
    is_og: bool
    already_existed: bool = False


@dataclass
class HtmlEdit:
    file: str
    occurrences: int
    pairs: list[tuple[str, str]]


def is_og_image(path: Path) -> bool:
    name = path.stem.lower()
    return any(hint in name for hint in OG_HINTS)


def target_max_width(path: Path, content_width: int, og_width: int) -> int:
    return og_width if is_og_image(path) else content_width


def find_images(root: Path) -> list[Path]:
    return sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in CONTENT_EXTS)


def convert_one(src: Path, quality: int, max_width: int, dry_run: bool) -> Conversion | None:
    dst = src.with_suffix(".webp")
    if dst.exists() and not dry_run:
        # Don't overwrite existing webp — but still surface the mapping so HTML refs
        # can be updated on a re-run.
        with Image.open(src) as im:
            src_w, src_h = im.size
        with Image.open(dst) as im:
            dst_w, dst_h = im.size
        return Conversion(
            src=str(src), dst=str(dst),
            src_bytes=src.stat().st_size, dst_bytes=dst.stat().st_size,
            src_dimensions=(src_w, src_h), dst_dimensions=(dst_w, dst_h),
            is_og=is_og_image(src), already_existed=True,
        )

    with Image.open(src) as im:
        im.load()
        src_w, src_h = im.size

        if im.mode in ("P", "LA"):
            im = im.convert("RGBA")
        elif im.mode == "CMYK":
            im = im.convert("RGB")

        if src_w > max_width:
            ratio = max_width / src_w
            new_size = (max_width, max(1, int(src_h * ratio)))
            im = im.resize(new_size, Image.Resampling.LANCZOS)

        dst_w, dst_h = im.size

        if dry_run:
            # Estimate WebP size by encoding to a buffer
            from io import BytesIO
            buf = BytesIO()
            save_im = im
            if save_im.mode == "RGBA":
                save_im.save(buf, "webp", quality=quality, method=6)
            else:
                save_im.convert("RGB").save(buf, "webp", quality=quality, method=6)
            dst_bytes = buf.tell()
        else:
            if im.mode == "RGBA":
                im.save(dst, "webp", quality=quality, method=6)
            else:
                im.convert("RGB").save(dst, "webp", quality=quality, method=6)
            dst_bytes = dst.stat().st_size

    return Conversion(
        src=str(src),
        dst=str(dst),
        src_bytes=src.stat().st_size,
        dst_bytes=dst_bytes,
        src_dimensions=(src_w, src_h),
        dst_dimensions=(dst_w, dst_h),
        is_og=is_og_image(src),
        already_existed=False,
    )


def find_html_references(repo_root: Path, conversions: list[Conversion]) -> list[HtmlEdit]:
    """For each HTML file in the repo, find references to converted images and
    propose replacements (PNG/JPG path → WebP path)."""
    edits: list[HtmlEdit] = []

    # Build set of (filename, full path) variants to look for.
    src_names = []
    for c in conversions:
        src_path = Path(c.src)
        src_names.append((src_path.name, Path(c.dst).name, src_path, Path(c.dst)))

    html_files = sorted(p for p in repo_root.rglob("*") if p.is_file() and p.suffix.lower() in HTML_EXTS and ".claude" not in p.parts)

    for html in html_files:
        try:
            text = html.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue

        pairs: list[tuple[str, str]] = []
        for src_name, dst_name, src_path, dst_path in src_names:
            # Match the basename — most references are relative paths ending with `<name>.png`.
            # Use a regex that ensures we only match whole filenames (preceded by /, ", ', or whitespace).
            pattern = re.compile(r'(?P<prefix>["\'/\s\(=])' + re.escape(src_name) + r'(?P<suffix>["\'\s\)\?#])')
            if pattern.search(text):
                pairs.append((src_name, dst_name))

        if pairs:
            # Count total occurrences across all pairs
            count = 0
            for src_name, _ in pairs:
                pattern = re.compile(r'(?P<prefix>["\'/\s\(=])' + re.escape(src_name) + r'(?P<suffix>["\'\s\)\?#])')
                count += len(pattern.findall(text))
            edits.append(HtmlEdit(file=str(html.relative_to(repo_root)), occurrences=count, pairs=pairs))

    return edits


def apply_html_edits(repo_root: Path, edits: list[HtmlEdit]) -> int:
    """Apply replacements; return number of files modified."""
    modified = 0
    for edit in edits:
        path = repo_root / edit.file
        text = path.read_text(encoding="utf-8")
        original = text
        for src_name, dst_name in edit.pairs:
            pattern = re.compile(r'(?P<prefix>["\'/\s\(=])' + re.escape(src_name) + r'(?P<suffix>["\'\s\)\?#])')
            text = pattern.sub(lambda m: m.group("prefix") + dst_name + m.group("suffix"), text)
        if text != original:
            path.write_text(text, encoding="utf-8")
            modified += 1
    return modified


def fmt_bytes(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}TB"


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert PNG/JPG to WebP and update HTML refs.")
    parser.add_argument("path", help="Directory to scan (recursive)")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality 0-100 (default 85)")
    parser.add_argument("--max-width", type=int, default=1600, help="Max width for content images (default 1600)")
    parser.add_argument("--og-max-width", type=int, default=1200, help="Max width for OG images (default 1200)")
    parser.add_argument("--repo-root", default=".", help="Repo root for HTML scan (default cwd)")
    parser.add_argument("--dry-run", action="store_true", help="Don't write anything; just report.")
    parser.add_argument("--apply-html", action="store_true", help="Apply HTML reference replacements (after conversions are done).")
    parser.add_argument("--json", action="store_true", help="Output JSON for machine consumption.")
    args = parser.parse_args()

    scan_root = Path(args.path).resolve()
    repo_root = Path(args.repo_root).resolve()

    if not scan_root.exists():
        print(f"ERROR: path does not exist: {scan_root}", file=sys.stderr)
        return 2

    images = find_images(scan_root)

    if not images:
        if args.json:
            print(json.dumps({"images": [], "html_edits": [], "message": "No PNG/JPG/JPEG found."}))
        else:
            print(f"No PNG/JPG/JPEG images found under {scan_root}")
        return 0

    conversions: list[Conversion] = []
    for src in images:
        max_w = target_max_width(src, args.max_width, args.og_max_width)
        result = convert_one(src, args.quality, max_w, args.dry_run)
        if result is None:
            # WebP already exists — skip (don't overwrite)
            continue
        conversions.append(result)

    # HTML scan only matters if we have conversions
    html_edits = find_html_references(repo_root, conversions) if conversions else []

    if args.apply_html and not args.dry_run and html_edits:
        modified = apply_html_edits(repo_root, html_edits)
    else:
        modified = 0

    new_conversions = [c for c in conversions if not c.already_existed]
    total_src = sum(c.src_bytes for c in new_conversions)
    total_dst = sum(c.dst_bytes for c in new_conversions)
    saved = total_src - total_dst
    ratio = (saved / total_src * 100) if total_src else 0

    if args.json:
        print(json.dumps({
            "dry_run": args.dry_run,
            "applied_html": args.apply_html and not args.dry_run,
            "conversions": [asdict(c) for c in conversions],
            "html_edits": [asdict(e) for e in html_edits],
            "html_modified_count": modified,
            "totals": {
                "files": len(conversions),
                "src_bytes": total_src,
                "dst_bytes": total_dst,
                "saved_bytes": saved,
                "saved_pct": round(ratio, 1),
            },
        }, indent=2))
    else:
        mode = "DRY RUN" if args.dry_run else "APPLIED"
        skipped = len(conversions) - len(new_conversions)
        header = f"=== {mode}: {len(new_conversions)} new image(s) under {scan_root}"
        if skipped:
            header += f" (+ {skipped} already converted)"
        header += " ==="
        print(header + "\n")
        for c in conversions:
            tag = " [OG]" if c.is_og else ""
            existed = " [SKIPPED — webp already exists]" if c.already_existed else ""
            sw, sh = c.src_dimensions
            dw, dh = c.dst_dimensions
            dim_str = f"{sw}x{sh}" if (sw, sh) == (dw, dh) else f"{sw}x{sh} -> {dw}x{dh}"
            pct = (1 - c.dst_bytes / c.src_bytes) * 100 if c.src_bytes else 0
            print(f"  {Path(c.src).name}{tag}{existed}")
            print(f"    {dim_str}  |  {fmt_bytes(c.src_bytes)} -> {fmt_bytes(c.dst_bytes)}  ({pct:.0f}% smaller)")
        if new_conversions:
            print(f"\nTotal new: {fmt_bytes(total_src)} -> {fmt_bytes(total_dst)}  (saved {fmt_bytes(saved)}, {ratio:.0f}%)")
        else:
            print("\nNo new conversions performed (all targets already exist).")

        if html_edits:
            print(f"\n=== HTML references found in {len(html_edits)} file(s) ===")
            for e in html_edits:
                print(f"  {e.file}  ({e.occurrences} occurrence(s))")
                for src, dst in e.pairs:
                    print(f"    {src} → {dst}")
            if args.apply_html and not args.dry_run:
                print(f"\nApplied: modified {modified} HTML file(s).")
            elif not args.dry_run:
                print("\nHTML refs NOT updated. Re-run with --apply-html to update them.")
        else:
            print("\nNo HTML references found to update.")

        if not args.dry_run and (new_conversions or modified):
            print("\nNote: original PNG/JPG files were kept. Delete manually after verifying the pages render correctly.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
