#!/usr/bin/env python3
"""Ensure Kenney CC0 atlas packs exist under public/atlases/.

Downloads + extracts the 7 packs Aetherveil uses if they are missing.
Skips work for any pack whose target folder already has content.

Atlases are gitignored, so this script must run before any build on a
fresh clone. Hooked into `pnpm prebuild` via package.json.

Usage: python scripts/ensure_atlases.py
"""
from __future__ import annotations

import io
import sys
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATLASES = ROOT / "public" / "atlases"

# (folder_name, zip_url)
PACKS = [
    ("tiny-town",      "https://kenney.nl/media/pages/assets/tiny-town/5e46f9e551-1735736916/kenney_tiny-town.zip"),
    ("tiny-dungeon",   "https://kenney.nl/media/pages/assets/tiny-dungeon/b56d7a13e3-1674742415/kenney_tiny-dungeon.zip"),
    ("roguelike-rpg",  "https://kenney.nl/media/pages/assets/roguelike-rpg-pack/1cb71b28fb-1677697420/kenney_roguelike-rpg-pack.zip"),
    ("ui-pack-rpg",    "https://kenney.nl/media/pages/assets/ui-pack-rpg-expansion/b1e1f298c6-1677661824/kenney_ui-pack-rpg-expansion.zip"),
    ("particle-pack",  "https://kenney.nl/media/pages/assets/particle-pack/1dd3d4cbe2-1677578741/kenney_particle-pack.zip"),
    ("pixel-ui",       "https://kenney.nl/media/pages/assets/pixel-ui-pack/38633c7bb8-1677661508/kenney_pixel-ui-pack.zip"),
    ("cursor-pack",    "https://kenney.nl/media/pages/assets/cursor-pack/2a0f4fedfc-1717599281/kenney_cursor-pack.zip"),
]


def folder_has_content(folder: Path) -> bool:
    """Treat a pack folder as 'present' if it has any PNG file inside."""
    if not folder.is_dir():
        return False
    for path in folder.rglob("*.png"):
        return True
    return False


def download_pack(name: str, url: str) -> None:
    target = ATLASES / name
    if folder_has_content(target):
        print(f"[atlases] {name}: present, skip")
        return
    print(f"[atlases] {name}: fetching {url}")
    target.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (atlas-ensure)"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = resp.read()
    print(f"[atlases] {name}: extracting ({len(data) // 1024} KB)")
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        zf.extractall(target)
    print(f"[atlases] {name}: done")


def main() -> int:
    ATLASES.mkdir(parents=True, exist_ok=True)
    for name, url in PACKS:
        try:
            download_pack(name, url)
        except Exception as exc:
            print(f"!! atlas pack '{name}' failed: {exc}", file=sys.stderr)
            return 1
    print("[atlases] all packs ready under public/atlases/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
