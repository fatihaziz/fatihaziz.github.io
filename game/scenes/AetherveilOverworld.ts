import Phaser from 'phaser'

/**
 * J.1c Aetherveil Overworld -- world rendered from Kenney Tiny Town tiles,
 * characters from Kenney Tiny Dungeon spritesheet. World is 50x36 tiles at
 * 32 px (16x16 source scaled 2x) = 1600x1152 px.
 *
 * Tile-index reference (Tiny Town packed, 12x11 = 132):
 *   GRASS:         0/1/2     DIRT:    25     STONE_PATH: 43
 *   BUSHES:        5-8       SHRUB:   17
 *   TREES:         3 (orange), 4 (green)
 *   BLUE house:    roof 60/61/62, wall 48/51/50
 *   RED house:     roof 64/65/66, wall 52/55/54
 *   ROOF PEAK:     67
 *
 * Character-index reference (Tiny Dungeon packed):
 *   84  Mayor Halden -- purple-hat wizard (wise elder)
 *   100 Player      -- white-hair elf girl (Frieren-coded traveler)
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 2
const TILE = SRC_TILE * SCALE       // 32 px on screen
// Characters scale slightly larger than tiles so they read clearly without
// requiring camera zoom (which would mangle scroll-factor=0 HUD).
const CHAR_SCALE = 3                // 48 px tall char on 32 px tiles
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
  // Stone castle / walls
  STONE_GATE_ARCH: 75,    // archway opening
  STONE_BLOCK_TOP_L: 76,  // upper stone wall pieces
  STONE_BLOCK_TOP_M: 77,
  STONE_BLOCK_TOP_R: 78,
  STONE_BLOCK_DOOR: 79,
  STONE_CREN_L: 96,       // crenellated top (left cap)
  STONE_CREN_M: 97,       // crenellated top (middle)
  STONE_CREN_R: 98,       // crenellated top (right cap)
  STONE_WALL_L: 99,       // wall middle column (left)
  STONE_WALL_M: 100,      // wall middle column (mid)
  STONE_WALL_R: 101,      // wall middle column (right)
  STONE_GATE_ARCH_2: 102, // alt arch
  STONE_CASTLE_DOOR: 103, // big castle door
  STONE_BASE_L: 108,      // smooth stone wall base
  STONE_BASE_M: 109,
  STONE_BASE_R: 110,
  STONE_SLIT_L: 120,      // wall with arrow slits
  STONE_SLIT_M: 121,
  STONE_SLIT_R: 122,
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
  // North-west of plaza, east of cherry grove (Atelier moved out of castle footprint).
  { key: 'atelier',  label: 'The Atelier',
    cx: 11, cy: 8,  w: 5, kind: 'red' },
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
  private player!: Phaser.Physics.Arcade.Sprite
  private playerShadow!: Phaser.GameObjects.Ellipse
  private mayor!: Phaser.GameObjects.Sprite
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
    this.buildCastle()
    this.buildPerimeterWalls()
    this.buildVillagers()
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
    // Fountain at plaza centre -- stone rim + animated water layers.
    const fcx = Math.floor(COLS / 2) * TILE
    const fcy = Math.floor(ROWS / 2) * TILE
    // Stone rim (static)
    this.add.circle(fcx, fcy, 22, 0x9b8a72).setStrokeStyle(2, 0x5a4838).setDepth(3)
    // Outer water disc (animated alpha pulse)
    const waterOuter = this.add.circle(fcx, fcy, 18, 0x7fb9e5, 0.92).setDepth(3)
    this.tweens.add({
      targets: waterOuter,
      alpha: 0.72,
      duration: 1600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
    // Inner ripple ring -- scale up + fade, then snap back via onRepeat.
    const ripple = this.add.circle(fcx, fcy, 8, 0x9bd0eb, 0.85).setDepth(3)
    this.tweens.add({
      targets: ripple,
      scale: 1.8,
      alpha: 0.15,
      duration: 1400,
      ease: 'Sine.easeOut',
      repeat: -1,
      onRepeat: () => {
        ripple.setScale(1)
        ripple.setAlpha(0.85)
      },
    })
    // Bright centre highlight (steady)
    this.add.circle(fcx, fcy, 3, 0xffffff, 0.95).setDepth(3)
    // Tiny spout-glints: two small offset circles that pulse out of phase.
    const glint1 = this.add.circle(fcx - 5, fcy - 4, 1.5, 0xffffff, 0.9).setDepth(3)
    const glint2 = this.add.circle(fcx + 4, fcy + 3, 1.5, 0xffffff, 0.9).setDepth(3)
    this.tweens.add({
      targets: glint1, alpha: 0.2, duration: 900,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: glint2, alpha: 0.2, duration: 1100, delay: 400,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
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

    // Cherry-petal particle drift -- spawn from grove, fall SE on the breeze.
    // Use the small bush tile tinted pink as the petal sprite (no separate
    // particle asset needed). One petal every ~130 ms, lifetime 5 s, fade out.
    this.add.particles(0, 0, 'tiny-town', {
      frame: T.BUSH_A,
      x: { min: 3 * TILE, max: 11 * TILE },
      y: { min: 2 * TILE, max: 8 * TILE },
      lifespan: 5000,
      speedX: { min: 12, max: 32 },
      speedY: { min: 18, max: 38 },
      scale: { start: 0.4, end: 0.15 },
      alpha: { start: 0.85, end: 0 },
      tint: [0xffaad0, 0xffc0d8, 0xff8aaa],
      frequency: 130,
    }).setDepth(4)

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
      hit.on('pointerdown', () => this.openBuilding(b))
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

  // ============================================================
  // CASTLE + WALLS + VILLAGERS (J.1d -- Frieren medieval town vibe)
  // ============================================================

  private buildCastle() {
    // Imposing stone fortress at the north of the map, looming over the town.
    // Vertical silhouette: tall central keep (3 floors) flanked by towers.
    //
    //         . . [P] . .                     <- row 0: keep peak (peaks 67)
    //       . . [C C C] . .                   <- row 1: keep top (cren)
    //       [SC SC SC SC SC]                  <- row 2: arrow-slit floor
    //   [Tc][SC SC SC SC SC SC SC SC][Tc]    <- row 3: top main wall
    //   [Ts][W  W  GATE W  W  W  W ][Ts]    <- row 4: castle gate floor
    //   [Tb][B  B  B  B  B  B  B  B ][Tb]    <- row 5: base
    //
    const cx = 22                  // left edge of main wall
    const cy = 1                   // top edge of arrow-slit row
    const W = 14                   // main wall width
    const peakCx = cx + Math.floor(W / 2) - 1  // 3-wide keep peak at centre
    const KEEP_W = 3

    // Erase forest-belt trees over the castle footprint so it reads cleanly.
    for (let c = cx - 1; c <= cx + W; c++) {
      this.tile(c, 0, T.GRASS_A, 0)
    }

    // Row 0: keep peak (single roof-peak chevron at very top centre)
    this.tile(peakCx + 1, 0, T.ROOF_PEAK, 5)

    // Row 1: keep top, 3-wide crenellated band raised above main wall
    for (let i = 0; i < KEEP_W; i++) {
      let f: number
      if (i === 0) f = T.STONE_CREN_L
      else if (i === KEEP_W - 1) f = T.STONE_CREN_R
      else f = T.STONE_CREN_M
      this.tile(peakCx + i, 1, f, 5)
    }

    // Row 2: arrow-slit floor (main wall width)
    for (let i = 0; i < W; i++) {
      let f: number
      if (i === 0) f = T.STONE_CREN_L
      else if (i === W - 1) f = T.STONE_CREN_R
      else f = T.STONE_CREN_M
      this.tile(cx + i, cy + 1, f, 4)
    }

    // Row 3: arrow-slit / parapet floor
    for (let i = 0; i < W; i++) {
      let f: number
      if (i === 0) f = T.STONE_SLIT_L
      else if (i === W - 1) f = T.STONE_SLIT_R
      else f = T.STONE_SLIT_M
      this.tile(cx + i, cy + 2, f, 4)
    }

    // Row 4: main wall middle band with massive central gate
    const gateCol = Math.floor(W / 2)
    for (let i = 0; i < W; i++) {
      let f: number
      if (i === gateCol) f = T.STONE_CASTLE_DOOR
      else if (i === 0) f = T.STONE_WALL_L
      else if (i === W - 1) f = T.STONE_WALL_R
      else f = T.STONE_WALL_M
      this.tile(cx + i, cy + 3, f, 4)
    }

    // Row 5: smooth stone base
    for (let i = 0; i < W; i++) {
      let f: number
      if (i === 0) f = T.STONE_BASE_L
      else if (i === W - 1) f = T.STONE_BASE_R
      else f = T.STONE_BASE_M
      this.tile(cx + i, cy + 4, f, 4)
    }

    // Flanking towers -- 1 tile wider than main wall, stacked 5 tall.
    const towerCols: number[] = [cx - 1, cx + W]
    for (const tc of towerCols) {
      this.tile(tc, cy,     T.ROOF_PEAK,     5)
      this.tile(tc, cy + 1, T.STONE_CREN_M,  5)
      this.tile(tc, cy + 2, T.STONE_SLIT_M,  5)
      this.tile(tc, cy + 3, T.STONE_WALL_M,  5)
      this.tile(tc, cy + 4, T.STONE_BASE_M,  5)
      // Pennant: small crimson cloth flapping on the tower peak.
      const px = tc * TILE + TILE / 2
      const py = cy * TILE + 4
      const pennant = this.add.triangle(px + 8, py, 0, -6, 18, -2, 0, 10, 0xa83232)
        .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
      this.tweens.add({
        targets: pennant,
        scaleX: 0.55,
        duration: 900,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      })
    }
    // Central keep peak gets a larger banner (slightly different colour).
    const keepBannerX = (peakCx + 1) * TILE + TILE / 2
    const keepBannerY = 0 * TILE + 4
    const keepBanner = this.add.triangle(keepBannerX + 10, keepBannerY,
      0, -8, 24, -2, 0, 14, 0xc04848)
      .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
    this.tweens.add({
      targets: keepBanner,
      scaleX: 0.6,
      duration: 1100,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      delay: 200,
    })

    // Castle name plate just below the gate, on grass.
    const labelX = (cx + gateCol + 0.5) * TILE
    const labelY = (cy + 5) * TILE + 14
    this.add.text(labelX, labelY, 'Castle Aetherveil', {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#f5e5c5', fontStyle: '600',
      stroke: '#3a2418', strokeThickness: 4,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)
  }

  private buildPerimeterWalls() {
    // Town wall: stone wall pieces forming a U around the valley.
    // West wall column, east wall column, south wall row -- north stays open
    // because the castle dominates that flank.
    const WEST = 1
    const EAST = COLS - 2
    const SOUTH = ROWS - 3
    // West vertical run
    for (let r = 10; r < SOUTH; r++) {
      const top = r === 10
      const bottom = r === SOUTH - 1
      const f = top ? T.STONE_CREN_M : bottom ? T.STONE_BASE_M : T.STONE_WALL_M
      this.tile(WEST, r, f, 2)
    }
    // East vertical run
    for (let r = 10; r < SOUTH; r++) {
      const top = r === 10
      const bottom = r === SOUTH - 1
      const f = top ? T.STONE_CREN_M : bottom ? T.STONE_BASE_M : T.STONE_WALL_M
      this.tile(EAST, r, f, 2)
    }
    // South wall run -- gate at the path column.
    const gateCol = Math.floor(COLS / 2)
    for (let c = WEST + 1; c < EAST; c++) {
      let f: number
      if (c === gateCol - 1) f = T.STONE_CREN_R
      else if (c === gateCol + 1) f = T.STONE_CREN_L
      else if (c === gateCol) {
        // skip -- gate opening below
        continue
      } else if (c === WEST + 1) f = T.STONE_CREN_L
      else if (c === EAST - 1) f = T.STONE_CREN_R
      else f = T.STONE_CREN_M
      this.tile(c, SOUTH, f, 2)
    }
    // Gate arch tile spanning 1 tile + tall arch on top.
    this.tile(gateCol, SOUTH - 1, T.STONE_GATE_ARCH, 2)
    this.tile(gateCol, SOUTH, T.STONE_CASTLE_DOOR, 2)
    // South-gate label
    this.add.text(gateCol * TILE + TILE / 2, (SOUTH + 1) * TILE + 6, 'Southgate', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#f5e5c5',
      fontStyle: 'italic', stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  private buildVillagers() {
    // Static NPCs scattered around town. Each one has a hit-zone + dialog
    // beats so clicking them adds flavour to the world. Pure atmosphere
    // -- they don't reveal project content, that lives behind building doors.
    interface VillagerDef {
      col: number
      row: number
      frame: number
      name: string
      beats: string[]
    }
    const villagers: VillagerDef[] = [
      {
        col: 9, row: 19, frame: 88, name: 'A Librarian',
        beats: [
          'The keeper does not speak. I tend the shelves while she sleeps. Three sheaves of scrolls arrived this moon -- try the cedar rack at the south wall, they still smell of pine.',
          'Take any you wish, only return them by dusk. The scrolls remember which hands held them last.',
        ],
      },
      {
        col: 38, row: 16, frame: 109, name: "A Smith's Apprentice",
        beats: [
          'Master tempers the steel by sound, not colour. I am still learning to hear it.',
          'If you bring a cracked blade he will look at it for a long time, then ask what you struck. The answer matters more than the steel.',
        ],
      },
      {
        col: 24, row: 30, frame: 87, name: 'An Old Wanderer',
        beats: [
          'The road from Greybranch narrows each season. Soon only foxes and grief will pass that way.',
          'The Inn-keep keeps a fire for travellers who have nothing to trade. That is rare, in this age.',
        ],
      },
      {
        col: 40, row: 28, frame: 99, name: 'A Noble in Travel Cloak',
        beats: [
          'If I light the flame at the Beacon tonight, my brother will see it from the hold by dawn. He always watches at dawn.',
          'It is a small magic, but small magics keep families standing.',
        ],
      },
      {
        col: 16, row: 12, frame: 85, name: 'A Market Crier',
        beats: [
          'Onions! Crow-feathers! Apple-honey! All from the valley, none from the king\'s road.',
          'Trade fair, trade plain. The Mayor watches us, and he is gentle. He is also not entirely a man.',
        ],
      },
    ]
    for (const v of villagers) {
      const px = v.col * TILE + TILE / 2
      const py = v.row * TILE + TILE / 2
      this.add.ellipse(px, py + 22, 26, 8, 0x000000, 0.28).setDepth(5)
      const sprite = this.add.sprite(px, py, 'tiny-dungeon', v.frame)
        .setScale(CHAR_SCALE).setDepth(6)
      this.tweens.add({
        targets: sprite,
        y: py - 2,
        duration: 1200 + (v.frame % 7) * 80,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: (v.frame % 11) * 60,
      })
      const hit = this.add.zone(px, py, 48, 56)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(v.name, v.beats))
    }
  }

  private buildMayor() {
    // Mayor stands just south of the fountain, on the plaza cobble.
    const fcx = Math.floor(COLS / 2) * TILE
    const fcy = Math.floor(ROWS / 2) * TILE + 56
    // Soft shadow ellipse under feet (depth 5, below sprite)
    this.add.ellipse(fcx, fcy + 26, 32, 9, 0x000000, 0.30).setDepth(5)
    // Mayor sprite: tiny-dungeon frame 84 (purple-hat wizard, 48px tall)
    this.mayor = this.add.sprite(fcx, fcy, 'tiny-dungeon', 84)
      .setScale(CHAR_SCALE)
      .setDepth(6)
    // Gentle idle bob -- 2px Y oscillation, yoyo
    this.tweens.add({
      targets: this.mayor,
      y: fcy - 3,
      duration: 1400,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
    this.mayorHit = this.add.zone(fcx, fcy, 52, 56)
      .setInteractive({ useHandCursor: true })
    this.mayorHit.on('pointerdown', () => this.openMayorDialog())
    this.add.text(fcx, fcy - 36, 'Mayor Halden', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5', fontStyle: '600',
      stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(7)
  }

  private buildPlayer() {
    // Default spawn: south entrance on the dirt road.
    let px = Math.floor(COLS / 2) * TILE
    let py = (ROWS - 4) * TILE
    // Debug spawn override via ?spawn=castle|plaza|north (for screenshot iters).
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search).get('spawn')
        if (sp === 'castle') { px = 36 * TILE; py = 8 * TILE }
        else if (sp === 'plaza') { px = 30 * TILE; py = 17 * TILE }
        else if (sp === 'north') { px = 25 * TILE; py = 3 * TILE }
        else if (sp === 'fountain') { px = 31 * TILE; py = 18 * TILE }
      }
    } catch { /* ignore */ }
    this.playerShadow = this.add.ellipse(px, py + 22, 30, 9, 0x000000, 0.30).setDepth(5)
    this.player = this.physics.add.sprite(px, py, 'tiny-dungeon', 100)
      .setScale(CHAR_SCALE)
      .setDepth(6)
    this.player.setCollideWorldBounds(true)
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

  private openBuilding(b: BuildingDef) {
    // Atelier (J.2) and Vaults (J.3) have real interior scenes. The rest
    // still surface a stub dialog until their phases land.
    const interiorMap: Record<string, string> = {
      atelier: 'AtelierInterior',
      vaults: 'VaultsOfWhisperleaf',
      forge: 'EmbersForge',
      inn: 'HearthlightInn',
      beacon: 'BeaconOfDistantRoads',
    }
    const target = interiorMap[b.key]
    if (target) {
      this.cameras.main.fadeOut(280, 26, 16, 8)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(target)
      })
      return
    }
    this.showDialog(b.label, [
      `${b.label} — the door listens, but the interior is still under construction. Return after the next chapter.`,
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
    this.player.setVelocity(0)
    if (this.dialogOpen) {
      this.syncPlayerShadow()
      return
    }
    const speed = 220
    let vx = 0, vy = 0
    if (this.cursors.left.isDown || this.wasd.A?.isDown) vx -= 1
    if (this.cursors.right.isDown || this.wasd.D?.isDown) vx += 1
    if (this.cursors.up.isDown || this.wasd.W?.isDown) vy -= 1
    if (this.cursors.down.isDown || this.wasd.S?.isDown) vy += 1
    if (vx !== 0 && vy !== 0) { const inv = 1 / Math.sqrt(2); vx *= inv; vy *= inv }
    this.player.setVelocity(vx * speed, vy * speed)
    if (vx < 0) this.player.setFlipX(true)
    else if (vx > 0) this.player.setFlipX(false)
    this.syncPlayerShadow()
  }

  private syncPlayerShadow() {
    if (this.playerShadow && this.player) {
      this.playerShadow.x = this.player.x
      this.playerShadow.y = this.player.y + 22
    }
  }
}
