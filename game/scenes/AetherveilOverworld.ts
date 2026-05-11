import Phaser from 'phaser'

/**
 * J.1b Aetherveil Overworld -- rendered using Kenney Tiny Town tilemap
 * sprites instead of placeholder rectangles. World is 50x36 tiles at
 * 32 px (16x16 source scaled 2x) = 1600x1152 px.
 *
 * Tile-index reference (Tiny Town packed sheet, 12 cols x 11 rows = 132):
 *   GRASS variants:        0, 1, 2
 *   GRASS-to-dirt edges:   12-14, 24-26, 36-42
 *   DIRT full:             24, 25, 26
 *   STONE PATH tile:       43
 *   BUSHES (single-tile):  5, 6, 7, 8
 *   SHRUBS:                17
 *   TREES (small):         3 (orange), 4 (green), 27 (autumn), 28 (autumn-green)
 *   FENCE pieces:          44, 45, 46, 47, 56, 58, 68, 70, 80-82
 *   HOUSE BLUE roof row:   60 (L), 61 (M), 62 (R)
 *   HOUSE BLUE wall row:   48 (L), 51 (door), 50 (R)
 *   HOUSE RED  roof row:   64 (L), 65 (M), 66 (R)
 *   HOUSE RED  wall row:   52 (L), 55 (door), 54 (R)
 *   ROOF PEAK chevron:     67
 *   STAIRS / cobble:       96, 97, 98 (stone stairs)
 *
 * Player + Mayor remain primitives this cycle (no character sheet from
 * Tiny Town). J.1c will swap in Roguelike RPG character sprites.
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 2
const TILE = SRC_TILE * SCALE       // 32 px on screen
const COLS = 50
const ROWS = 36
const WORLD_W = COLS * TILE         // 1600
const WORLD_H = ROWS * TILE         // 1152

// Tile-index constants
const T = {
  GRASS_A: 0,
  GRASS_B: 1,
  GRASS_FLOWERS: 2,
  TREE_ORANGE: 3,
  TREE_GREEN: 4,
  BUSH_A: 5,
  BUSH_B: 6,
  BUSH_C: 7,
  BUSH_D: 8,
  SHRUB: 17,
  DIRT: 25,
  STONE_PATH: 43,
  FENCE_H: 44,
  FENCE_POST_L: 56,
  FENCE_POST_R: 58,
  // Blue house
  BLUE_ROOF_L: 60,
  BLUE_ROOF_M: 61,
  BLUE_ROOF_R: 62,
  BLUE_WALL_L: 48,
  BLUE_DOOR: 51,
  BLUE_WALL_R: 50,
  // Red house
  RED_ROOF_L: 64,
  RED_ROOF_M: 65,
  RED_ROOF_R: 66,
  RED_WALL_L: 52,
  RED_DOOR: 55,
  RED_WALL_R: 54,
  ROOF_PEAK: 67,
}

interface BuildingDef {
  key: string
  label: string
  cx: number  // tile column of left edge
  cy: number  // tile row of top edge (roof row)
  w: number   // width in tiles (>= 3)
  kind: 'red' | 'blue'
}

const BUILDINGS: BuildingDef[] = [
  // North of plaza (Atelier)
  { key: 'atelier',  label: 'The Atelier',
    cx: 22, cy: 5,  w: 5, kind: 'red' },
  // West of plaza (Vaults)
  { key: 'vaults',   label: 'Vaults of Whisperleaf',
    cx: 3,  cy: 18, w: 5, kind: 'blue' },
  // East of plaza (Embers' Forge)
  { key: 'forge',    label: "Embers' Forge",
    cx: 41, cy: 14, w: 5, kind: 'red' },
  // South (Hearthlight Inn)
  { key: 'inn',      label: 'The Hearthlight Inn',
    cx: 21, cy: 28, w: 6, kind: 'red' },
  // South-east (Beacon)
  { key: 'beacon',   label: 'Beacon of Distant Roads',
    cx: 41, cy: 27, w: 3, kind: 'blue' },
]

const MAYOR_DIALOG = [
  "Ah, a new face! Welcome, traveler. You've reached Aetherveil — a small valley of craftsmen and dreamers. I am the Mayor here. Halden, if you'd like a name to call me by.",
  "Look northward. That timbered hall is The Atelier — where wonders are forged from focused thought. The crafter inside is rarely seen, but the work speaks.",
  "To the west rest the Vaults of Whisperleaf — bound scrolls collected over many seasons. Take down any that catches your eye; the keeper minds the silence, not the visitors.",
  "East glow the Embers' Forge. Every art has its temper learned there. Each weapon on the wall is a story of practice.",
  "South of here, the Hearthlight Inn. Sit by the fire and let Marlowe tell you of the chapters. And on the far rise, the Beacon of Distant Roads — wake a flame there if you wish a message to travel.",
  "Wander where you will, traveler. Each door listens. Each shopkeep speaks. When you've seen the town, return to the fountain. I'll be here.",
]

export default class AetherveilOverworld extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container & { body: Phaser.Physics.Arcade.Body }
  private mayor!: Phaser.GameObjects.Container
  private mayorHit!: Phaser.GameObjects.Zone
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private dialogOpen = false

  constructor() {
    super('AetherveilOverworld')
  }

  create() {
    this.cameras.main.setBackgroundColor('#88b04b')

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)

    this.buildGround()
    this.buildPaths()
    this.buildPlaza()
    this.buildDecorations()
    this.buildBuildings()
    this.buildMayor()
    this.buildPlayer()
    this.buildHud()

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setDeadzone(220, 140)

    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE,E,ESC') as Record<string, Phaser.Input.Keyboard.Key>

    let firstVisit = true
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem('aetherveil.visited')) {
        firstVisit = false
      } else if (typeof window !== 'undefined') {
        window.localStorage.setItem('aetherveil.visited', '1')
      }
    } catch {
      // ignore
    }
    if (firstVisit) this.time.delayedCall(800, () => this.openMayorDialog())
  }

  // ============================================================
  // TILE PLACEMENT HELPERS
  // ============================================================

  private tile(col: number, row: number, frame: number, depth = 0): Phaser.GameObjects.Image {
    const img = this.add.image(col * TILE, row * TILE, 'tiny-town', frame)
      .setOrigin(0, 0)
      .setScale(SCALE)
      .setDepth(depth)
    return img
  }

  private buildGround() {
    // Grass field with mild variation. Mostly GRASS_A; sprinkle B + flowers.
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Seeded variant
        const noise = (r * 31 + c * 17) % 100
        let frame = T.GRASS_A
        if (noise < 22) frame = T.GRASS_B
        else if (noise < 26) frame = T.GRASS_FLOWERS
        this.tile(c, r, frame, 0)
      }
    }
    // Forest belt around the edges (1-tile thick of trees)
    for (let c = 0; c < COLS; c++) {
      this.tile(c, 0, T.TREE_GREEN, 1)
      this.tile(c, ROWS - 1, T.TREE_GREEN, 1)
    }
    for (let r = 0; r < ROWS; r++) {
      this.tile(0, r, T.TREE_GREEN, 1)
      this.tile(COLS - 1, r, T.TREE_GREEN, 1)
    }
  }

  private buildPaths() {
    // Vertical path from south entrance to plaza
    const px = Math.floor(COLS / 2)
    for (let r = 17; r < ROWS - 1; r++) {
      this.tile(px - 1, r, T.DIRT, 1)
      this.tile(px, r, T.DIRT, 1)
      this.tile(px + 1, r, T.DIRT, 1)
    }
    // Horizontal path across the world at plaza row
    const py = Math.floor(ROWS / 2)
    for (let c = 2; c < COLS - 2; c++) {
      this.tile(c, py - 1, T.DIRT, 1)
      this.tile(c, py, T.DIRT, 1)
      this.tile(c, py + 1, T.DIRT, 1)
    }
  }

  private buildPlaza() {
    // Stone cobble plaza centred at world middle (10 wide x 7 tall).
    const cxStart = Math.floor(COLS / 2) - 5
    const cyStart = Math.floor(ROWS / 2) - 3
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 10; c++) {
        this.tile(cxStart + c, cyStart + r, T.STONE_PATH, 2)
      }
    }
    // Fountain at plaza centre -- single stone tile + circle accent on top.
    const fcx = Math.floor(COLS / 2) * TILE
    const fcy = Math.floor(ROWS / 2) * TILE
    this.add.circle(fcx, fcy, 18, 0x7fb9e5).setStrokeStyle(2, 0x3a6b8c).setDepth(3)
    this.add.circle(fcx, fcy, 7, 0x9bd0eb).setStrokeStyle(1, 0x3a6b8c).setDepth(3)
    this.add.circle(fcx, fcy, 2, 0xffffff).setDepth(3)
    // Bell tower: 3 stacked roof+wall tiles immediately NE of the fountain.
    const bcx = Math.floor(COLS / 2) + 2
    const bcy = Math.floor(ROWS / 2) - 3
    this.tile(bcx, bcy, T.ROOF_PEAK, 4)
    this.tile(bcx, bcy + 1, T.BLUE_WALL_L, 4)
    this.tile(bcx, bcy + 2, T.BLUE_WALL_L, 4)
    this.add.text(fcx, fcy + 80, 'TOWN SQUARE', {
      fontFamily: FONT_TITLE, fontSize: '18px', color: '#3a2418', fontStyle: '600',
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)
  }

  private buildDecorations() {
    // Scatter trees + bushes + flowers in a few wild patches.
    // Cherry-grove cluster NW (use a pink tint on bushes/trees -- Phaser tint).
    for (const [c, r, kind] of [
      [4, 2, 'cherry'], [6, 3, 'cherry'], [8, 2, 'cherry'], [5, 4, 'cherry'],
      [3, 6, 'cherry'], [7, 5, 'cherry'], [9, 4, 'cherry'], [6, 6, 'cherry'],
      [4, 7, 'cherry'],
    ] as [number, number, string][]) {
      const img = this.tile(c, r, T.TREE_GREEN, 2)
      if (kind === 'cherry') img.setTint(0xffaad0)
    }
    this.add.text(7 * TILE, 1 * TILE, 'Cherry Grove', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#7a3957', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)

    // Scatter wild bushes + trees in outer fields (away from plaza centre).
    const spots: [number, number, number][] = [
      [3, 12, T.BUSH_B], [5, 14, T.BUSH_C], [11, 12, T.BUSH_A],
      [38, 5, T.TREE_ORANGE], [43, 8, T.BUSH_D], [44, 11, T.TREE_GREEN],
      [3, 22, T.BUSH_A], [7, 23, T.TREE_ORANGE], [4, 26, T.BUSH_B],
      [38, 22, T.TREE_GREEN], [44, 25, T.BUSH_C], [42, 30, T.BUSH_D],
      [10, 30, T.TREE_ORANGE], [15, 32, T.BUSH_A], [33, 33, T.TREE_GREEN],
      [11, 5, T.SHRUB], [40, 18, T.SHRUB], [12, 28, T.SHRUB],
    ]
    for (const [c, r, f] of spots) this.tile(c, r, f, 2)

    // Wheat-ish field SW (use orange trees with mustard tint as filler)
    for (const [c, r] of [[6, 30], [7, 30], [8, 30], [6, 31], [7, 31], [8, 31]]) {
      const img = this.tile(c, r, T.GRASS_FLOWERS, 1)
      img.setTint(0xf3d36d)
    }
  }

  private buildBuildings() {
    for (const b of BUILDINGS) {
      this.placeHouse(b)
      const cxPx = (b.cx + b.w / 2) * TILE
      const cyPx = (b.cy + 3) * TILE + 8
      // Click hitbox over the wall row of the house.
      const hit = this.add.zone(cxPx, (b.cy + 1.5) * TILE, b.w * TILE, 2 * TILE)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.openBuildingStub(b.label))
      // Name plate below.
      this.add.text(cxPx, cyPx, b.label, {
        fontFamily: FONT_BODY, fontSize: '16px', color: '#3a2418', fontStyle: '500',
      }).setOrigin(0.5).setResolution(3).setDepth(5)
    }
  }

  private placeHouse(b: BuildingDef) {
    // 2-row house: top = roof, bottom = wall. Door always at centre column.
    const isRed = b.kind === 'red'
    const ROOF_L = isRed ? T.RED_ROOF_L : T.BLUE_ROOF_L
    const ROOF_M = isRed ? T.RED_ROOF_M : T.BLUE_ROOF_M
    const ROOF_R = isRed ? T.RED_ROOF_R : T.BLUE_ROOF_R
    const WALL_L = isRed ? T.RED_WALL_L : T.BLUE_WALL_L
    const WALL_M = isRed ? T.RED_WALL_L : T.BLUE_WALL_L  // wall mid same as L
    const DOOR = isRed ? T.RED_DOOR : T.BLUE_DOOR
    const WALL_R = isRed ? T.RED_WALL_R : T.BLUE_WALL_R

    const doorCol = Math.floor(b.w / 2)
    // Roof row
    for (let i = 0; i < b.w; i++) {
      let frame: number
      if (i === 0) frame = ROOF_L
      else if (i === b.w - 1) frame = ROOF_R
      else frame = ROOF_M
      this.tile(b.cx + i, b.cy, frame, 3)
    }
    // Wall row
    for (let i = 0; i < b.w; i++) {
      let frame: number
      if (i === doorCol) frame = DOOR
      else if (i === 0) frame = WALL_L
      else if (i === b.w - 1) frame = WALL_R
      else frame = WALL_M
      this.tile(b.cx + i, b.cy + 1, frame, 3)
    }
    // Roof peak above middle column (optional decorative)
    if (b.w >= 5) {
      this.tile(b.cx + doorCol, b.cy - 1, T.ROOF_PEAK, 4)
    }
  }

  private buildMayor() {
    const fcx = Math.floor(COLS / 2) * TILE
    const fcy = Math.floor(ROWS / 2) * TILE + 50
    // Body cloak ellipse + head circle (still primitives until J.1c)
    const body = this.add.ellipse(fcx, fcy + 4, 20, 26, 0x4a6b3a).setStrokeStyle(1.5, 0x2a3f22).setDepth(6)
    const head = this.add.circle(fcx, fcy - 8, 8, 0xf5d8b0).setStrokeStyle(1, 0x3a2418).setDepth(6)
    const cane = this.add.rectangle(fcx + 11, fcy + 4, 2, 22, 0xa98758).setDepth(6)
    this.mayor = this.add.container(0, 0, [body, head, cane]).setDepth(6)
    this.mayorHit = this.add.zone(fcx, fcy, 36, 38)
      .setInteractive({ useHandCursor: true })
    this.mayorHit.on('pointerdown', () => this.openMayorDialog())
    this.add.text(fcx, fcy - 26, 'Mayor Halden', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#3a2418', fontStyle: '600',
    }).setOrigin(0.5).setResolution(3).setDepth(7)
  }

  private buildPlayer() {
    const px = Math.floor(COLS / 2) * TILE
    const py = (ROWS - 4) * TILE
    const body = this.add.ellipse(0, 4, 18, 24, 0x5a4a8a).setStrokeStyle(1.5, 0x3a2a6a)
    const head = this.add.circle(0, -10, 7, 0xf5d8b0).setStrokeStyle(1, 0x3a2418)
    const cape = this.add.polygon(0, 4, [-9, -6, 9, -6, 11, 12, -11, 12], 0x4a3a6a, 0.5)
    const cont = this.add.container(px, py, [cape, body, head]).setDepth(6)
    this.physics.add.existing(cont)
    this.player = cont as Phaser.GameObjects.Container & { body: Phaser.Physics.Arcade.Body }
    this.player.body.setSize(20, 26)
    this.player.body.setOffset(-10, -10)
    this.player.body.setCollideWorldBounds(true)
  }

  private buildHud() {
    this.add.text(20, 18, 'AETHERVEIL', {
      fontFamily: FONT_TITLE, fontSize: '24px', color: '#f5e5c5', fontStyle: '700',
      stroke: '#3a2418', strokeThickness: 4,
    }).setScrollFactor(0).setResolution(3).setLetterSpacing(2).setDepth(100)
    this.add.text(20, 50, 'a valley of craftsmen and dreamers', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5', fontStyle: 'italic',
      stroke: '#3a2418', strokeThickness: 3,
    }).setScrollFactor(0).setResolution(3).setDepth(100)
    const camH = this.scale.gameSize.height
    this.add.text(20, camH - 30,
      '↑ ← ↓ → / WASD — walk     click NPCs and buildings to interact',
      { fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5',
        stroke: '#3a2418', strokeThickness: 3 },
    ).setScrollFactor(0).setResolution(3).setOrigin(0, 1).setDepth(100)
  }

  // ============================================================
  // DIALOG (unchanged from J.1a)
  // ============================================================

  private openMayorDialog() {
    this.showDialog('Mayor Halden', MAYOR_DIALOG)
  }

  private openBuildingStub(label: string) {
    this.showDialog(label, [
      `${label} — the door listens, but the interior is still under construction. Return after the next chapter.`,
    ])
  }

  private showDialog(speaker: string, beats: string[]) {
    if (this.dialogOpen) return
    this.dialogOpen = true
    const camW = this.scale.gameSize.width
    const camH = this.scale.gameSize.height
    const boxW = Math.min(camW - 80, 1200)
    const boxH = 200
    const boxX = camW / 2
    const boxY = camH - boxH / 2 - 40

    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x2a1a0c, 0.95)
      .setScrollFactor(0).setStrokeStyle(3, 0xa98758).setDepth(200)
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xd4b890, 0.7).setDepth(201)

    const nameBg = this.add.rectangle(boxX - boxW / 2 + 110, boxY - boxH / 2 - 16, 220, 30, 0x2a1a0c)
      .setScrollFactor(0).setStrokeStyle(2, 0xa98758).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 110, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '18px', color: '#f5e5c5', fontStyle: '600',
    }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setLetterSpacing(1).setDepth(203)

    const bodyText = this.add.text(boxX - boxW / 2 + 40, boxY - boxH / 2 + 28, beats[0], {
      fontFamily: FONT_BODY, fontSize: '22px', color: '#f5e5c5',
      wordWrap: { width: boxW - 80, useAdvancedWrap: true }, lineSpacing: 6,
    }).setScrollFactor(0).setResolution(3).setDepth(203)

    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24, 'click / space →', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#d4b890', fontStyle: 'italic',
    }).setScrollFactor(0).setResolution(3).setOrigin(1, 1).setDepth(203)

    let idx = 0
    const advance = () => {
      idx++
      if (idx >= beats.length) {
        bg.destroy(); inner.destroy(); nameBg.destroy()
        nameText.destroy(); bodyText.destroy(); hint.destroy()
        this.input.keyboard?.off('keydown-SPACE', advance)
        this.input.keyboard?.off('keydown-ESC', closeAll)
        this.input.off('pointerdown', advance)
        this.dialogOpen = false
        return
      }
      bodyText.setText(beats[idx])
    }
    const closeAll = () => { while (idx < beats.length) idx++; advance() }

    this.time.delayedCall(120, () => {
      this.input.keyboard?.on('keydown-SPACE', advance)
      this.input.keyboard?.on('keydown-ESC', closeAll)
      this.input.on('pointerdown', advance)
    })
  }

  // ============================================================
  // UPDATE
  // ============================================================

  update() {
    if (!this.player || !this.cursors || !this.wasd) return
    const body = this.player.body
    body.setVelocity(0)
    if (this.dialogOpen) return
    const speed = 220
    let vx = 0, vy = 0
    if (this.cursors.left.isDown || this.wasd.A?.isDown) vx -= 1
    if (this.cursors.right.isDown || this.wasd.D?.isDown) vx += 1
    if (this.cursors.up.isDown || this.wasd.W?.isDown) vy -= 1
    if (this.cursors.down.isDown || this.wasd.S?.isDown) vy += 1
    if (vx !== 0 && vy !== 0) { const inv = 1 / Math.sqrt(2); vx *= inv; vy *= inv }
    body.setVelocity(vx * speed, vy * speed)
  }
}
