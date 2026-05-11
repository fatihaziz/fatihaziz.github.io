#!/usr/bin/env python3
"""Render the Aetherveil Valley design map to PNG via Pillow.

v3 — town center as a proper square plaza enclosed on 4 sides by shops,
a bazaar row of colourful market stalls, a central bell tower (separate
from the SE clock tower), 6 named shops (bakery, herbalist, tailor,
fishmonger, cobbler, scribe), internal plaza pathways with turns, and
~18 NPC figures placed where townsfolk actually gather (fountain,
bazaar, dock, gardens, cherry grove, paths).

Output: docs/spec/assets/aetherveil-map.png (1400x1000).

Usage: python scripts/render_aetherveil_map.py
"""
from __future__ import annotations

import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "spec" / "assets" / "aetherveil-map.png"
W, H = 1400, 1000

RNG = random.Random(1729)

C = {
    "grass_light": (158, 195, 112),
    "grass_dark": (127, 167, 85),
    "grass_patch": (172, 207, 122),
    "dirt_patch": (164, 138, 96),
    "forest": (58, 107, 61),
    "forest_dark": (39, 74, 42),
    "path": (177, 142, 92),
    "path_dark": (122, 92, 48),
    "plaza": (208, 175, 124),
    "plaza_dark": (164, 130, 80),
    "cobble": (200, 167, 119),
    "river": (95, 168, 211),
    "river_light": (155, 208, 235),
    "sea": (42, 103, 150),
    "sea_light": (95, 168, 211),
    "sand": (244, 217, 151),
    "sand_dark": (230, 200, 120),
    "waterfall": (230, 244, 255),
    "waterfall_blue": (191, 224, 250),
    "cherry_bg": (253, 226, 234),
    "cherry_pink": (248, 168, 192),
    "cherry_pink_light": (255, 200, 220),
    "cherry_dark": (217, 122, 160),
    "wood": (169, 107, 58),
    "wood_dark": (90, 54, 23),
    "stone": (156, 156, 156),
    "stone_dark": (69, 69, 69),
    "roof_red": (164, 74, 74),
    "roof_dark_red": (111, 31, 31),
    "roof_brown": (122, 74, 48),
    "roof_blue_grey": (102, 116, 138),
    "roof_green_grey": (96, 122, 100),
    "roof_ochre": (180, 138, 72),
    "roof_teal": (74, 134, 132),
    "roof_violet": (130, 88, 152),
    "window": (248, 233, 184),
    "door_dark": (58, 35, 16),
    "smoke": (203, 214, 220),
    "fountain": (127, 185, 229),
    "lantern_glow": (247, 224, 138),
    "text": (38, 26, 18),
    "text_light": (255, 255, 255),
    "legend_bg": (255, 248, 236),
    "label_bg": (245, 225, 182),
    "highlight": (244, 147, 58),
    "fence": (130, 92, 50),
    "veg_dark": (62, 105, 50),
    "veg_light": (132, 178, 80),
    "tree_oak": (94, 140, 62),
    "tree_oak_dark": (63, 97, 40),
    "tree_pine_inner": (74, 122, 70),
    "well_stone": (140, 140, 140),
    "well_water": (95, 168, 211),
    "hay": (218, 184, 96),
    "hay_dark": (162, 130, 56),
    "bell_brass": (212, 174, 88),
    "bell_dark": (132, 96, 32),
    # NPC clothing
    "npc_green": (74, 122, 64),
    "npc_blue": (74, 96, 144),
    "npc_red": (164, 74, 74),
    "npc_brown": (130, 92, 50),
    "npc_violet": (130, 88, 152),
    "npc_teal": (74, 134, 132),
    "npc_ochre": (180, 138, 72),
    "skin_light": (245, 216, 176),
    "skin_warm": (212, 168, 124),
}


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if bold:
        candidates += [
            "C:/Windows/Fonts/segoeuib.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "DejaVuSans-Bold.ttf",
        ]
    else:
        candidates += [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "DejaVuSans.ttf",
        ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def text_shadow(d, xy, text, font, fill, anchor="lt", shadow=(0, 0, 0, 160)):
    x, y = xy
    d.text((x + 1, y + 1), text, font=font, fill=shadow, anchor=anchor)
    d.text((x, y), text, font=font, fill=fill, anchor=anchor)


# ============================================================================
# CORE LAYERS
# ============================================================================

def draw_base_ground(d):
    for y in range(H):
        t = y / H
        r = int(C["grass_light"][0] * (1 - t) + C["grass_dark"][0] * t)
        g = int(C["grass_light"][1] * (1 - t) + C["grass_dark"][1] * t)
        b = int(C["grass_light"][2] * (1 - t) + C["grass_dark"][2] * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    for _ in range(45):
        cx = RNG.randint(60, W - 60)
        cy = RNG.randint(60, H - 250)
        r = RNG.randint(35, 70)
        d.ellipse([cx - r, cy - r // 2, cx + r, cy + r // 2], fill=C["grass_patch"])


def draw_forest_border(d):
    d.rectangle([0, 0, W, 56], fill=C["forest"])
    d.rectangle([0, 0, 46, H - 220], fill=C["forest"])
    d.rectangle([W - 46, 0, W, H - 220], fill=C["forest"])
    for x in range(22, W - 22, 36):
        d.polygon([(x, 14), (x - 10, 50), (x + 10, 50)], fill=C["forest_dark"])
    for y in range(78, H - 220, 52):
        d.polygon([(16, y), (4, y + 30), (28, y + 30)], fill=C["forest_dark"])
        d.polygon([(W - 16, y), (W - 28, y + 30), (W - 4, y + 30)], fill=C["forest_dark"])


# ============================================================================
# GENERIC DRAWERS
# ============================================================================

def two_story(d, x, y, w, h, roof_color, body_color=(216, 178, 126),
              upper_body=None, smoke=False, shop_below=False, sign=None):
    """A 2-storey building. Upper floor overhangs slightly. Used for taverns,
    larger townhouses, shops with dwellings above."""
    if upper_body is None:
        # Slightly lighter upper floor
        upper_body = tuple(min(255, c + 14) for c in body_color)
    # Steep roof
    roof_h = int(h * 0.28)
    d.polygon([(x - 4, y + roof_h), (x + w // 2, y), (x + w + 4, y + roof_h)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Upper floor (overhangs by 4px on each side)
    upper_h = int(h * 0.38)
    d.rectangle([x - 4, y + roof_h, x + w + 4, y + roof_h + upper_h],
                fill=upper_body, outline=C["wood_dark"], width=1)
    # Two upper-floor windows
    uw_y = y + roof_h + 6
    uw_h = upper_h - 12
    d.rectangle([x + 4, uw_y, x + 4 + max(10, w // 6), uw_y + uw_h],
                fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 4 - max(10, w // 6), uw_y, x + w - 4, uw_y + uw_h],
                fill=C["window"], outline=C["wood_dark"], width=1)
    # Ground floor
    g_y = y + roof_h + upper_h
    d.rectangle([x + 2, g_y, x + w - 2, y + h],
                fill=body_color, outline=C["wood_dark"], width=1)
    # Shopfront variant: large display window + sign over door
    if shop_below:
        d.rectangle([x + 6, g_y + 4, x + 6 + (w - 12) // 2 - 2, y + h - 6],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        d.rectangle([x + 6 + (w - 12) // 2 + 2, g_y + 4, x + w - 6, y + h - 2],
                    fill=C["door_dark"])
    else:
        # Door + 2 ground-floor windows
        # Door takes ~22px of bottom, windows fill the rest above (clamped to >=8px).
        door_top_y = y + h - 22
        dw = max(8, w // 7)
        d.rectangle([x + w // 2 - dw // 2, door_top_y,
                     x + w // 2 + dw // 2, y + h], fill=C["door_dark"])
        gw_y = g_y + 4
        gw_h = max(8, door_top_y - gw_y - 4)
        d.rectangle([x + 4, gw_y, x + 4 + max(10, w // 6), gw_y + gw_h],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        d.rectangle([x + w - 4 - max(10, w // 6), gw_y, x + w - 4, gw_y + gw_h],
                    fill=C["window"], outline=C["wood_dark"], width=1)
    if sign:
        sw = max(28, w // 2)
        d.rectangle([x + w // 2 - sw // 2, y + roof_h - 8,
                     x + w // 2 + sw // 2, y + roof_h + 6],
                    fill=C["label_bg"], outline=C["wood_dark"], width=1)
        d.text((x + w // 2, y + roof_h - 1), sign,
               font=load_font(8, bold=True), fill=C["text"], anchor="mm")
    if smoke:
        cx = x + w - 12
        d.rectangle([cx - 2, y + 2, cx + 2, y + 14], fill=C["wood_dark"])
        for cy, cr in [(y - 6, 5), (y - 16, 6), (y - 28, 7)]:
            d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=C["smoke"])


def tower_house(d, x, y, w, h, roof_color, body_color=(216, 178, 126), smoke=False):
    """Tall narrow 3-storey building with steep pointed roof."""
    # Very steep roof
    d.polygon([(x - 2, y + 30), (x + w // 2, y - 14), (x + w + 2, y + 30)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Body
    d.rectangle([x, y + 30, x + w, y + h], fill=body_color, outline=C["wood_dark"], width=1)
    # 3 stacked single windows (centered)
    levels = 3
    floor_h = (h - 30 - 18) // levels  # leaves room for door
    for i in range(levels):
        wy = y + 36 + i * floor_h
        wx = x + w // 2
        d.rectangle([wx - 5, wy, wx + 5, wy + max(8, floor_h - 6)],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        # Horizontal floor stripe
        if i < levels - 1:
            sy = wy + max(8, floor_h - 6) + 3
            d.line([(x + 2, sy), (x + w - 2, sy)], fill=C["wood_dark"], width=1)
    # Door
    d.rectangle([x + w // 2 - 5, y + h - 14, x + w // 2 + 5, y + h], fill=C["door_dark"])
    if smoke:
        cx = x + w // 2 + 2
        d.rectangle([cx - 1, y - 4, cx + 1, y + 6], fill=C["wood_dark"])
        for cy, cr in [(y - 12, 4), (y - 22, 5), (y - 32, 6)]:
            d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=C["smoke"])


def manor(d, x, y, w, h, roof_color, body_color=(216, 178, 126)):
    """Wider 2-storey manor with an L-shaped side wing."""
    main_w = int(w * 0.62)
    main_x = x + w - main_w
    roof_h = int(h * 0.26)
    # Main body roof
    d.polygon([(main_x - 4, y + roof_h), (main_x + main_w // 2, y),
               (main_x + main_w + 4, y + roof_h)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Side wing (smaller, attached left)
    wing_w = w - main_w
    wing_h = int(h * 0.74)
    wing_y = y + (h - wing_h)
    wing_roof_h = int(wing_h * 0.34)
    d.polygon([(x - 2, wing_y + wing_roof_h),
               (x + wing_w // 2, wing_y),
               (x + wing_w + 2, wing_y + wing_roof_h)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Wing body
    d.rectangle([x + 2, wing_y + wing_roof_h, x + wing_w + 2, y + h],
                fill=body_color, outline=C["wood_dark"], width=1)
    # Wing window
    d.rectangle([x + 8, wing_y + wing_roof_h + 6,
                 x + wing_w - 4, wing_y + wing_roof_h + 18],
                fill=C["window"], outline=C["wood_dark"], width=1)
    # Main body
    d.rectangle([main_x - 2, y + roof_h, main_x + main_w + 2, y + h],
                fill=body_color, outline=C["wood_dark"], width=1)
    # Main body upper floor windows (3)
    for i in range(3):
        wx0 = main_x + 4 + i * ((main_w - 8) // 3)
        d.rectangle([wx0 + 2, y + roof_h + 6, wx0 + (main_w - 8) // 3 - 2,
                     y + roof_h + 22],
                    fill=C["window"], outline=C["wood_dark"], width=1)
    # Floor band
    d.line([(main_x, y + roof_h + 28), (main_x + main_w, y + roof_h + 28)],
           fill=C["wood_dark"], width=1)
    # Door + 2 lower windows on main body
    dw = 14
    d.rectangle([main_x + main_w // 2 - dw // 2, y + h - 22,
                 main_x + main_w // 2 + dw // 2, y + h], fill=C["door_dark"])
    d.rectangle([main_x + 6, y + roof_h + 34, main_x + 22, y + h - 14],
                fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([main_x + main_w - 22, y + roof_h + 34, main_x + main_w - 6, y + h - 14],
                fill=C["window"], outline=C["wood_dark"], width=1)


def stilt_house(d, x, y, w, h, roof_color, body_color=(216, 178, 126)):
    """Small house raised on wooden poles. Good for beach edge."""
    pole_h = int(h * 0.32)
    body_top = y
    body_bot = y + h - pole_h
    # Poles
    d.rectangle([x + 6, body_bot - 2, x + 10, y + h], fill=C["wood_dark"])
    d.rectangle([x + w - 10, body_bot - 2, x + w - 6, y + h], fill=C["wood_dark"])
    d.rectangle([x + w // 2 - 2, body_bot - 2, x + w // 2 + 2, y + h], fill=C["wood_dark"])
    # Diagonals
    d.line([(x + 8, body_bot), (x + w // 2, y + h - 4)], fill=C["wood_dark"], width=1)
    d.line([(x + w - 8, body_bot), (x + w // 2, y + h - 4)], fill=C["wood_dark"], width=1)
    # Roof
    d.polygon([(x - 2, body_top + 18), (x + w // 2, body_top),
               (x + w + 2, body_top + 18)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Body
    d.rectangle([x + 2, body_top + 18, x + w - 2, body_bot],
                fill=body_color, outline=C["wood_dark"], width=1)
    # Window + door
    d.rectangle([x + 6, body_top + 24, x + 16, body_top + 36],
                fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 14, body_top + 24, x + w - 4, body_bot],
                fill=C["door_dark"])
    # Ladder up
    for i in range(3):
        d.line([(x + 14, y + h - 2 - i * (pole_h // 3)),
                (x + 22, y + h - 2 - i * (pole_h // 3))],
               fill=C["wood_dark"], width=1)


def round_hut(d, x, y, w, h, roof_color, body_color=(216, 178, 126)):
    """Round-bodied hut with conical thatch roof."""
    # Conical roof
    d.polygon([(x, y + int(h * 0.5)), (x + w // 2, y), (x + w, y + int(h * 0.5))],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Round body via wide ellipse
    d.ellipse([x, y + int(h * 0.4), x + w, y + h],
              fill=body_color, outline=C["wood_dark"], width=1)
    # Door (arched)
    d.chord([x + w // 2 - 7, y + h - 18, x + w // 2 + 7, y + h],
            180, 360, fill=C["door_dark"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w // 2 - 7, y + h - 8, x + w // 2 + 7, y + h], fill=C["door_dark"])
    # Tiny round windows
    d.ellipse([x + 8, y + int(h * 0.55), x + 16, y + int(h * 0.55) + 8],
              fill=C["window"], outline=C["wood_dark"], width=1)
    d.ellipse([x + w - 16, y + int(h * 0.55), x + w - 8, y + int(h * 0.55) + 8],
              fill=C["window"], outline=C["wood_dark"], width=1)


def cottage(d, x, y, w, h, roof_color, body_color=(216, 178, 126), door=True, windows=True, smoke=False, label=None):
    d.polygon([(x, y + h * 0.4), (x + w // 2, y), (x + w, y + h * 0.4)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    bx1, by1, bx2, by2 = x + 3, y + int(h * 0.4), x + w - 3, y + h
    d.rectangle([bx1, by1, bx2, by2], fill=body_color, outline=C["wood_dark"], width=1)
    if door:
        dw = max(6, w // 6)
        d.rectangle([x + w // 2 - dw // 2, by2 - int(h * 0.4),
                     x + w // 2 + dw // 2, by2], fill=C["door_dark"])
    if windows and w >= 32:
        ww = max(5, w // 8)
        wh = max(5, h // 6)
        d.rectangle([bx1 + 3, by1 + 4, bx1 + 3 + ww, by1 + 4 + wh],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        d.rectangle([bx2 - 3 - ww, by1 + 4, bx2 - 3, by1 + 4 + wh],
                    fill=C["window"], outline=C["wood_dark"], width=1)
    if smoke:
        d.rectangle([x + w - int(w * 0.3), y + 2, x + w - int(w * 0.3) + 4, y + 14], fill=C["wood_dark"])
        cx = x + w - int(w * 0.3) + 2
        for cy, cr in [(y - 4, 5), (y - 14, 6), (y - 25, 7)]:
            d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=C["smoke"])
    if label:
        d.text((x + w // 2, y + h + 12), label, font=load_font(10), fill=C["text"], anchor="mm")


def shop(d, x, y, w, h, roof_color, sign_text, icon=None, awning=None, label_below=None):
    """A small commercial building with an awning, sign over door, and an
    optional icon on the door / window (drawn as a small symbol)."""
    # Roof
    d.polygon([(x, y + 22), (x + w // 2, y), (x + w, y + 22)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Body
    bx1, by1, bx2, by2 = x + 4, y + 22, x + w - 4, y + h
    d.rectangle([bx1, by1, bx2, by2], fill=(232, 208, 168), outline=C["wood_dark"], width=1)
    # Big shopfront window
    d.rectangle([bx1 + 4, by1 + 6, bx1 + (w - 8) // 2 - 2, by2 - 18],
                fill=C["window"], outline=C["wood_dark"], width=1)
    # Door
    d.rectangle([bx1 + (w - 8) // 2 + 2, by1 + 8, bx2 - 4, by2 - 4],
                fill=C["door_dark"])
    # Awning above window
    if awning:
        ax1, ay1 = bx1 + 2, by1 + 4
        ax2 = bx1 + (w - 8) // 2 + 0
        d.polygon([(ax1, ay1), (ax2, ay1), (ax2 - 2, ay1 + 8), (ax1 + 2, ay1 + 8)],
                  fill=awning, outline=C["wood_dark"], width=1)
        # Stripes
        for sx in range(int(ax1) + 4, int(ax2) - 2, 5):
            d.line([(sx, ay1), (sx - 2, ay1 + 8)], fill=(255, 255, 255), width=1)
    # Sign over door
    sw = max(20, w // 2 - 4)
    sx0 = bx2 - sw - 4
    d.rectangle([sx0, y + 14, sx0 + sw, y + 28],
                fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((sx0 + sw // 2, y + 21), sign_text, font=load_font(8, bold=True),
           fill=C["text"], anchor="mm")
    # Tiny icon on the awning area
    if icon:
        ix = bx1 + (w - 8) // 4
        iy = by1 + 14
        d.text((ix, iy), icon, font=load_font(13, bold=True), fill=C["text"], anchor="mm")
    if label_below:
        d.text((x + w // 2, y + h + 10), label_below, font=load_font(9), fill=C["text"], anchor="mm")


def npc(d, x, y, cloak, hat=None, scale=1.0):
    """A small townsfolk figure. (x,y) = ground point under figure."""
    bw = int(7 * scale)
    bh = int(11 * scale)
    hr = int(4 * scale)
    # Body (cloak)
    d.ellipse([x - bw, y - bh + 2, x + bw, y + bh // 2], fill=cloak, outline=C["wood_dark"], width=1)
    # Head
    head_y = y - bh - hr + 4
    d.ellipse([x - hr, head_y - hr, x + hr, head_y + hr],
              fill=C["skin_light"], outline=C["wood_dark"], width=1)
    if hat == "cone":
        d.polygon([(x - hr, head_y - hr + 1), (x, head_y - hr - 8), (x + hr, head_y - hr + 1)],
                  fill=cloak, outline=C["wood_dark"], width=1)
    elif hat == "brim":
        d.ellipse([x - hr - 2, head_y - hr - 2, x + hr + 2, head_y - hr + 1],
                  fill=C["wood_dark"])
        d.rectangle([x - hr, head_y - hr - 5, x + hr, head_y - hr - 1], fill=cloak)
    elif hat == "kid":
        # smaller head, hat-less, but bouncy
        pass


def well(d, x, y):
    d.ellipse([x - 11, y - 4, x + 11, y + 10], fill=C["well_stone"], outline=C["stone_dark"], width=2)
    d.ellipse([x - 6, y - 1, x + 6, y + 7], fill=C["well_water"], outline=(58, 107, 140), width=1)
    d.rectangle([x - 10, y - 24, x - 7, y - 4], fill=C["wood_dark"])
    d.rectangle([x + 7, y - 24, x + 10, y - 4], fill=C["wood_dark"])
    d.polygon([(x - 14, y - 24), (x, y - 32), (x + 14, y - 24)],
              fill=C["roof_brown"], outline=C["wood_dark"], width=1)


def bench(d, x, y):
    d.rectangle([x - 12, y - 2, x + 12, y + 1], fill=C["wood"], outline=C["wood_dark"], width=1)
    d.rectangle([x - 11, y + 1, x - 9, y + 6], fill=C["wood_dark"])
    d.rectangle([x + 9, y + 1, x + 11, y + 6], fill=C["wood_dark"])


def fence(d, x1, y1, x2, y2):
    length = math.hypot(x2 - x1, y2 - y1)
    n = max(2, int(length / 8))
    for i in range(n + 1):
        t = i / n
        x = x1 + (x2 - x1) * t
        y = y1 + (y2 - y1) * t
        d.rectangle([x - 1, y - 6, x + 1, y + 4], fill=C["fence"])
    d.line([(x1, y1 - 2), (x2, y2 - 2)], fill=C["fence"], width=1)


def veggie_plot(d, x, y, w, h):
    d.rectangle([x, y, x + w, y + h], fill=C["dirt_patch"], outline=C["wood_dark"], width=1)
    for ry in range(y + 4, y + h - 2, 6):
        d.line([(x + 3, ry), (x + w - 3, ry)], fill=(120, 92, 56), width=1)
    for _ in range(int(w * h / 40)):
        vx = x + RNG.randint(4, w - 4)
        vy = y + RNG.randint(4, h - 4)
        col = RNG.choice([C["veg_dark"], C["veg_light"], (211, 78, 78), (231, 188, 88)])
        d.ellipse([vx - 1, vy - 1, vx + 2, vy + 2], fill=col)


def oak_tree(d, x, y, scale=1.0):
    r = int(14 * scale)
    d.rectangle([x - 2, y + r - 2, x + 2, y + r + 8], fill=C["wood_dark"])
    d.ellipse([x - r, y - r, x + r, y + r], fill=C["tree_oak"], outline=C["tree_oak_dark"], width=1)
    d.ellipse([x - r + 4, y - r + 2, x - 2, y - 2], fill=C["tree_pine_inner"])
    d.ellipse([x, y - r + 1, x + r - 3, y - r // 2 + 3], fill=C["tree_pine_inner"])


def hay_bale(d, x, y):
    d.ellipse([x - 9, y - 6, x + 9, y + 6], fill=C["hay"], outline=C["hay_dark"], width=1)
    for i in range(-7, 8, 4):
        d.line([(x + i, y - 5), (x + i, y + 5)], fill=C["hay_dark"], width=1)


def wood_pile(d, x, y):
    for ox, oy in [(0, 0), (6, 0), (3, -5), (12, 0), (9, -5)]:
        d.ellipse([x + ox - 3, y + oy - 3, x + ox + 3, y + oy + 3],
                  fill=C["wood"], outline=C["wood_dark"], width=1)
        d.ellipse([x + ox - 1, y + oy - 1, x + ox + 1, y + oy + 1], fill=C["wood_dark"])


def signpost(d, x, y, text):
    d.rectangle([x - 1, y - 16, x + 1, y - 2], fill=C["wood_dark"])
    d.rectangle([x - 22, y - 18, x + 22, y - 6], fill=C["cobble"], outline=C["wood_dark"], width=1)
    d.text((x, y - 12), text, font=load_font(8, bold=True), fill=C["text"], anchor="mm")


def bazaar_stall(d, x, y, w, h, awning_color, item_color):
    """Larger market stall used by the bazaar row."""
    # Frame posts
    d.rectangle([x, y + 4, x + 3, y + h], fill=C["wood_dark"])
    d.rectangle([x + w - 3, y + 4, x + w, y + h], fill=C["wood_dark"])
    # Awning (striped)
    d.polygon([(x - 4, y + 4), (x + w + 4, y + 4), (x + w + 2, y + 18), (x - 2, y + 18)],
              fill=awning_color, outline=C["wood_dark"], width=1)
    for sx in range(int(x), int(x + w), 6):
        d.line([(sx, y + 4), (sx + 2, y + 18)], fill=(255, 255, 255), width=1)
    # Counter
    d.rectangle([x + 4, y + 18, x + w - 4, y + h - 14],
                fill=C["wood"], outline=C["wood_dark"], width=1)
    # Items on counter (3 dots)
    for i in range(3):
        ix = x + 8 + i * ((w - 16) // 3)
        d.ellipse([ix - 3, y + h - 28, ix + 3, y + h - 22],
                  fill=item_color, outline=C["wood_dark"], width=1)
    # Display board on top
    d.rectangle([x + 6, y - 4, x + w - 6, y + 4],
                fill=C["label_bg"], outline=C["wood_dark"], width=1)


# ============================================================================
# WATER + ATMOSPHERE
# ============================================================================

def draw_waterfall_and_river(d):
    d.polygon([(1080, 90), (1200, 80), (1280, 110), (1260, 230), (1080, 230)],
              fill=(138, 138, 138), outline=(69, 69, 69), width=2)
    d.polygon([(1200, 80), (1310, 100), (1300, 230), (1260, 230)],
              fill=(155, 155, 155), outline=(69, 69, 69), width=2)
    d.rectangle([1140, 110, 1190, 250], fill=C["waterfall"], outline=C["waterfall_blue"], width=1)
    d.rectangle([1148, 110, 1182, 250], fill=C["waterfall_blue"])
    for mx, my, mr in [(1130, 252, 7), (1155, 262, 9), (1175, 260, 8), (1195, 252, 7)]:
        d.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(255, 255, 255, 200))
    d.ellipse([1110, 260, 1220, 285], fill=C["river_light"], outline=(58, 107, 140), width=1)
    d.ellipse([1158, 268, 1164, 274], fill=C["lantern_glow"], outline=(122, 92, 32))
    text_shadow(d, (1180, 70), "Waterfall Cascade", load_font(17, bold=True),
                (28, 72, 112), anchor="mm")
    text_shadow(d, (1180, 90), "river's source · hidden coin", load_font(10),
                (28, 72, 112), anchor="mm")
    river_path = [
        (1165, 285), (1130, 360), (1085, 440), (1060, 530), (1080, 620),
        (1120, 700), (1180, 760), (1260, 800), (1340, 820),
    ]
    for i in range(len(river_path) - 1):
        d.line([river_path[i], river_path[i + 1]], fill=C["river"], width=34)
    for i in range(len(river_path) - 1):
        d.line([river_path[i], river_path[i + 1]], fill=C["river_light"], width=22)
    for rx, ry in [(1115, 400), (1075, 480), (1075, 580), (1110, 660), (1170, 740), (1240, 800)]:
        d.arc([rx - 7, ry - 3, rx + 7, ry + 3], 0, 180, fill=(255, 255, 255), width=2)


def draw_bridge(d):
    bx, by = 1020, 460
    d.chord([bx, by - 8, bx + 100, by + 36], 180, 360,
            fill=(120, 90, 60), outline=C["wood_dark"], width=2)
    d.rectangle([bx, by + 20, bx + 100, by + 32], fill=(184, 152, 117), outline=(111, 77, 46), width=2)
    d.rectangle([bx + 6, by + 8, bx + 12, by + 26], fill=(111, 77, 46))
    d.rectangle([bx + 88, by + 8, bx + 94, by + 26], fill=(111, 77, 46))
    d.text((bx + 50, by + 46), "Stone Bridge", font=load_font(11, bold=True),
           fill=C["text"], anchor="mm")


def draw_cherry_grove(d):
    d.ellipse([55, 90, 380, 320], fill=C["cherry_bg"], outline=C["cherry_dark"], width=2)
    sakura_positions = [
        (110, 140, 22), (160, 120, 24), (210, 135, 22), (260, 155, 23),
        (300, 175, 22), (330, 200, 22),
        (145, 175, 25), (200, 195, 23), (250, 205, 22),
        (115, 225, 22), (170, 240, 23), (225, 235, 22), (285, 230, 24), (320, 250, 23),
        (95, 175, 20), (90, 220, 19),
    ]
    for x, y, r in sakura_positions:
        d.rectangle([x - 2, y + r - 4, x + 2, y + r + 8], fill=C["wood_dark"])
        d.ellipse([x - r, y - r, x + r, y + r], fill=C["cherry_pink"], outline=C["cherry_dark"], width=1)
        d.ellipse([x - r + 4, y - r + 2, x + r - 4, y + r - 6], fill=C["cherry_pink_light"])
    for _ in range(35):
        px = RNG.randint(70, 360)
        py = RNG.randint(95, 310)
        d.ellipse([px - 2, py - 2, px + 2, py + 2], fill=C["cherry_pink"])
    sx, sy = 200, 215
    d.line([(sx - 6, sy - 14), (sx - 8, sy + 6)], fill=C["wood_dark"], width=2)
    d.line([(sx + 6, sy - 14), (sx + 8, sy + 6)], fill=C["wood_dark"], width=2)
    d.rectangle([sx - 10, sy + 6, sx + 10, sy + 11], fill=C["wood"], outline=C["wood_dark"], width=1)
    d.ellipse([250, 275, 280, 290], fill=(160, 154, 142), outline=(97, 90, 77), width=1)
    text_shadow(d, (210, 80), "Cherry Blossom Grove", load_font(18, bold=True),
                (122, 57, 87), anchor="mm")
    text_shadow(d, (210, 100), "sakura · swing · meditation",
                load_font(11), (122, 57, 87), anchor="mm")
    d.text((265, 302), "meditation stone", font=load_font(10), fill=C["text"], anchor="mm")


# ============================================================================
# 5 PORTFOLIO BUILDINGS (kept close, but slightly rebalanced for the
# squared plaza below)
# ============================================================================

def draw_atelier(d):
    x, y, w, h = 560, 160, 140, 120
    d.polygon([(x, y + 42), (x + w // 2, y), (x + w, y + 42)],
              fill=C["wood_dark"], outline=(40, 25, 16), width=2)
    d.rectangle([x + 6, y + 42, x + w - 6, y + h], fill=C["wood"], outline=C["wood_dark"], width=2)
    d.rectangle([x + w // 2 - 14, y + h - 38, x + w // 2 + 14, y + h], fill=C["door_dark"])
    d.rectangle([x + 22, y + 55, x + 44, y + 80], fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 44, y + 55, x + w - 22, y + 80], fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 36, y + 6, x + w - 26, y + 26], fill=C["wood_dark"])
    for cy, cr in [(y - 4, 8), (y - 18, 10), (y - 34, 12)]:
        d.ellipse([x + w - 32 - cr, cy - cr, x + w - 32 + cr, cy + cr], fill=C["smoke"])
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30],
                fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "THE ATELIER",
           font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "crafts on display",
           font=load_font(11), fill=C["text"], anchor="mm")


def draw_quest_board(d):
    x, y, w, h = 850, 180, 80, 64
    d.polygon([(x - 6, y), (x + w // 2, y - 14), (x + w + 6, y)], fill=C["wood_dark"])
    d.rectangle([x, y, x + w, y + h], fill=C["cobble"], outline=C["wood_dark"], width=2)
    d.rectangle([x + 6, y + 6, x + 26, y + 22], fill=(255, 248, 225), outline=C["wood_dark"], width=1)
    d.rectangle([x + 30, y + 4, x + 56, y + 24], fill=(253, 242, 200), outline=C["wood_dark"], width=1)
    d.rectangle([x + 6, y + 30, x + 72, y + 50], fill=(255, 248, 225), outline=C["wood_dark"], width=1)
    for ly in [11, 15, 19]:
        d.line([(x + 9, y + ly), (x + 22, y + ly)], fill=C["text"], width=1)
    for ly in [34, 39, 44]:
        d.line([(x + 9, y + ly), (x + 68, y + ly)], fill=C["text"], width=1)
    d.text((x + w // 2, y + h + 12), "Quest Board", font=load_font(11, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 24), "current vigils", font=load_font(9), fill=C["text"], anchor="mm")


def draw_vaults(d):
    x, y, w, h = 220, 480, 140, 120
    d.polygon([(x, y + 34), (x + w // 2, y - 4), (x + w, y + 34)],
              fill=(106, 106, 106), outline=(58, 58, 58), width=2)
    d.rectangle([x + 4, y + 34, x + w - 4, y + h], fill=C["stone"], outline=C["stone_dark"], width=2)
    for wx in [x + 16, x + 56, x + 96]:
        d.chord([wx, y + 56, wx + 20, y + 100], 180, 360,
                fill=(207, 214, 224), outline=C["stone_dark"], width=1)
        d.rectangle([wx, y + 78, wx + 20, y + 100],
                    fill=(207, 214, 224), outline=C["stone_dark"], width=1)
    d.rectangle([x + w // 2 - 12, y + h - 30, x + w // 2 + 12, y + h], fill=(42, 42, 42))
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30],
                fill=C["label_bg"], outline=C["stone_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "VAULTS",
           font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "of Whisperleaf · scrolls",
           font=load_font(11), fill=C["text"], anchor="mm")


def draw_forge(d):
    x, y, w, h = 1130, 410, 140, 110
    d.polygon([(x, y + 32), (x + w // 2, y - 4), (x + w, y + 32)],
              fill=(58, 35, 16), outline=(31, 18, 8), width=2)
    d.rectangle([x + 4, y + 32, x + w - 4, y + h], fill=(111, 74, 58), outline=(58, 35, 16), width=2)
    d.rectangle([x + 38, y + 64, x + 102, y + 92], fill=C["highlight"], outline=(164, 74, 31), width=2)
    d.rectangle([x + 46, y + 70, x + 94, y + 86], fill=(247, 208, 102))
    d.rectangle([x + w - 24, y - 6, x + w - 16, y + 12], fill=(58, 35, 16))
    for cy, cr in [(y - 16, 9), (y - 30, 10), (y - 46, 12)]:
        d.ellipse([x + w - 20 - cr, cy - cr, x + w - 20 + cr, cy + cr], fill=(122, 122, 122))
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30],
                fill=C["label_bg"], outline=(58, 35, 16), width=1)
    d.text((x + w // 2, y + h + 14), "EMBERS' FORGE",
           font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "weapons of trade",
           font=load_font(11), fill=C["text"], anchor="mm")


def draw_inn(d):
    """Hearthlight Inn — 2-storey tavern with upper guest rooms, hanging sign,
    visible hearth glow at ground level."""
    x, y, w, h = 540, 690, 170, 150
    body_color = (138, 90, 59)
    upper_color = (160, 110, 78)
    # Steep red roof
    roof_h = 40
    d.polygon([(x - 6, y + roof_h), (x + w // 2, y - 6), (x + w + 6, y + roof_h)],
              fill=C["roof_red"], outline=C["roof_dark_red"], width=2)
    # Chimney + smoke (continuous fireplace inside)
    d.rectangle([x + w - 36, y - 6, x + w - 24, y + 18], fill=(86, 64, 48))
    for cy, cr in [(y - 12, 6), (y - 22, 8), (y - 36, 10)]:
        d.ellipse([x + w - 30 - cr, cy - cr, x + w - 30 + cr, cy + cr], fill=C["smoke"])
    # Upper floor (overhanging, 4 guest-room windows + shutters)
    upper_h = 38
    d.rectangle([x - 4, y + roof_h, x + w + 4, y + roof_h + upper_h],
                fill=upper_color, outline=C["wood_dark"], width=2)
    # Horizontal beam between floors
    d.line([(x - 4, y + roof_h + upper_h), (x + w + 4, y + roof_h + upper_h)],
           fill=C["wood_dark"], width=2)
    # 4 upper-floor windows w/ tiny shutters
    win_w, win_h = 22, 22
    for i in range(4):
        wx = x + 8 + i * ((w - 16) // 4)
        wy = y + roof_h + 8
        d.rectangle([wx, wy, wx + win_w, wy + win_h],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        # Shutters
        d.rectangle([wx - 4, wy, wx - 1, wy + win_h], fill=C["roof_red"], outline=C["wood_dark"], width=1)
        d.rectangle([wx + win_w + 1, wy, wx + win_w + 4, wy + win_h], fill=C["roof_red"], outline=C["wood_dark"], width=1)
        # Cross window-frame
        d.line([(wx + win_w // 2, wy), (wx + win_w // 2, wy + win_h)], fill=C["wood_dark"], width=1)
        d.line([(wx, wy + win_h // 2), (wx + win_w, wy + win_h // 2)], fill=C["wood_dark"], width=1)
    # Ground floor
    g_y = y + roof_h + upper_h
    d.rectangle([x + 4, g_y, x + w - 4, y + h], fill=body_color, outline=C["wood_dark"], width=2)
    # Ground floor big window
    d.rectangle([x + 10, g_y + 6, x + 50, y + h - 16],
                fill=C["window"], outline=C["wood_dark"], width=1)
    # Cross frame
    d.line([(x + 30, g_y + 6), (x + 30, y + h - 16)], fill=C["wood_dark"], width=1)
    d.line([(x + 10, g_y + (y + h - 16 - g_y - 6) // 2 + 6),
            (x + 50, g_y + (y + h - 16 - g_y - 6) // 2 + 6)], fill=C["wood_dark"], width=1)
    # Hearth/fireplace inside (visible through arch)
    h_x = x + w // 2 - 18
    h_y = g_y + 6
    d.rectangle([h_x, h_y, h_x + 36, h_y + 24], fill=C["wood_dark"])
    d.ellipse([h_x + 8, h_y + 6, h_x + 28, h_y + 22], fill=C["highlight"])
    d.ellipse([h_x + 12, h_y + 10, h_x + 24, h_y + 20], fill=(255, 224, 130))
    # Double doors (wider for tavern)
    door_w = 24
    d.rectangle([x + w // 2 - door_w // 2, y + h - 28,
                 x + w // 2 + door_w // 2, y + h], fill=C["wood_dark"])
    d.line([(x + w // 2, y + h - 28), (x + w // 2, y + h)],
           fill=(38, 24, 12), width=1)
    # Right window (storeroom)
    d.rectangle([x + w - 50, g_y + 6, x + w - 10, y + h - 16],
                fill=C["window"], outline=C["wood_dark"], width=1)
    d.line([(x + w - 30, g_y + 6), (x + w - 30, y + h - 16)], fill=C["wood_dark"], width=1)
    # Hanging signpost out front (wrought-iron arm)
    post_x = x - 24
    d.rectangle([post_x - 2, y + h - 56, post_x + 2, y + h], fill=(58, 36, 24))
    d.line([(post_x + 2, y + h - 48), (post_x + 24, y + h - 48)],
           fill=(58, 36, 24), width=2)
    d.line([(post_x + 24, y + h - 48), (post_x + 24, y + h - 28)],
           fill=(58, 36, 24), width=2)
    d.rectangle([post_x + 6, y + h - 30, post_x + 42, y + h - 8],
                fill=C["roof_red"], outline=C["roof_dark_red"], width=1)
    d.text((post_x + 24, y + h - 19), "INN", font=load_font(10, bold=True),
           fill=C["text_light"], anchor="mm")
    # Name plate below
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30],
                fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "HEARTHLIGHT INN",
           font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "road's chapters",
           font=load_font(11), fill=C["text"], anchor="mm")


def draw_windmill(d):
    wx, wy = 750, 740
    d.polygon([(wx, wy + 70), (wx + 36, wy + 70), (wx + 32, wy), (wx + 4, wy)],
              fill=C["stone"], outline=C["stone_dark"], width=2)
    d.rectangle([wx + 14, wy + 42, wx + 22, wy + 70], fill=C["wood_dark"])
    bx, by = wx + 18, wy - 4
    d.rectangle([bx - 2, by - 32, bx + 2, by + 32], fill=C["wood_dark"])
    d.rectangle([bx - 32, by - 2, bx + 32, by + 2], fill=C["wood_dark"])
    d.polygon([(bx - 2, by - 30), (bx - 2, by - 6), (bx - 26, by - 6)], fill=C["window"])
    d.polygon([(bx + 2, by - 30), (bx + 2, by - 6), (bx + 26, by - 6)], fill=C["window"])
    d.polygon([(bx - 2, by + 30), (bx - 2, by + 6), (bx - 26, by + 6)], fill=C["window"])
    d.polygon([(bx + 2, by + 30), (bx + 2, by + 6), (bx + 26, by + 6)], fill=C["window"])
    d.text((wx + 18, wy + 90), "Windmill", font=load_font(10), fill=C["text"], anchor="mm")


def draw_clock_tower(d):
    x, y, w, h = 1010, 650, 70, 150
    d.rectangle([x, y, x + w, y + h], fill=(124, 124, 124), outline=C["stone_dark"], width=2)
    d.polygon([(x - 4, y), (x + w // 2, y - 28), (x + w + 4, y)],
              fill=(90, 58, 48), outline=(58, 26, 24), width=2)
    cx, cy = x + w // 2, y + 26
    d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=C["label_bg"], outline=C["stone_dark"], width=2)
    d.line([(cx, cy), (cx, cy - 12)], fill=C["text"], width=2)
    d.line([(cx, cy), (cx + 9, cy + 4)], fill=C["text"], width=2)
    d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=C["text"])
    d.chord([x + 8, y + h - 38, x + w - 8, y + h], 180, 360,
            fill=(28, 20, 16), outline=C["stone_dark"], width=2)
    d.rectangle([x + 8, y + h - 18, x + w - 8, y + h], fill=(28, 20, 16))
    for ox, oy, r in [(0, -8, 3), (-8, -6, 2), (8, -8, 2)]:
        d.ellipse([cx + ox - r, y + h + oy - r, cx + ox + r, y + h + oy + r], fill=(168, 224, 248))
    d.text((cx, y + h + 14), "Clock Tower", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    d.text((cx, y + h + 28), "walk-through underpass ↓", font=load_font(10), fill=C["text"], anchor="mm")


def draw_beacon(d):
    bx, by = 1240, 770
    d.polygon([(bx, by), (bx + 44, by), (bx + 40, by + 100), (bx + 4, by + 100)],
              fill=(224, 224, 224), outline=C["stone_dark"], width=2)
    d.rectangle([bx + 4, by + 24, bx + 40, by + 40], fill=C["roof_red"])
    d.rectangle([bx + 4, by + 60, bx + 40, by + 70], fill=C["roof_red"])
    d.rectangle([bx + 10, by - 20, bx + 34, by], fill=C["stone_dark"])
    d.polygon([(bx + 6, by - 20), (bx + 38, by - 20), (bx + 32, by - 32), (bx + 12, by - 32)],
              fill=C["stone_dark"])
    d.polygon([(bx + 22, by - 14), (bx - 28, by - 50), (bx - 52, by - 22)], fill=(249, 231, 168))
    d.polygon([(bx + 22, by - 14), (bx + 70, by - 50), (bx + 92, by - 22)], fill=(249, 231, 168))
    d.ellipse([bx + 19, by - 18, bx + 25, by - 12], fill=(255, 245, 184))
    d.text((bx + 22, by + 120), "BEACON", font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((bx + 22, by + 134), "of Distant Roads", font=load_font(11), fill=C["text"], anchor="mm")


# ============================================================================
# THE TOWN SQUARE — actual square (~equal sides), enclosed on 4 sides,
# central bell tower, internal pathways with turns.
# ============================================================================

# Plaza interior bounds
PLAZA = (460, 460, 720, 720)  # x1, y1, x2, y2  -- 260 wide x 260 tall


def draw_town_square_plaza(d):
    """The square stone plaza with internal pathways forming a + with turns."""
    x1, y1, x2, y2 = PLAZA
    # Outer plaza floor (lighter)
    d.rectangle([x1 - 8, y1 - 8, x2 + 8, y2 + 8],
                fill=C["plaza_dark"], outline=C["wood_dark"], width=2)
    d.rectangle([x1, y1, x2, y2], fill=C["plaza"], outline=C["wood_dark"], width=1)

    # Internal cross paths
    cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
    d.rectangle([x1, cy - 14, x2, cy + 14], fill=C["plaza_dark"])
    d.rectangle([cx - 14, y1, cx + 14, y2], fill=C["plaza_dark"])
    # "Turn" detours: small angled offshoots
    d.polygon([(x1 + 40, cy - 14), (x1 + 60, cy - 34), (x1 + 80, cy - 14)], fill=C["plaza_dark"])
    d.polygon([(x2 - 40, cy + 14), (x2 - 60, cy + 34), (x2 - 80, cy + 14)], fill=C["plaza_dark"])
    d.polygon([(cx - 14, y1 + 40), (cx - 34, y1 + 60), (cx - 14, y1 + 80)], fill=C["plaza_dark"])
    d.polygon([(cx + 14, y2 - 40), (cx + 34, y2 - 60), (cx + 14, y2 - 80)], fill=C["plaza_dark"])

    # Dashed inner border
    for tx in range(x1 + 14, x2 - 14, 14):
        d.rectangle([tx, y1 + 6, tx + 7, y1 + 8], fill=(255, 255, 255))
        d.rectangle([tx, y2 - 8, tx + 7, y2 - 6], fill=(255, 255, 255))
    for ty in range(y1 + 14, y2 - 14, 14):
        d.rectangle([x1 + 6, ty, x1 + 8, ty + 7], fill=(255, 255, 255))
        d.rectangle([x2 - 8, ty, x2 - 6, ty + 7], fill=(255, 255, 255))

    # 4 corner lanterns
    for lx, ly in [(x1 + 14, y1 + 14), (x2 - 14, y1 + 14),
                   (x1 + 14, y2 - 14), (x2 - 14, y2 - 14)]:
        d.rectangle([lx - 1, ly - 16, lx + 1, ly - 4], fill=C["wood_dark"])
        d.polygon([(lx - 6, ly - 24), (lx + 6, ly - 24), (lx + 7, ly - 14), (lx - 7, ly - 14)],
                  fill=C["lantern_glow"], outline=C["wood_dark"], width=1)

    # Fountain SW of center (so bell tower can sit centre/NE)
    fx, fy = cx - 56, cy + 30
    d.ellipse([fx - 30, fy - 30, fx + 30, fy + 30], fill=C["fountain"], outline=(58, 107, 140), width=2)
    d.ellipse([fx - 11, fy - 11, fx + 11, fy + 11], fill=(155, 208, 235), outline=(58, 107, 140), width=1)
    d.ellipse([fx - 3, fy - 3, fx + 3, fy + 3], fill=(255, 255, 255))
    # Two benches near fountain
    bench(d, fx - 50, fy + 30)
    bench(d, fx + 50, fy + 30)

    # Mayor figure near fountain
    mx, my = fx + 38, fy
    d.ellipse([mx - 9, my - 5, mx + 9, my + 13], fill=C["npc_green"], outline=(42, 63, 34), width=2)
    d.ellipse([mx - 5, my - 13, mx + 5, my - 3], fill=C["skin_light"], outline=(58, 36, 24), width=1)
    d.text((mx, my + 28), "Mayor Halden", font=load_font(11, bold=True), fill=C["text"], anchor="mm")

    # Title — placed on the south road (open side) so plaza shops don't cover it.
    d.rectangle([cx - 90, y2 + 16, cx + 90, y2 + 40], fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((cx, y2 + 28), "TOWN SQUARE", font=load_font(15, bold=True), fill=C["text"], anchor="mm")
    d.text((cx, y2 + 52), "enclosed plaza · bell tower · paths w/ turns",
           font=load_font(10), fill=C["text"], anchor="mm")


def draw_bell_tower(d):
    """Central bell tower at the NE quadrant of the plaza. Distinct shape
    from the SE clock tower."""
    x1, y1, x2, y2 = PLAZA
    cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
    # Base footprint at NE quadrant
    bx, by = cx + 18, cy - 90
    bw, bh = 70, 110
    # Tower body
    d.rectangle([bx, by, bx + bw, by + bh], fill=C["stone"], outline=C["stone_dark"], width=2)
    # Open belfry near top (arched window pairs)
    d.chord([bx + 8, by + 10, bx + bw - 8, by + 48], 180, 360,
            fill=(58, 58, 58), outline=C["stone_dark"], width=1)
    d.rectangle([bx + 8, by + 30, bx + bw - 8, by + 48], fill=(58, 58, 58))
    # Bell hanging in belfry
    bell_cx = bx + bw // 2
    bell_cy = by + 38
    d.line([(bell_cx, by + 8), (bell_cx, bell_cy - 6)], fill=C["bell_dark"], width=1)
    d.polygon([(bell_cx - 10, bell_cy - 6), (bell_cx + 10, bell_cy - 6),
               (bell_cx + 8, bell_cy + 8), (bell_cx - 8, bell_cy + 8)],
              fill=C["bell_brass"], outline=C["bell_dark"], width=1)
    d.ellipse([bell_cx - 10, bell_cy + 6, bell_cx + 10, bell_cy + 12],
              fill=C["bell_brass"], outline=C["bell_dark"], width=1)
    d.ellipse([bell_cx - 1, bell_cy + 10, bell_cx + 1, bell_cy + 14], fill=C["bell_dark"])
    # Door at base
    d.rectangle([bx + bw // 2 - 8, by + bh - 22, bx + bw // 2 + 8, by + bh], fill=C["door_dark"])
    # Stripe trim
    d.rectangle([bx, by + 60, bx + bw, by + 66], fill=(126, 126, 126))
    # Spire — pointed top (different from clock tower's sloped triangular roof)
    spire_h = 50
    d.polygon([(bx - 4, by), (bx + bw // 2, by - spire_h), (bx + bw + 4, by)],
              fill=C["roof_red"], outline=C["roof_dark_red"], width=2)
    # Finial cross/orb
    d.line([(bx + bw // 2, by - spire_h), (bx + bw // 2, by - spire_h - 12)],
           fill=C["bell_dark"], width=2)
    d.ellipse([bx + bw // 2 - 4, by - spire_h - 16, bx + bw // 2 + 4, by - spire_h - 8],
              fill=C["bell_brass"], outline=C["bell_dark"], width=1)
    # Flag tied to spire
    d.polygon([(bx + bw // 2, by - spire_h - 4),
               (bx + bw // 2 + 14, by - spire_h - 1),
               (bx + bw // 2, by - spire_h + 6)],
              fill=C["roof_red"], outline=C["roof_dark_red"], width=1)
    # Label
    d.text((bx + bw // 2, by + bh + 12), "Bell Tower",
           font=load_font(11, bold=True), fill=C["text"], anchor="mm")


# ============================================================================
# SHOPS ENCLOSING THE PLAZA + BAZAAR ROW (the business center)
# ============================================================================

def draw_plaza_shops(d):
    """6 named shops + flank along all 4 sides of the plaza."""
    x1, y1, x2, y2 = PLAZA
    # ---- NORTH side (above the plaza) ----
    # Bakery + Herbalist + Tailor sit along the north strip, y = y1 - 70..y1 - 8
    shop(d, x1 + 8, y1 - 72, 78, 64, C["roof_ochre"], "BAKERY", icon="🍞", awning=C["roof_red"])
    shop(d, x1 + 96, y1 - 72, 78, 64, C["roof_green_grey"], "HERBS", icon="🌿", awning=(180, 196, 120))
    shop(d, x1 + 184, y1 - 72, 78, 64, C["roof_violet"], "TAILOR", icon="✂", awning=(168, 132, 192))

    # ---- WEST side ----
    shop(d, x1 - 96, y1 + 8, 80, 64, C["roof_blue_grey"], "SCRIBE", icon="✒", awning=(132, 152, 196))
    shop(d, x1 - 96, y1 + 100, 80, 64, C["roof_brown"], "COBBLER", icon="👢", awning=(196, 152, 110))
    shop(d, x1 - 96, y1 + 192, 80, 64, C["roof_violet"], "POTIONS", icon="🧪", awning=(196, 196, 110))

    # South stays open as the welcome road (player spawn lives there).

    # ---- BAZAAR ROW (east edge, 4 stalls — sized to fit between plaza and Inn) ----
    bx_start = x2 + 14
    by_top = y1 + 6
    stall_w, stall_h = 60, 60
    awnings = [
        (C["roof_red"],     (231, 188, 88)),
        (C["roof_teal"],    (220, 90, 90)),
        (C["roof_violet"],  (212, 188, 92)),
        (C["roof_ochre"],   (120, 196, 196)),
    ]
    for i, (aw, item) in enumerate(awnings):
        bazaar_stall(d, bx_start, by_top + i * (stall_h + 6), stall_w, stall_h, aw, item)
    # Bazaar label
    text_shadow(d, (bx_start + stall_w // 2, by_top - 18),
                "BAZAAR", load_font(13, bold=True), C["text_light"], anchor="mm")
    d.text((bx_start + stall_w // 2, by_top + 4 * (stall_h + 6) + 6),
           "open-air market", font=load_font(9), fill=C["text"], anchor="mm")


# ============================================================================
# FILLER HOUSES (the residential ring)
# ============================================================================

def filler_houses():
    """Each placement: (kind, x, y, w, h, roof_idx, body_idx, smoke).
    kind = "cottage" | "two_story" | "tower" | "manor" | "stilt" | "round" """
    palette_roofs = [
        C["roof_brown"], C["roof_red"], C["roof_blue_grey"],
        C["roof_green_grey"], C["roof_ochre"], C["wood_dark"], C["roof_teal"],
    ]
    palette_bodies = [
        (216, 178, 126), (230, 200, 150), (200, 168, 122),
        (218, 192, 144), (232, 208, 168), (188, 152, 108),
    ]
    placements = [
        # North hamlet (varied)
        ("cottage",   380, 200, 60, 50, 0, 1, True),
        ("two_story", 440, 165, 64, 95, 1, 0, False),     # taller townhouse
        ("manor",     820, 220, 110, 70, 3, 3, False),    # small manor on rise
        ("tower",     360, 320, 36, 96, 5, 1, True),      # 3-storey tower-house

        # East bank cluster (across river near Forge)
        ("two_story", 1140, 270, 70, 96, 0, 0, True),
        ("cottage",   1270, 320, 56, 46, 1, 2, False),
        ("round",     1190, 560, 60, 60, 2, 4, False),    # round hut
        ("cottage",   1290, 600, 56, 46, 3, 1, True),

        # West cluster (around Vaults)
        ("two_story", 80, 450, 70, 96, 0, 3, False),
        ("cottage",   170, 410, 56, 46, 4, 0, True),
        ("manor",     90, 570, 110, 70, 1, 1, False),
        ("tower",     220, 620, 32, 86, 2, 2, True),

        # Southern outskirts
        ("cottage",   60, 740, 60, 50, 0, 0, False),
        ("two_story", 380, 700, 64, 96, 3, 4, True),
        ("stilt",     820, 820, 56, 70, 1, 2, False),     # near beach edge
        ("cottage",   900, 880, 56, 46, 0, 3, False),
        ("cottage",   440, 800, 56, 46, 4, 0, False),
        ("round",     730, 820, 56, 58, 2, 1, True),
    ]
    out = []
    for kind, x, y, w, h, ri, bi, smoke in placements:
        out.append((kind, x, y, w, h, palette_roofs[ri % len(palette_roofs)],
                    palette_bodies[bi % len(palette_bodies)], smoke))
    return out


def draw_filler_houses(d):
    for kind, x, y, w, h, roof, body, smoke in filler_houses():
        if kind == "two_story":
            two_story(d, x, y, w, h, roof, body, smoke=smoke)
        elif kind == "tower":
            tower_house(d, x, y, w, h, roof, body, smoke=smoke)
        elif kind == "manor":
            manor(d, x, y, w, h, roof, body)
        elif kind == "stilt":
            stilt_house(d, x, y, w, h, roof, body)
        elif kind == "round":
            round_hut(d, x, y, w, h, roof, body)
        else:
            cottage(d, x, y, w, h, roof, body, door=True, windows=True, smoke=smoke)


def draw_weird_houses(d):
    """The five distinct dwellings on the south lane. No on-map text labels —
    each house is identifiable by its props alone, so the visitor *discovers*
    them rather than reads them off the map."""
    # 1) Cat Lady's low cottage with porch (cats reveal it)
    cottage(d, 80, 730, 70, 60, C["roof_red"], body_color=(220, 184, 134), smoke=False)
    cats = [(160, 140, 112), (58, 36, 24), (188, 188, 188), (196, 106, 58), (255, 255, 255)]
    for i, col in enumerate(cats):
        cx = 92 + i * 12
        d.ellipse([cx - 3, 785, cx + 3, 791], fill=col, outline=(58, 36, 24), width=1)
    # A second cat lounging on the roof
    d.ellipse([108, 740, 116, 746], fill=(196, 106, 58), outline=(58, 36, 24), width=1)

    # 2) Inventor — tower-house with pipes & smoke (tall narrow building)
    tower_house(d, 188, 700, 38, 110, C["roof_brown"], (212, 168, 120), smoke=True)
    # Copper pipes & extra smoke puffs along its side
    d.rectangle([218, 760, 222, 776], fill=(184, 124, 64))
    d.rectangle([224, 750, 228, 770], fill=(184, 124, 64))
    d.ellipse([214, 754, 226, 766], fill=(168, 168, 168))
    # Whirring gear contraption outside
    d.ellipse([236, 790, 252, 806], fill=C["bell_brass"], outline=C["bell_dark"], width=1)
    for ang in range(0, 360, 60):
        ex = 244 + int(7 * math.cos(math.radians(ang)))
        ey = 798 + int(7 * math.sin(math.radians(ang)))
        d.rectangle([ex - 1, ey - 1, ex + 1, ey + 1], fill=C["bell_dark"])

    # 3) Painter's cottage with easels outside (wide front)
    cottage(d, 268, 730, 78, 60, C["roof_ochre"], body_color=(232, 200, 152), smoke=False)
    # Three easels in front
    for ex in [276, 304, 332]:
        d.rectangle([ex, 798, ex + 12, 814],
                    fill=RNG.choice([(248, 196, 124), (152, 188, 220), (212, 152, 188)]),
                    outline=C["wood_dark"], width=1)
        d.line([(ex + 2, 814), (ex - 4, 824)], fill=C["wood_dark"], width=1)
        d.line([(ex + 10, 814), (ex + 16, 824)], fill=C["wood_dark"], width=1)

    # 4) Hermit's hut — round hut tucked at the edge with dim windows
    round_hut(d, 360, 740, 52, 70, C["wood_dark"], (188, 152, 108))
    # Replace small round windows with dim (already drawn — overpaint)
    d.ellipse([368, 778, 376, 786], fill=(58, 42, 28), outline=C["wood_dark"], width=1)
    d.ellipse([400, 778, 408, 786], fill=(58, 42, 28), outline=C["wood_dark"], width=1)
    # A small fire pit + figure sitting beside
    d.ellipse([420, 810, 432, 818], fill=(54, 36, 24), outline=C["wood_dark"], width=1)
    d.ellipse([424, 808, 428, 812], fill=C["highlight"])
    d.ellipse([438, 806, 446, 814], fill=(58, 36, 24))  # hermit figure

    # 5) Music Hut — small round hut with painted note-door + chiptune notes drifting
    round_hut(d, 458, 740, 56, 64, (180, 112, 153), body_color=(232, 200, 200))
    d.text((484, 786), "♪", font=load_font(15, bold=True), fill=(164, 74, 144), anchor="mm")
    d.text((472, 790), "♫", font=load_font(10), fill=(164, 74, 144), anchor="mm")
    d.text((494, 792), "♬", font=load_font(11), fill=(164, 74, 144), anchor="mm")
    # Notes drifting up out the chimney
    d.text((478, 720), "♪", font=load_font(10), fill=(164, 74, 144), anchor="mm")
    d.text((492, 706), "♫", font=load_font(9), fill=(164, 74, 144), anchor="mm")


# ============================================================================
# SCATTER DECORATIONS
# ============================================================================

def draw_inner_trees(d):
    spots = [
        (440, 380, 1.0), (430, 420, 0.9),
        (160, 380, 0.9), (110, 360, 1.0),
        (920, 600, 1.0), (940, 640, 0.9),
        (370, 670, 0.9), (60, 660, 1.0),
        (1200, 660, 1.0), (1230, 700, 0.9),
        (1050, 880, 0.9),
        (720, 880, 0.9),
        (340, 830, 0.9), (300, 870, 0.8),
        (550, 880, 0.9),
        (980, 290, 0.9), (1010, 320, 0.9),
        (840, 380, 0.9),
    ]
    for x, y, s in spots:
        oak_tree(d, x, y, s)


def draw_wells(d):
    for x, y in [(150, 540), (1240, 480), (180, 750), (900, 770)]:
        well(d, x, y)


def draw_benches_out(d):
    for x, y in [(160, 510), (180, 720), (390, 410), (940, 480), (820, 870)]:
        bench(d, x, y)


def draw_veggie_gardens(d):
    for x, y, w, h in [
        (94, 670, 60, 38),
        (200, 690, 64, 32),
        (730, 690, 70, 38),
        (1240, 540, 60, 36),
    ]:
        veggie_plot(d, x, y, w, h)


def draw_fences(d):
    segments = [
        (90, 715, 160, 715), (90, 715, 90, 740), (160, 715, 160, 740),
        (200, 730, 270, 730), (200, 730, 200, 750), (270, 730, 270, 750),
        (730, 730, 810, 730), (730, 730, 730, 750), (810, 730, 810, 750),
        (1240, 580, 1310, 580), (1240, 580, 1240, 600), (1310, 580, 1310, 600),
    ]
    for x1, y1, x2, y2 in segments:
        fence(d, x1, y1, x2, y2)


def draw_misc_props(d):
    for x, y in [(700, 800), (740, 820), (260, 800)]:
        hay_bale(d, x, y)
    for x, y in [(140, 730), (810, 770), (1240, 690)]:
        wood_pile(d, x, y)
    signpost(d, 870, 480, "→ FORGE")
    signpost(d, 340, 700, "↓ LANE")
    signpost(d, 980, 740, "→ BEACH")


# ============================================================================
# NPCs — people scattered around town
# ============================================================================

def draw_people(d):
    """About 20 townsfolk + visitors placed where people actually gather."""
    # Fountain crowd (4 around it, browsing market stalls inside plaza)
    fx, fy = (PLAZA[0] + PLAZA[2]) // 2 - 56, (PLAZA[1] + PLAZA[3]) // 2 + 30
    npc(d, fx - 36, fy - 4, C["npc_blue"])
    npc(d, fx + 28, fy - 8, C["npc_red"], hat="brim")
    npc(d, fx - 10, fy + 38, C["npc_brown"])
    npc(d, fx + 12, fy + 42, C["npc_violet"])

    # Bazaar shoppers (along east bazaar)
    npc(d, 778, 480, C["npc_teal"])
    npc(d, 798, 540, C["npc_ochre"], hat="brim")
    npc(d, 780, 620, C["npc_green"])
    npc(d, 802, 700, C["npc_red"])

    # North shops crowd
    npc(d, 520, 400, C["npc_brown"], hat="cone")
    npc(d, 612, 396, C["npc_blue"])
    npc(d, 700, 402, C["npc_violet"])

    # South shops + Inn area
    npc(d, 484, 800, C["npc_green"])
    npc(d, 614, 808, C["npc_brown"])
    npc(d, 720, 820, C["npc_red"], hat="kid", scale=0.7)  # kid running

    # Vaults entrance
    npc(d, 280, 620, C["npc_blue"], hat="brim")

    # Forge approach
    npc(d, 1180, 540, C["npc_red"])
    npc(d, 1100, 470, C["npc_brown"])

    # Atelier door
    npc(d, 620, 400, C["npc_violet"])

    # Cherry grove meditator (sitting at swing)
    npc(d, 200, 230, C["npc_green"])

    # Dock anglers
    npc(d, 906, 880, C["npc_blue"], hat="brim")
    npc(d, 932, 880, C["npc_ochre"])

    # Gardener in veggie patch
    npc(d, 760, 720, C["npc_brown"], hat="brim")

    # Path walker on western lane
    npc(d, 320, 660, C["npc_teal"])

    # Beacon visitor
    npc(d, 1260, 880, C["npc_red"])


# ============================================================================
# WINDING PATHS connecting major nodes (around the plaza, not through it)
# ============================================================================

def winding(start, end, jitter=12, segs=10):
    x0, y0 = start
    x1, y1 = end
    dx, dy = x1 - x0, y1 - y0
    length = math.hypot(dx, dy) or 1
    px, py = -dy / length, dx / length
    pts = []
    for i in range(segs + 1):
        t = i / segs
        x = x0 + dx * t
        y = y0 + dy * t
        bump = math.sin(t * math.pi) * RNG.uniform(-jitter, jitter)
        pts.append((x + px * bump, y + py * bump))
    return pts


def draw_paths(d):
    """Paths approach the plaza from each side but do not cross it
    (internal plaza paths are drawn separately in draw_town_square_plaza)."""
    routes = [
        # Atelier -> square N-edge
        ((630, 390), (590, 460)),
        # Quest board -> plaza N
        ((780, 340), (640, 460)),
        # Vaults -> plaza W-edge
        ((360, 540), (460, 540)),
        # Plaza E (past bazaar) -> bridge
        ((820, 540), (1020, 480)),
        # Bridge -> Forge
        ((1120, 480), (1200, 460)),
        # Plaza S-edge -> Inn area
        ((620, 720), (620, 700)),
        # Square -> west cluster
        ((460, 540), (200, 690)),
        # Inn area -> clock tower
        ((700, 830), (1030, 800)),
        # Clock tower -> beach
        ((1045, 800), (1045, 860)),
        # West lane connector
        ((220, 800), (430, 800)),
        # Lane -> inn
        ((430, 800), (540, 830)),
    ]
    for a, b in routes:
        pts = winding(a, b, jitter=10, segs=10)
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=C["path_dark"], width=18)
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=C["path"], width=14)


def draw_player_spawn(d):
    sx, sy = 830, 760
    d.rectangle([sx - 1, sy - 16, sx + 1, sy - 2], fill=C["wood_dark"])
    d.rectangle([sx - 30, sy - 18, sx + 30, sy - 4], fill=C["cobble"], outline=(111, 67, 33), width=1)
    d.text((sx, sy - 11), "AETHERVEIL", font=load_font(9, bold=True), fill=C["text"], anchor="mm")
    px, py = sx, sy + 18
    d.ellipse([px - 9, py - 4, px + 9, py + 14], fill=(90, 74, 138), outline=(58, 42, 106), width=2)
    d.ellipse([px - 5, py - 12, px + 5, py - 2], fill=C["skin_light"], outline=C["text"], width=1)
    text_shadow(d, (px, py + 30), "YOU (spawn)", load_font(10, bold=True), C["text_light"], anchor="mm")


def draw_beach_and_sea(d):
    d.rectangle([46, 880, W - 46, 930], fill=C["sand"])
    d.rectangle([46, 880, W - 46, 892], fill=C["sand_dark"])
    for sx, sc in [(140, (245, 182, 196)), (300, (231, 224, 195)), (520, (196, 202, 215)),
                   (810, (245, 216, 176)), (970, (255, 217, 230)), (1130, (212, 234, 224))]:
        d.ellipse([sx - 5, 905, sx + 5, 913], fill=sc, outline=C["text"], width=1)
    for gx in range(90, W - 80, 86):
        d.line([(gx, 900), (gx - 3, 893)], fill=(122, 138, 58), width=1)
        d.line([(gx, 900), (gx + 3, 893)], fill=(122, 138, 58), width=1)
    dx, dy = 880, 884
    d.rectangle([dx, dy, dx + 90, dy + 20], fill=(156, 122, 74), outline=C["wood_dark"], width=2)
    for px in [dx + 10, dx + 35, dx + 60, dx + 84]:
        d.line([(px, dy), (px, dy + 20)], fill=C["wood_dark"], width=1)
    d.line([(dx + 86, dy), (dx + 112, dy - 26)], fill=C["wood_dark"], width=2)
    d.line([(dx + 112, dy - 26), (dx + 120, dy + 20)], fill=(255, 255, 255), width=1)
    d.ellipse([dx + 117, dy + 16, dx + 123, dy + 22], fill=(245, 182, 196), outline=C["text"], width=1)
    d.text((dx + 45, dy + 38), "Fishing Dock", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    d.rectangle([46, 930, W - 46, H], fill=C["sea"])
    d.rectangle([46, 930, W - 46, 938], fill=C["sea_light"])
    for ry in [950, 962, 974]:
        for rx in range(60, W - 60, 24):
            d.arc([rx, ry - 2, rx + 12, ry + 2], 180, 360, fill=(255, 255, 255), width=1)


# ============================================================================
# OVERLAYS
# ============================================================================

def draw_compass(d):
    cx, cy, r = W - 80, 100, 28
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255), outline=C["text"], width=2)
    d.polygon([(cx, cy - 24), (cx - 6, cy), (cx + 6, cy)],
              fill=C["roof_red"], outline=(122, 31, 31), width=1)
    d.polygon([(cx, cy + 24), (cx - 4, cy), (cx + 4, cy)],
              fill=(251, 233, 227), outline=(122, 31, 31), width=1)
    d.text((cx, cy - 13), "N", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    d.text((cx, cy + 15), "S", font=load_font(10), fill=C["text"], anchor="mm")
    d.text((cx - 18, cy), "W", font=load_font(10), fill=C["text"], anchor="mm")
    d.text((cx + 18, cy), "E", font=load_font(10), fill=C["text"], anchor="mm")


def draw_legend(d):
    x, y, w, h = 56, 940, 360, 56
    d.rectangle([x, y, x + w, y + h], fill=C["legend_bg"], outline=(111, 67, 33), width=2)
    d.text((x + w // 2, y + 10), "Legend", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    rows = [
        (C["wood"], "portfolio building"),
        ((216, 178, 126), "house / shop"),
        (C["path"], "cobblestone path"),
        (C["river"], "river / water"),
        (C["sand"], "sand / beach"),
        (C["forest"], "forest border"),
        ((232, 208, 168), "plaza shop"),
        (C["bell_brass"], "bell tower"),
    ]
    for i, (color, label) in enumerate(rows):
        col = i % 4
        row = i // 4
        rx = x + 12 + col * 86
        ry = y + 22 + row * 14
        d.rectangle([rx, ry, rx + 12, ry + 8], fill=color, outline=C["text"], width=1)
        d.text((rx + 16, ry + 4), label, font=load_font(9), fill=C["text"], anchor="lm")


def draw_title(d):
    text_shadow(d, (W // 2, 24), "AETHERVEIL VALLEY", load_font(22, bold=True), C["text_light"], anchor="mm")
    text_shadow(d, (W // 2, 44), "overworld design map · 80 × 60 tiles @ 32 px · single Phaser scene",
                load_font(11), C["text_light"], anchor="mm")


# ============================================================================
# MAIN
# ============================================================================

def main() -> int:
    img = Image.new("RGB", (W, H), C["grass_light"])
    d = ImageDraw.Draw(img)

    draw_base_ground(d)
    draw_forest_border(d)

    draw_paths(d)
    draw_inner_trees(d)

    draw_waterfall_and_river(d)
    draw_bridge(d)

    draw_cherry_grove(d)

    draw_filler_houses(d)

    draw_wells(d)
    draw_benches_out(d)
    draw_veggie_gardens(d)
    draw_fences(d)
    draw_misc_props(d)

    # Named portfolio buildings around the plaza
    draw_atelier(d)
    draw_quest_board(d)
    draw_vaults(d)
    draw_forge(d)
    draw_inn(d)
    draw_windmill(d)
    draw_clock_tower(d)

    # THE PLAZA & ITS BUSINESS CENTER
    draw_town_square_plaza(d)
    draw_plaza_shops(d)
    draw_bell_tower(d)

    draw_weird_houses(d)
    draw_player_spawn(d)

    # PEOPLE
    draw_people(d)

    draw_beach_and_sea(d)
    draw_beacon(d)

    draw_compass(d)
    draw_legend(d)
    draw_title(d)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, format="PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB, {W}x{H})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
