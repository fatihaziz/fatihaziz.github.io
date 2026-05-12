#!/usr/bin/env python3
"""Render an indexed reference of Tiny Dungeon tiles. Used to identify which
frame indices contain character sprites. One-shot helper."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PACKED = ROOT / "public" / "atlases" / "tiny-dungeon" / "Tilemap" / "tilemap_packed.png"
OUT = ROOT / "test-results" / "tiny-dungeon-reference.png"

TILE = 16
COLS, ROWS = 12, 11
SCALE = 5
PADDING = 18

packed = Image.open(PACKED).convert("RGBA")
cell = TILE * SCALE
out_w = COLS * (cell + PADDING) + PADDING
out_h = ROWS * (cell + PADDING + 18) + PADDING

out = Image.new("RGBA", (out_w, out_h), (40, 25, 50, 255))
d = ImageDraw.Draw(out)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 14)
except Exception:
    font = ImageFont.load_default()

for r in range(ROWS):
    for c in range(COLS):
        idx = r * COLS + c
        tile = packed.crop((c * TILE, r * TILE, (c + 1) * TILE, (r + 1) * TILE))
        tile = tile.resize((cell, cell), Image.NEAREST)
        x = PADDING + c * (cell + PADDING)
        y = PADDING + r * (cell + PADDING + 18)
        d.rectangle([x - 2, y - 2, x + cell + 2, y + cell + 2], fill=(245, 240, 220))
        out.paste(tile, (x, y), tile)
        d.text((x + cell // 2, y + cell + 2), str(idx), fill=(245, 245, 220), anchor="mt", font=font)

OUT.parent.mkdir(parents=True, exist_ok=True)
out.save(OUT)
print(f"wrote {OUT} ({out.size[0]}x{out.size[1]})")
