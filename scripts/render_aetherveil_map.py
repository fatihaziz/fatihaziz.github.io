#!/usr/bin/env python3
"""Render the Aetherveil Valley design map to PNG via Pillow.

v2 — denser, town-like: 5 portfolio buildings clustered near the square,
5 named weird houses + ~18 anonymous filler cottages staggered in
neighborhoods, winding paths, wells/benches/fences/veggie plots/tree
clusters scattered. Goal: looks like a place where people live.

Output: docs/spec/assets/aetherveil-map.png (1400x1000).
Re-run any time the map design changes.

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

RNG = random.Random(1729)  # fixed seed for reproducibility

C = {
    "grass_light": (158, 195, 112),
    "grass_dark": (127, 167, 85),
    "grass_patch": (172, 207, 122),
    "dirt_patch": (164, 138, 96),
    "forest": (58, 107, 61),
    "forest_dark": (39, 74, 42),
    "path": (177, 142, 92),
    "path_dark": (122, 92, 48),
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
# BASE LAYERS
# ============================================================================

def draw_base_ground(d):
    """Grass with subtle variation patches for texture."""
    for y in range(H):
        t = y / H
        r = int(C["grass_light"][0] * (1 - t) + C["grass_dark"][0] * t)
        g = int(C["grass_light"][1] * (1 - t) + C["grass_dark"][1] * t)
        b = int(C["grass_light"][2] * (1 - t) + C["grass_dark"][2] * t)
        d.line([(0, y), (W, y)], fill=(r, g, b))
    # Patches of slightly different grass tones
    for _ in range(45):
        cx = RNG.randint(60, W - 60)
        cy = RNG.randint(60, H - 250)
        r = RNG.randint(35, 70)
        d.ellipse([cx - r, cy - r // 2, cx + r, cy + r // 2], fill=C["grass_patch"])


def draw_forest_border(d):
    """Dark green strips on top + left + right, with pine triangles for texture."""
    d.rectangle([0, 0, W, 56], fill=C["forest"])
    d.rectangle([0, 0, 46, H - 220], fill=C["forest"])
    d.rectangle([W - 46, 0, W, H - 220], fill=C["forest"])
    for x in range(22, W - 22, 36):
        d.polygon([(x, 14), (x - 10, 50), (x + 10, 50)], fill=C["forest_dark"])
    for y in range(78, H - 220, 52):
        d.polygon([(16, y), (4, y + 30), (28, y + 30)], fill=C["forest_dark"])
        d.polygon([(W - 16, y), (W - 28, y + 30), (W - 4, y + 30)], fill=C["forest_dark"])


# ============================================================================
# GENERIC HOUSE / PROP DRAWERS (used by all clusters)
# ============================================================================

def cottage(d, x, y, w, h, roof_color, body_color=(216, 178, 126), door=True, windows=True, smoke=False, label=None):
    """A small cottage. (x, y) is top of roof tip."""
    # Roof
    d.polygon([(x, y + h * 0.4), (x + w // 2, y), (x + w, y + h * 0.4)],
              fill=roof_color, outline=C["wood_dark"], width=1)
    # Body
    bx1, by1, bx2, by2 = x + 3, y + int(h * 0.4), x + w - 3, y + h
    d.rectangle([bx1, by1, bx2, by2], fill=body_color, outline=C["wood_dark"], width=1)
    if door:
        dw = max(6, w // 6)
        d.rectangle([x + w // 2 - dw // 2, by2 - int(h * 0.4),
                     x + w // 2 + dw // 2, by2], fill=C["door_dark"])
    if windows and w >= 32:
        ww = max(5, w // 8)
        wh = max(5, h // 6)
        # left
        d.rectangle([bx1 + 3, by1 + 4, bx1 + 3 + ww, by1 + 4 + wh],
                    fill=C["window"], outline=C["wood_dark"], width=1)
        # right
        d.rectangle([bx2 - 3 - ww, by1 + 4, bx2 - 3, by1 + 4 + wh],
                    fill=C["window"], outline=C["wood_dark"], width=1)
    if smoke:
        # Chimney + puffs
        d.rectangle([x + w - int(w * 0.3), y + 2, x + w - int(w * 0.3) + 4, y + 14], fill=C["wood_dark"])
        cx = x + w - int(w * 0.3) + 2
        for cy, cr in [(y - 4, 5), (y - 14, 6), (y - 25, 7)]:
            d.ellipse([cx - cr, cy - cr, cx + cr, cy + cr], fill=C["smoke"])
    if label:
        d.text((x + w // 2, y + h + 12), label, font=load_font(10), fill=C["text"], anchor="mm")


def well(d, x, y, label=False):
    """Stone well."""
    d.ellipse([x - 11, y - 4, x + 11, y + 10], fill=C["well_stone"], outline=C["stone_dark"], width=2)
    d.ellipse([x - 6, y - 1, x + 6, y + 7], fill=C["well_water"], outline=(58, 107, 140), width=1)
    # roof posts + roof
    d.rectangle([x - 10, y - 24, x - 7, y - 4], fill=C["wood_dark"])
    d.rectangle([x + 7, y - 24, x + 10, y - 4], fill=C["wood_dark"])
    d.polygon([(x - 14, y - 24), (x, y - 32), (x + 14, y - 24)], fill=C["roof_brown"], outline=C["wood_dark"], width=1)
    if label:
        d.text((x, y + 16), "well", font=load_font(9), fill=C["text"], anchor="mm")


def bench(d, x, y):
    """Wooden bench."""
    d.rectangle([x - 12, y - 2, x + 12, y + 1], fill=C["wood"], outline=C["wood_dark"], width=1)
    d.rectangle([x - 11, y + 1, x - 9, y + 6], fill=C["wood_dark"])
    d.rectangle([x + 9, y + 1, x + 11, y + 6], fill=C["wood_dark"])


def fence(d, x1, y1, x2, y2):
    """Picket fence as repeating verticals."""
    length = math.hypot(x2 - x1, y2 - y1)
    n = max(2, int(length / 8))
    for i in range(n + 1):
        t = i / n
        x = x1 + (x2 - x1) * t
        y = y1 + (y2 - y1) * t
        d.rectangle([x - 1, y - 6, x + 1, y + 4], fill=C["fence"])
    d.line([(x1, y1 - 2), (x2, y2 - 2)], fill=C["fence"], width=1)


def veggie_plot(d, x, y, w, h):
    """Tilled vegetable patch."""
    d.rectangle([x, y, x + w, y + h], fill=C["dirt_patch"], outline=C["wood_dark"], width=1)
    # Rows
    for ry in range(y + 4, y + h - 2, 6):
        d.line([(x + 3, ry), (x + w - 3, ry)], fill=(120, 92, 56), width=1)
    # Veggies (dots)
    for _ in range(int(w * h / 40)):
        vx = x + RNG.randint(4, w - 4)
        vy = y + RNG.randint(4, h - 4)
        col = RNG.choice([C["veg_dark"], C["veg_light"], (211, 78, 78), (231, 188, 88)])
        d.ellipse([vx - 1, vy - 1, vx + 2, vy + 2], fill=col)


def oak_tree(d, x, y, scale=1.0):
    """Round leafy tree."""
    r = int(14 * scale)
    d.rectangle([x - 2, y + r - 2, x + 2, y + r + 8], fill=C["wood_dark"])
    d.ellipse([x - r, y - r, x + r, y + r], fill=C["tree_oak"], outline=C["tree_oak_dark"], width=1)
    d.ellipse([x - r + 4, y - r + 2, x - 2, y - 2], fill=C["tree_pine_inner"])
    d.ellipse([x, y - r + 1, x + r - 3, y - r // 2 + 3], fill=C["tree_pine_inner"])


def hay_bale(d, x, y):
    """Round hay bale."""
    d.ellipse([x - 9, y - 6, x + 9, y + 6], fill=C["hay"], outline=C["hay_dark"], width=1)
    for i in range(-7, 8, 4):
        d.line([(x + i, y - 5), (x + i, y + 5)], fill=C["hay_dark"], width=1)


def wood_pile(d, x, y):
    """Stack of logs (end-on)."""
    for ox, oy, r in [(0, 0, 3), (6, 0, 3), (3, -5, 3), (12, 0, 3), (9, -5, 3)]:
        d.ellipse([x + ox - r, y + oy - r, x + ox + r, y + oy + r], fill=C["wood"], outline=C["wood_dark"], width=1)
        d.ellipse([x + ox - 1, y + oy - 1, x + ox + 1, y + oy + 1], fill=C["wood_dark"])


def signpost(d, x, y, text):
    """Wooden signpost with arrow."""
    d.rectangle([x - 1, y - 16, x + 1, y - 2], fill=C["wood_dark"])
    d.rectangle([x - 22, y - 18, x + 22, y - 6], fill=C["cobble"], outline=C["wood_dark"], width=1)
    d.text((x, y - 12), text, font=load_font(8, bold=True), fill=C["text"], anchor="mm")


# ============================================================================
# NAMED FEATURES
# ============================================================================

def draw_cherry_grove(d):
    """NW pink grove with sakura dots, swing, meditation stone, hermit's hut."""
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
    # Petals scattered
    for _ in range(35):
        px = RNG.randint(70, 360)
        py = RNG.randint(95, 310)
        d.ellipse([px - 2, py - 2, px + 2, py + 2], fill=C["cherry_pink"])
    # Swing
    sx, sy = 200, 215
    d.line([(sx - 6, sy - 14), (sx - 8, sy + 6)], fill=C["wood_dark"], width=2)
    d.line([(sx + 6, sy - 14), (sx + 8, sy + 6)], fill=C["wood_dark"], width=2)
    d.rectangle([sx - 10, sy + 6, sx + 10, sy + 11], fill=C["wood"], outline=C["wood_dark"], width=1)
    # Meditation stone
    d.ellipse([250, 275, 280, 290], fill=(160, 154, 142), outline=(97, 90, 77), width=1)
    # Labels
    text_shadow(d, (210, 80), "Cherry Blossom Grove", load_font(18, bold=True), (122, 57, 87), anchor="mm")
    text_shadow(d, (210, 100), "sakura · swing · meditation", load_font(11), (122, 57, 87), anchor="mm")
    d.text((265, 302), "meditation stone", font=load_font(10), fill=C["text"], anchor="mm")


def draw_waterfall_and_river(d):
    """NE waterfall + river ribbon flowing south then east into sea."""
    d.polygon([(1080, 90), (1200, 80), (1280, 110), (1260, 230), (1080, 230)],
              fill=(138, 138, 138), outline=(69, 69, 69), width=2)
    d.polygon([(1200, 80), (1310, 100), (1300, 230), (1260, 230)],
              fill=(155, 155, 155), outline=(69, 69, 69), width=2)
    # Waterfall stream
    d.rectangle([1140, 110, 1190, 250], fill=C["waterfall"], outline=C["waterfall_blue"], width=1)
    d.rectangle([1148, 110, 1182, 250], fill=C["waterfall_blue"])
    # Mist
    for mx, my, mr in [(1130, 252, 7), (1155, 262, 9), (1175, 260, 8), (1195, 252, 7)]:
        d.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(255, 255, 255, 200))
    # Pool
    d.ellipse([1110, 260, 1220, 285], fill=C["river_light"], outline=(58, 107, 140), width=1)
    d.ellipse([1158, 268, 1164, 274], fill=C["lantern_glow"], outline=(122, 92, 32))
    # Labels
    text_shadow(d, (1180, 70), "Waterfall Cascade", load_font(17, bold=True), (28, 72, 112), anchor="mm")
    text_shadow(d, (1180, 90), "river's source · hidden coin", load_font(10), (28, 72, 112), anchor="mm")
    # River path N -> S -> E into sea
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
    d.chord([bx, by - 8, bx + 100, by + 36], 180, 360, fill=(120, 90, 60), outline=C["wood_dark"], width=2)
    d.rectangle([bx, by + 20, bx + 100, by + 32], fill=(184, 152, 117), outline=(111, 77, 46), width=2)
    d.rectangle([bx + 6, by + 8, bx + 12, by + 26], fill=(111, 77, 46))
    d.rectangle([bx + 88, by + 8, bx + 94, by + 26], fill=(111, 77, 46))
    d.text((bx + 50, by + 46), "Stone Bridge", font=load_font(11, bold=True), fill=C["text"], anchor="mm")


# --- 5 portfolio buildings (clustered around town square) -------------------

def draw_atelier(d):
    x, y, w, h = 540, 270, 150, 120
    d.polygon([(x, y + 42), (x + w // 2, y), (x + w, y + 42)],
              fill=C["wood_dark"], outline=(40, 25, 16), width=2)
    d.rectangle([x + 6, y + 42, x + w - 6, y + h], fill=C["wood"], outline=C["wood_dark"], width=2)
    d.rectangle([x + w // 2 - 14, y + h - 38, x + w // 2 + 14, y + h], fill=C["door_dark"])
    d.rectangle([x + 22, y + 55, x + 44, y + 80], fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 44, y + 55, x + w - 22, y + 80], fill=C["window"], outline=C["wood_dark"], width=1)
    # Chimney smoke
    d.rectangle([x + w - 36, y + 6, x + w - 26, y + 26], fill=C["wood_dark"])
    for cy, cr in [(y - 4, 8), (y - 18, 10), (y - 34, 12)]:
        d.ellipse([x + w - 32 - cr, cy - cr, x + w - 32 + cr, cy + cr], fill=C["smoke"])
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30], fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "THE ATELIER", font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "crafts on display", font=load_font(11), fill=C["text"], anchor="mm")


def draw_quest_board(d):
    x, y, w, h = 730, 290, 90, 70
    d.polygon([(x - 8, y), (x + w // 2, y - 16), (x + w + 8, y)], fill=C["wood_dark"])
    d.rectangle([x, y, x + w, y + h], fill=C["cobble"], outline=C["wood_dark"], width=2)
    d.rectangle([x + 8, y + 8, x + 30, y + 28], fill=(255, 248, 225), outline=C["wood_dark"], width=1)
    d.rectangle([x + 35, y + 6, x + 64, y + 30], fill=(253, 242, 200), outline=C["wood_dark"], width=1)
    d.rectangle([x + 8, y + 36, x + 80, y + 56], fill=(255, 248, 225), outline=C["wood_dark"], width=1)
    for ly in [14, 18, 23]:
        d.line([(x + 12, y + ly), (x + 26, y + ly)], fill=C["text"], width=1)
    for ly in [40, 45, 50]:
        d.line([(x + 12, y + ly), (x + 74, y + ly)], fill=C["text"], width=1)
    d.text((x + w // 2, y + h + 14), "Quest Board", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 28), "current vigils", font=load_font(10), fill=C["text"], anchor="mm")


def draw_vaults(d):
    x, y, w, h = 220, 480, 140, 120
    d.polygon([(x, y + 34), (x + w // 2, y - 4), (x + w, y + 34)],
              fill=(106, 106, 106), outline=(58, 58, 58), width=2)
    d.rectangle([x + 4, y + 34, x + w - 4, y + h], fill=C["stone"], outline=C["stone_dark"], width=2)
    for wx in [x + 16, x + 56, x + 96]:
        d.chord([wx, y + 56, wx + 20, y + 100], 180, 360, fill=(207, 214, 224), outline=C["stone_dark"], width=1)
        d.rectangle([wx, y + 78, wx + 20, y + 100], fill=(207, 214, 224), outline=C["stone_dark"], width=1)
    d.rectangle([x + w // 2 - 12, y + h - 30, x + w // 2 + 12, y + h], fill=(42, 42, 42))
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30], fill=C["label_bg"], outline=C["stone_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "VAULTS", font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "of Whisperleaf · scrolls", font=load_font(11), fill=C["text"], anchor="mm")


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
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30], fill=C["label_bg"], outline=(58, 35, 16), width=1)
    d.text((x + w // 2, y + h + 14), "EMBERS' FORGE", font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "weapons of trade", font=load_font(11), fill=C["text"], anchor="mm")


def draw_inn(d):
    x, y, w, h = 540, 700, 160, 130
    d.polygon([(x, y + 36), (x + w // 2, y - 4), (x + w, y + 36)],
              fill=C["roof_red"], outline=C["roof_dark_red"], width=2)
    d.rectangle([x + 6, y + 36, x + w - 6, y + h], fill=(138, 90, 59), outline=C["wood_dark"], width=2)
    # Hearth glow
    d.rectangle([x + w // 2 - 22, y + h - 50, x + w // 2 + 22, y + h - 20], fill=C["wood_dark"])
    d.ellipse([x + w // 2 - 8, y + h - 40, x + w // 2 + 8, y + h - 22], fill=C["highlight"])
    # Door + windows
    d.rectangle([x + w // 2 - 10, y + h - 20, x + w // 2 + 10, y + h], fill=C["wood_dark"])
    d.rectangle([x + 22, y + 56, x + 42, y + 78], fill=C["window"], outline=C["wood_dark"], width=1)
    d.rectangle([x + w - 42, y + 56, x + w - 22, y + 78], fill=C["window"], outline=C["wood_dark"], width=1)
    # Sign hanging in front
    d.line([(x + w // 2 - 10, y + h - 10), (x - 20, y + h - 10)], fill=C["wood_dark"], width=2)
    d.rectangle([x - 50, y + h - 22, x - 8, y + h - 4], fill=C["roof_red"], outline=C["roof_dark_red"], width=1)
    d.text((x - 29, y + h - 13), "INN", font=load_font(9, bold=True), fill=C["text_light"], anchor="mm")
    d.rectangle([x - 2, y + h + 6, x + w + 2, y + h + 30], fill=C["label_bg"], outline=C["wood_dark"], width=1)
    d.text((x + w // 2, y + h + 14), "HEARTHLIGHT INN", font=load_font(14, bold=True), fill=C["text"], anchor="mm")
    d.text((x + w // 2, y + h + 25), "road's chapters", font=load_font(11), fill=C["text"], anchor="mm")


def draw_windmill(d):
    wx, wy = 750, 740
    d.polygon([(wx, wy + 70), (wx + 36, wy + 70), (wx + 32, wy), (wx + 4, wy)],
              fill=C["stone"], outline=C["stone_dark"], width=2)
    d.rectangle([wx + 14, wy + 42, wx + 22, wy + 70], fill=C["wood_dark"])
    bx, by = wx + 18, wy - 4
    d.rectangle([bx - 2, by - 32, bx + 2, by + 32], fill=C["wood_dark"])
    d.rectangle([bx - 32, by - 2, bx + 32, by + 2], fill=C["wood_dark"])
    for px, py in [(bx - 2, by - 30), (bx + 2, by - 30), (bx - 2, by + 6), (bx - 30, by - 2)]:
        d.rectangle([px, py, px + 28, py + 22], fill=C["window"]) if False else None
    # 4 blade panels
    d.polygon([(bx - 2, by - 30), (bx - 2, by - 6), (bx - 26, by - 6)], fill=C["window"])
    d.polygon([(bx + 2, by - 30), (bx + 2, by - 6), (bx + 26, by - 6)], fill=C["window"])
    d.polygon([(bx - 2, by + 30), (bx - 2, by + 6), (bx - 26, by + 6)], fill=C["window"])
    d.polygon([(bx + 2, by + 30), (bx + 2, by + 6), (bx + 26, by + 6)], fill=C["window"])
    d.text((wx + 18, wy + 90), "Windmill", font=load_font(10), fill=C["text"], anchor="mm")


def draw_clock_tower(d):
    x, y, w, h = 1010, 650, 70, 150
    d.rectangle([x, y, x + w, y + h], fill=(124, 124, 124), outline=C["stone_dark"], width=2)
    d.polygon([(x - 4, y), (x + w // 2, y - 28), (x + w + 4, y)], fill=(90, 58, 48), outline=(58, 26, 24), width=2)
    cx, cy = x + w // 2, y + 26
    d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=C["label_bg"], outline=C["stone_dark"], width=2)
    d.line([(cx, cy), (cx, cy - 12)], fill=C["text"], width=2)
    d.line([(cx, cy), (cx + 9, cy + 4)], fill=C["text"], width=2)
    d.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=C["text"])
    d.chord([x + 8, y + h - 38, x + w - 8, y + h], 180, 360, fill=(28, 20, 16), outline=C["stone_dark"], width=2)
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
# TOWN SQUARE
# ============================================================================

def draw_town_square(d):
    x1, y1, x2, y2 = 460, 460, 780, 660
    d.rectangle([x1, y1, x2, y2], fill=C["cobble"], outline=C["path_dark"], width=2)
    # Inner border dashes
    for tx in range(x1 + 14, x2 - 14, 14):
        d.rectangle([tx, y1 + 6, tx + 7, y1 + 8], fill=(255, 255, 255))
        d.rectangle([tx, y2 - 8, tx + 7, y2 - 6], fill=(255, 255, 255))
    for ty in range(y1 + 14, y2 - 14, 14):
        d.rectangle([x1 + 6, ty, x1 + 8, ty + 7], fill=(255, 255, 255))
        d.rectangle([x2 - 8, ty, x2 - 6, ty + 7], fill=(255, 255, 255))
    fx, fy = (x1 + x2) // 2, (y1 + y2) // 2
    d.ellipse([fx - 32, fy - 32, fx + 32, fy + 32], fill=C["fountain"], outline=(58, 107, 140), width=2)
    d.ellipse([fx - 12, fy - 12, fx + 12, fy + 12], fill=(155, 208, 235), outline=(58, 107, 140), width=1)
    d.ellipse([fx - 3, fy - 3, fx + 3, fy + 3], fill=(255, 255, 255))
    mx, my = fx, fy + 50
    d.ellipse([mx - 9, my - 5, mx + 9, my + 13], fill=(74, 107, 58), outline=(42, 63, 34), width=2)
    d.ellipse([mx - 5, my - 13, mx + 5, my - 3], fill=(245, 216, 176), outline=(58, 36, 24), width=1)
    d.text((mx, my + 28), "Mayor Halden", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    # 4 market stalls (one each side now, more populated feel)
    stalls = [
        (x1 + 30, y1 + 24, C["roof_red"], "α"),
        (x2 - 60, y1 + 24, (74, 122, 144), "β"),
        (x1 + 30, y2 - 50, (122, 74, 144), "γ"),
        (x2 - 60, y2 - 50, (74, 144, 90), "δ"),
    ]
    for sx, sy, accent, lbl in stalls:
        d.rectangle([sx, sy, sx + 40, sy + 24], fill=(202, 167, 119), outline=(111, 67, 33), width=1)
        d.polygon([(sx - 4, sy), (sx + 20, sy - 14), (sx + 44, sy)], fill=accent, outline=(58, 36, 24), width=1)
        d.text((sx + 20, sy + 12), lbl, font=load_font(11, bold=True), fill=C["text"], anchor="mm")
    # Lantern posts
    for lx, ly in [(x1 + 14, y1 + 14), (x2 - 14, y1 + 14), (x1 + 14, y2 - 14), (x2 - 14, y2 - 14)]:
        d.rectangle([lx - 1, ly - 16, lx + 1, ly - 4], fill=C["wood_dark"])
        d.polygon([(lx - 6, ly - 24), (lx + 6, ly - 24), (lx + 7, ly - 14), (lx - 7, ly - 14)],
                  fill=C["lantern_glow"], outline=C["wood_dark"], width=1)
    # Benches around fountain
    bench(d, fx - 60, fy + 30)
    bench(d, fx + 60, fy + 30)
    text_shadow(d, ((x1 + x2) // 2, y1 - 22), "Town Square", load_font(22, bold=True), C["text_light"], anchor="mm")


# ============================================================================
# FILLER POPULATION — anonymous houses scattered around in CLUSTERS
# ============================================================================

# Each tuple: (x_top, y_top, w, h, roof_color, body_color, has_smoke)
def filler_houses():
    """Hand-placed anonymous cottages to make the town feel populated.
    Mixed sizes (50-80 wide) + varied roof colors, staggered (no straight row).
    """
    palette_roofs = [
        C["roof_brown"], C["roof_red"], C["roof_blue_grey"],
        C["roof_green_grey"], C["roof_ochre"], C["wood_dark"],
    ]
    palette_bodies = [
        (216, 178, 126), (230, 200, 150), (200, 168, 122),
        (218, 192, 144), (232, 208, 168), (188, 152, 108),
    ]

    placements = [
        # ---- North hamlet (between Atelier and forest, varied) ----
        (380, 200, 60, 50, 0, 1, True),    # NW of Atelier
        (450, 175, 56, 46, 1, 0, False),
        (700, 195, 70, 56, 2, 2, True),    # NE
        (850, 230, 60, 50, 3, 3, False),
        (380, 350, 68, 56, 5, 1, True),    # SW of Atelier

        # ---- East-bank hamlet (across the river near Forge) ----
        (1150, 280, 70, 56, 0, 0, True),
        (1280, 320, 56, 46, 1, 2, False),
        (1190, 560, 62, 52, 2, 4, False),
        (1290, 600, 56, 46, 3, 1, True),

        # ---- West cluster (around Vaults) ----
        (90, 460, 60, 50, 0, 3, False),
        (170, 410, 56, 46, 4, 0, True),
        (110, 580, 68, 56, 1, 1, False),
        (210, 640, 60, 50, 2, 2, True),

        # ---- Southern outskirts (mixed with residential lane) ----
        (60, 740, 60, 50, 0, 0, False),
        (380, 720, 56, 46, 3, 4, True),
        (450, 820, 60, 50, 5, 1, False),
        (820, 820, 60, 50, 1, 2, True),
        (900, 880, 56, 46, 0, 3, False),

        # ---- A few near the inn for density ----
        (440, 800, 56, 46, 4, 0, False),
        (730, 820, 60, 50, 2, 1, True),
    ]

    out = []
    for x, y, w, h, ri, bi, smoke in placements:
        out.append((x, y, w, h, palette_roofs[ri % len(palette_roofs)],
                    palette_bodies[bi % len(palette_bodies)], smoke))
    return out


def draw_filler_houses(d):
    for x, y, w, h, roof, body, smoke in filler_houses():
        cottage(d, x, y, w, h, roof, body, door=True, windows=True, smoke=smoke)


# ============================================================================
# WEIRD HOUSES (5 named, but now STAGGERED, not in a straight line)
# ============================================================================

def draw_weird_houses(d):
    """5 named cottages, varied y so they don't form a parade."""
    # Each: name, (x, y, w, h, roof)
    placements = [
        ("Cat Lady",   80, 720, 70, 58, C["roof_red"]),
        ("Inventor",  185, 760, 64, 54, C["roof_brown"]),
        ("Painter",   270, 720, 72, 60, C["roof_ochre"]),
        ("Hermit",    360, 780, 60, 50, C["wood_dark"]),
        ("Music Hut", 450, 720, 68, 56, (180, 112, 153)),
    ]
    for name, x, y, w, h, roof in placements:
        # Unique touches per house
        cottage(d, x, y, w, h, roof,
                body_color=(216, 178, 126),
                smoke=(name in ("Inventor", "Music Hut")), label=name)
    # Cat Lady cats on porch
    cats = [(160, 140, 112), (58, 36, 24), (188, 188, 188), (196, 106, 58), (255, 255, 255)]
    for i, col in enumerate(cats):
        cx = 92 + i * 12
        d.ellipse([cx - 3, 775, cx + 3, 781], fill=col, outline=(58, 36, 24), width=1)
    # Inventor pipes + extra smoke
    d.rectangle([200, 752, 204, 766], fill=(122, 90, 58))
    d.ellipse([195, 738, 209, 752], fill=(153, 153, 153))
    # Painter easels outside
    d.rectangle([268, 786, 276, 800], fill=(255, 255, 255), outline=C["text"], width=1)
    d.rectangle([336, 786, 344, 800], fill=(255, 255, 255), outline=C["text"], width=1)
    d.rectangle([268, 798, 270, 806], fill=C["wood_dark"])
    d.rectangle([342, 798, 344, 806], fill=C["wood_dark"])
    # Hermit figure outside
    d.ellipse([380, 824, 388, 832], fill=(58, 36, 24))
    # Music notes on door
    d.text((484, 752), "♪", font=load_font(14, bold=True), fill=(164, 74, 144), anchor="mm")
    d.text((472, 754), "♫", font=load_font(10), fill=(164, 74, 144), anchor="mm")
    # Cluster label (placed above so it doesn't overlap)
    text_shadow(d, (300, 700), "Residential Lane — Five Weird Houses",
                load_font(15, bold=True), C["text_light"], anchor="mm")


# ============================================================================
# SCATTER DECORATIONS — trees, wells, benches, fences, veggies, hay, wood
# ============================================================================

def draw_inner_trees(d):
    """Oak/pine clusters inside the valley (not just border) for texture."""
    spots = [
        (440, 380, 1.0), (430, 420, 0.9),
        (820, 380, 1.0), (840, 410, 0.9),
        (160, 380, 0.9), (110, 360, 1.0),
        (920, 600, 1.0), (940, 640, 0.9),
        (660, 220, 1.0), (680, 250, 0.9),
        (370, 670, 0.9), (60, 660, 1.0),
        (980, 290, 0.9), (1010, 320, 0.9),
        (1200, 660, 1.0), (1230, 700, 0.9),
        (1050, 880, 0.9),
        (720, 880, 0.9),
        (340, 830, 0.9), (300, 870, 0.8),
        (550, 880, 0.9),
    ]
    for x, y, s in spots:
        oak_tree(d, x, y, s)


def draw_wells(d):
    for x, y in [(150, 540), (820, 280), (1240, 480), (180, 750), (900, 770)]:
        well(d, x, y, label=False)


def draw_benches(d):
    for x, y in [(160, 510), (820, 380), (180, 720), (390, 410), (940, 480)]:
        bench(d, x, y)


def draw_veggie_gardens(d):
    for x, y, w, h in [
        (94, 670, 60, 38),     # near western cluster
        (200, 690, 64, 32),    # next door
        (730, 690, 70, 38),    # behind inn
        (1240, 540, 60, 36),   # east bank
        (440, 660, 50, 28),    # behind a stall (outside square)
    ]:
        veggie_plot(d, x, y, w, h)


def draw_fences(d):
    """Picket fence segments around gardens + house yards."""
    segments = [
        (90, 715, 160, 715), (90, 715, 90, 740), (160, 715, 160, 740),
        (200, 730, 270, 730), (200, 730, 200, 750), (270, 730, 270, 750),
        (730, 730, 810, 730), (730, 730, 730, 750), (810, 730, 810, 750),
        (1240, 580, 1310, 580), (1240, 580, 1240, 600), (1310, 580, 1310, 600),
    ]
    for x1, y1, x2, y2 in segments:
        fence(d, x1, y1, x2, y2)


def draw_misc_props(d):
    """Hay bales, wood piles, signposts scattered to add lived-in feel."""
    # Hay bales near windmill + farms
    for x, y in [(700, 800), (740, 820), (260, 800)]:
        hay_bale(d, x, y)
    # Wood piles
    for x, y in [(140, 730), (810, 770), (1240, 690)]:
        wood_pile(d, x, y)
    # Signposts (direction indicators)
    signpost(d, 460, 410, "→ SQUARE")
    signpost(d, 870, 480, "→ FORGE")
    signpost(d, 340, 700, "↓ LANE")
    signpost(d, 980, 740, "→ BEACH")


# ============================================================================
# CURVED PATHS (multi-segment, not straight)
# ============================================================================

def winding(start, end, jitter=24, segs=8):
    """Return a polyline of N segments between start and end with random sideways jitter."""
    x0, y0 = start
    x1, y1 = end
    dx, dy = x1 - x0, y1 - y0
    # Perpendicular unit
    length = math.hypot(dx, dy) or 1
    px, py = -dy / length, dx / length
    pts = []
    for i in range(segs + 1):
        t = i / segs
        # Smooth interpolation
        x = x0 + dx * t
        y = y0 + dy * t
        # Smooth jitter that's zero at both endpoints
        bump = math.sin(t * math.pi) * RNG.uniform(-jitter, jitter)
        pts.append((x + px * bump, y + py * bump))
    return pts


def draw_paths(d):
    """Winding paths connecting the major nodes."""
    routes = [
        ((615, 390), (620, 460)),    # Atelier -> square
        ((775, 360), (740, 460)),    # Quest board -> square
        ((360, 540), (460, 540)),    # Vaults -> square
        ((780, 540), (1020, 480)),   # square -> bridge
        ((1120, 480), (1200, 460)),  # bridge -> Forge
        ((620, 660), (620, 700)),    # square -> Inn area
        ((460, 540), (200, 690)),    # square -> west cluster
        ((700, 830), (1030, 800)),   # Inn area -> clock tower
        ((1045, 800), (1045, 860)),  # clock tower -> beach
        ((220, 800), (430, 800)),    # west lane connector
        ((430, 800), (540, 830)),    # lane -> inn
    ]
    for a, b in routes:
        pts = winding(a, b, jitter=12, segs=10)
        # Wide darker stroke first
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=C["path_dark"], width=18)
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=C["path"], width=14)


def draw_player_spawn(d):
    sx, sy = 620, 695
    d.rectangle([sx - 1, sy - 16, sx + 1, sy - 2], fill=C["wood_dark"])
    d.rectangle([sx - 30, sy - 18, sx + 30, sy - 4], fill=C["cobble"], outline=(111, 67, 33), width=1)
    d.text((sx, sy - 11), "AETHERVEIL", font=load_font(9, bold=True), fill=C["text"], anchor="mm")
    px, py = sx, sy + 18
    d.ellipse([px - 9, py - 4, px + 9, py + 14], fill=(90, 74, 138), outline=(58, 42, 106), width=2)
    d.ellipse([px - 5, py - 12, px + 5, py - 2], fill=(245, 216, 176), outline=C["text"], width=1)
    text_shadow(d, (px, py + 30), "YOU (spawn)", load_font(10, bold=True), C["text_light"], anchor="mm")


# ============================================================================
# BEACH + SEA
# ============================================================================

def draw_beach_and_sea(d):
    d.rectangle([46, 880, W - 46, 930], fill=C["sand"])
    d.rectangle([46, 880, W - 46, 892], fill=C["sand_dark"])
    for sx, sc in [(140, (245, 182, 196)), (300, (231, 224, 195)), (520, (196, 202, 215)),
                   (810, (245, 216, 176)), (970, (255, 217, 230)), (1130, (212, 234, 224))]:
        d.ellipse([sx - 5, 905, sx + 5, 913], fill=sc, outline=C["text"], width=1)
    for gx in range(90, W - 80, 86):
        d.line([(gx, 900), (gx - 3, 893)], fill=(122, 138, 58), width=1)
        d.line([(gx, 900), (gx + 3, 893)], fill=(122, 138, 58), width=1)
    # Dock
    dx, dy = 880, 884
    d.rectangle([dx, dy, dx + 90, dy + 20], fill=(156, 122, 74), outline=C["wood_dark"], width=2)
    for px in [dx + 10, dx + 35, dx + 60, dx + 84]:
        d.line([(px, dy), (px, dy + 20)], fill=C["wood_dark"], width=1)
    d.line([(dx + 86, dy), (dx + 112, dy - 26)], fill=C["wood_dark"], width=2)
    d.line([(dx + 112, dy - 26), (dx + 120, dy + 20)], fill=(255, 255, 255), width=1)
    d.ellipse([dx + 117, dy + 16, dx + 123, dy + 22], fill=(245, 182, 196), outline=C["text"], width=1)
    d.text((dx + 45, dy + 38), "Fishing Dock", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    # Sea
    d.rectangle([46, 930, W - 46, H], fill=C["sea"])
    d.rectangle([46, 930, W - 46, 938], fill=C["sea_light"])
    for ry in [950, 962, 974]:
        for rx in range(60, W - 60, 24):
            d.arc([rx, ry - 2, rx + 12, ry + 2], 180, 360, fill=(255, 255, 255), width=1)


# ============================================================================
# OVERLAYS — title, compass, legend
# ============================================================================

def draw_compass(d):
    cx, cy, r = W - 80, 100, 28
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255), outline=C["text"], width=2)
    d.polygon([(cx, cy - 24), (cx - 6, cy), (cx + 6, cy)], fill=C["roof_red"], outline=(122, 31, 31), width=1)
    d.polygon([(cx, cy + 24), (cx - 4, cy), (cx + 4, cy)], fill=(251, 233, 227), outline=(122, 31, 31), width=1)
    d.text((cx, cy - 13), "N", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    d.text((cx, cy + 15), "S", font=load_font(10), fill=C["text"], anchor="mm")
    d.text((cx - 18, cy), "W", font=load_font(10), fill=C["text"], anchor="mm")
    d.text((cx + 18, cy), "E", font=load_font(10), fill=C["text"], anchor="mm")


def draw_legend(d):
    """Bottom-left legend OUTSIDE map regions (over the sea band)."""
    x, y, w, h = 56, 940, 320, 56
    d.rectangle([x, y, x + w, y + h], fill=C["legend_bg"], outline=(111, 67, 33), width=2)
    d.text((x + w // 2, y + 10), "Legend", font=load_font(12, bold=True), fill=C["text"], anchor="mm")
    rows = [
        (C["wood"], "portfolio building"),
        ((216, 178, 126), "weird / filler house"),
        (C["path"], "cobblestone path"),
        (C["river"], "river / water"),
        (C["sand"], "sand / beach"),
        (C["forest"], "forest border"),
    ]
    for i, (color, label) in enumerate(rows):
        col = i % 3
        row = i // 3
        rx = x + 12 + col * 102
        ry = y + 22 + row * 14
        d.rectangle([rx, ry, rx + 12, ry + 8], fill=color, outline=C["text"], width=1)
        d.text((rx + 16, ry + 4), label, font=load_font(9), fill=C["text"], anchor="lm")


def draw_title(d):
    text_shadow(d, (W // 2, 24), "AETHERVEIL VALLEY", load_font(22, bold=True), C["text_light"], anchor="mm")
    text_shadow(d, (W // 2, 44), "overworld design map · 80 × 60 tiles @ 32 px · single Phaser scene", load_font(11), C["text_light"], anchor="mm")


# ============================================================================
# MAIN
# ============================================================================

def main() -> int:
    img = Image.new("RGB", (W, H), C["grass_light"])
    d = ImageDraw.Draw(img)

    draw_base_ground(d)
    draw_forest_border(d)

    # Paths first (under buildings)
    draw_paths(d)

    # Inner trees scattered throughout (under buildings so they peek behind)
    draw_inner_trees(d)

    # Water bodies
    draw_waterfall_and_river(d)
    draw_bridge(d)

    # Atmosphere region
    draw_cherry_grove(d)

    # Filler population FIRST so named buildings sit on top
    draw_filler_houses(d)

    # Decorations
    draw_wells(d)
    draw_benches(d)
    draw_veggie_gardens(d)
    draw_fences(d)
    draw_misc_props(d)

    # Named portfolio buildings (clustered around square)
    draw_atelier(d)
    draw_quest_board(d)
    draw_vaults(d)
    draw_forge(d)
    draw_inn(d)
    draw_windmill(d)
    draw_clock_tower(d)

    # The hub
    draw_town_square(d)

    # Residential weird houses (staggered cluster, not a parade)
    draw_weird_houses(d)

    # Player spawn
    draw_player_spawn(d)

    # Coast
    draw_beach_and_sea(d)
    draw_beacon(d)

    # Overlays
    draw_compass(d)
    draw_legend(d)
    draw_title(d)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, format="PNG", optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB, {W}x{H})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
