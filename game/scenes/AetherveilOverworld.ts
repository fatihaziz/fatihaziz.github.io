import Phaser from 'phaser'

/**
 * Aetherveil Overworld -- the full valley (spec v2).
 *
 * 64x52 tiles at 32 px (16 px source scaled 2x) = 2048x1664 px world.
 * The walled town sits in the north-west quadrant (unchanged from J.1);
 * new land east (river / bridge / waterfall / meadow) and south
 * (residential lane / windmill / beach / dock / lighthouse / sea).
 *
 * Region builders live in game/world/regions/*; they receive a WorldCtx
 * and place their own tiles, collision and interactions. This scene owns
 * terrain, paths, town, the player, the Mayor, collision movement, HUD,
 * the dialog box, fishing integration, and the ambient systems (sunset,
 * birds, underpass dim, bridge echo, virtual d-pad).
 *
 * Tile-index reference (tiny-town packed, 12x11 = 132):
 *   GRASS 0/1/2  TREES 3/4  BUSHES 5-8  SHRUB 17  DIRT 25  PATH 39-42
 *   STONE_PATH 43  SIGNPOST 83  COIN 93  houses 48-67  stone 96-126
 * Characters (tiny-dungeon packed): 84 Mayor, 100 player, others NPCs.
 */

import type { WorldCtx } from '../world/ctx'
import {
  isFirstVisit, markVisited, isBuildingVisited, markBuildingVisited,
  addFinding, findingsCount, findingsLabels, ALL_FINDINGS,
} from '../world/save'
import {
  initAudio, toggleMute, audioMuted, unlockAudio,
  sfxBlip, sfxDoor, sfxCollect, sfxChime, sfxEcho,
} from '../world/audio'
import { buildGrove } from '../world/regions/grove'
import { buildSquare } from '../world/regions/square'
import { buildWaterfall } from '../world/regions/waterfall'
import { buildClockTower } from '../world/regions/clockTower'
import { buildLane } from '../world/regions/lane'
import { buildBeach, SAND_TOP } from '../world/regions/beach'
import { FishingMinigame } from '../minigames/fishing'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 2
const TILE = SRC_TILE * SCALE       // 32 px on screen
const CHAR_SCALE = 3                // 48 px tall char on 32 px tiles
const COLS = 64
const ROWS = 52
const WORLD_W = COLS * TILE         // 2048
const WORLD_H = ROWS * TILE         // 1664

// The town keeps its J.1 coordinates -- expansion added land east + south,
// so the old "centre of the world" is now a named constant.
const TOWN_CX = 25                  // fountain column
const TOWN_CY = 18                  // fountain row
const WEST_WALL = 1
const EAST_WALL = 48
const SOUTH_WALL = 33

// Tile-index constants (tiny-town)
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
  // Blue house
  BLUE_ROOF_L: 60, BLUE_ROOF_M: 61, BLUE_ROOF_R: 62,
  BLUE_WALL_L: 48, BLUE_DOOR: 51, BLUE_WALL_R: 50,
  // Red house
  RED_ROOF_L: 64, RED_ROOF_M: 65, RED_ROOF_R: 66,
  RED_WALL_L: 52, RED_DOOR: 55, RED_WALL_R: 54,
  ROOF_PEAK: 67,
  // Stone castle / walls
  STONE_GATE_ARCH: 75,
  STONE_CREN_L: 96, STONE_CREN_M: 97, STONE_CREN_R: 98,
  STONE_WALL_L: 99, STONE_WALL_M: 100, STONE_WALL_R: 101,
  STONE_CASTLE_DOOR: 103,
  STONE_BASE_L: 108, STONE_BASE_M: 109, STONE_BASE_R: 110,
  STONE_SLIT_L: 120, STONE_SLIT_M: 121, STONE_SLIT_R: 122,
}

interface BuildingDef {
  key: string
  label: string
  scene: string
  cx: number
  cy: number
  w: number
  kind: 'red' | 'blue'
}

// The Beacon moved to the shore (a real lighthouse, built by the beach
// region) -- four buildings remain inside the walls.
const BUILDINGS: BuildingDef[] = [
  { key: 'atelier', label: 'The Atelier', scene: 'AtelierInterior', cx: 11, cy: 8, w: 5, kind: 'red' },
  { key: 'vaults', label: 'Vaults of Whisperleaf', scene: 'VaultsOfWhisperleaf', cx: 3, cy: 18, w: 5, kind: 'blue' },
  { key: 'forge', label: "Embers' Forge", scene: 'EmbersForge', cx: 41, cy: 14, w: 5, kind: 'red' },
  { key: 'inn', label: 'The Hearthlight Inn', scene: 'HearthlightInn', cx: 21, cy: 28, w: 6, kind: 'red' },
]
const ALL_BUILDING_KEYS = ['atelier', 'vaults', 'forge', 'inn', 'beacon']

const MAYOR_TOUR = [
  "Ah, a new face! Welcome, traveler. You've reached Aetherveil -- a small valley of craftsmen, dreamers, and one talkative miller. I am the Mayor here. Halden, if you'd like a name to call me by.",
  'North of the square stands The Atelier -- wonders forged from focused thought. Past it, follow the petal-fall to the Cherry Blossom Grove: a swing, a stone for sitting, and quiet enough to hear yourself.',
  'Take the east gate and you cross the Stone Bridge. The river runs swift from the Waterfall up north -- worth the walk. Mind the current; the bridge is the only crossing.',
  "West rest the Vaults of Whisperleaf -- bound scrolls collected over many seasons. East glows the Embers' Forge; every art has its temper learned there. South of the fountain, the Hearthlight Inn -- Marlowe will talk your ear warm.",
  'Through Southgate lies a lane of odd little houses: the Cat Lady, a tinkerer, a painter, a hermit who trades in riddles, and a hut full of song. The Clock Tower arch beyond the Forge road also leads down to our beach.',
  'On the shore stands the Beacon of Distant Roads -- wake a flame there, and a message will travel. Cast a line off the dock if you fancy. Wander where you will, traveler: each door listens. When you have seen the valley, return to the fountain. I will be here.',
]

const MAYOR_RETURNING = [
  "Welcome back, traveler. The valley's much as you left it -- though the fishing's been better.",
  "If you lose your way: north the Atelier and the grove, east the bridge and the falls, west the Vaults, south the lane, the shore, the Beacon. I'll be here.",
]

export default class AetherveilOverworld extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private playerShadow!: Phaser.GameObjects.Ellipse
  private mayor!: Phaser.GameObjects.Sprite
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private dialogOpen = false
  private reduced = false

  private blocked = new Set<number>()
  private vdir = { up: false, down: false, left: false, right: false }

  private fishing!: FishingMinigame
  private dockPrompt!: Phaser.GameObjects.Text
  private bridgeRect!: Phaser.Geom.Rectangle
  private passageRect!: Phaser.Geom.Rectangle
  private inBridge = false
  private inPassage = false
  private dimRect!: Phaser.GameObjects.Rectangle

  private findingsText!: Phaser.GameObjects.Text
  private muteText!: Phaser.GameObjects.Text
  private lanternGlows: Phaser.GameObjects.Arc[] = []
  private lastInputAt = 0
  private sunsetOn = false
  private sunsetRect!: Phaser.GameObjects.Rectangle
  private mayorGreetPending = false

  constructor() {
    super('AetherveilOverworld')
  }

  create() {
    this.cameras.main.setBackgroundColor('#88b04b')
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)
    this.blocked.clear()
    this.dialogOpen = false
    this.lastInputAt = this.time.now

    try {
      this.reduced = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch { this.reduced = false }

    initAudio()
    const ctx = this.makeCtx()

    // terrain + town (scene-owned)
    this.buildGround()
    this.buildPaths()
    this.buildPlaza()
    this.buildDecorations()
    this.buildBuildings()
    this.buildCastle()
    this.buildPerimeterWalls()
    this.buildVillagers()
    this.buildMayor()

    // regions (module-owned)
    buildGrove(ctx)
    const square = buildSquare(ctx)
    this.lanternGlows = square.lanternGlows
    const falls = buildWaterfall(ctx)
    this.bridgeRect = falls.bridgeRect
    const tower = buildClockTower(ctx)
    this.passageRect = tower.passageRect
    buildLane(ctx)
    const beach = buildBeach(ctx)
    this.fishing = new FishingMinigame(ctx, beach.dockRect, beach.bobberPoint)

    this.buildPlayer()
    this.buildHud()
    this.buildAmbient()

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setDeadzone(220, 140)
    this.cameras.main.fadeIn(300, 26, 16, 8)

    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE,E,ESC') as Record<string, Phaser.Input.Keyboard.Key>

    // audio autoplay unlock + idle tracking
    this.input.on('pointerdown', () => { unlockAudio(); this.touchInput() })
    this.input.keyboard?.on('keydown', () => { unlockAudio(); this.touchInput() })

    this.input.keyboard?.on('keydown-SPACE', () => this.onActionKey())
    this.input.keyboard?.on('keydown-ESC', () => { if (this.fishing.active) this.fishing.cancel() })

    if (isFirstVisit()) {
      this.mayorGreetPending = true
      this.showWelcomeTooltip()
    }
  }

  // ============================================================
  // CTX FOR REGION MODULES
  // ============================================================

  private makeCtx(): WorldCtx {
    return {
      scene: this,
      TILE, COLS, ROWS,
      reduced: this.reduced,
      tile: (c, r, f, d = 0) => this.tile(c, r, f, d),
      dtile: (c, r, f, d = 0) =>
        this.add.image(c * TILE, r * TILE, 'tiny-dungeon', f).setOrigin(0, 0).setScale(SCALE).setDepth(d),
      block: (c, r) => this.block(c, r),
      blockRect: (c, r, w, h) => this.blockRect(c, r, w, h),
      unblock: (c, r) => this.blocked.delete(this.tileKey(c, r)),
      showDialog: (s, b) => this.showDialog(s, b),
      collect: (key, label) => this.collectFinding(key, label),
      playerPos: () => ({ x: this.player?.x ?? 0, y: this.player?.y ?? 0 }),
      enterInterior: (sceneKey, buildingKey) => this.enterInterior(sceneKey, buildingKey),
      visitedBuilding: (key) => isBuildingVisited(key),
    }
  }

  // ============================================================
  // COLLISION GRID
  // ============================================================

  private tileKey(c: number, r: number): number {
    return r * COLS + c
  }

  private block(c: number, r: number): void {
    const cc = Math.round(c)
    const rr = Math.round(r)
    if (cc < 0 || rr < 0 || cc >= COLS || rr >= ROWS) return
    this.blocked.add(this.tileKey(cc, rr))
  }

  private blockRect(c: number, r: number, w: number, h: number): void {
    for (let dr = 0; dr < h; dr++) {
      for (let dc = 0; dc < w; dc++) this.block(c + dc, r + dr)
    }
  }

  private isBlockedPx(x: number, y: number): boolean {
    const c = Math.floor(x / TILE)
    const r = Math.floor(y / TILE)
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return true
    return this.blocked.has(this.tileKey(c, r))
  }

  /** the player's feet box -- a slab around (x, y+14)..(x, y+22) */
  private feetCollide(x: number, y: number): boolean {
    const hw = 9
    return this.isBlockedPx(x - hw, y + 12) || this.isBlockedPx(x + hw, y + 12)
      || this.isBlockedPx(x - hw, y + 22) || this.isBlockedPx(x + hw, y + 22)
  }

  // ============================================================
  // TERRAIN
  // ============================================================

  private tile(col: number, row: number, frame: number, depth = 0): Phaser.GameObjects.Image {
    return this.add.image(col * TILE, row * TILE, 'tiny-town', frame)
      .setOrigin(0, 0)
      .setScale(SCALE)
      .setDepth(depth)
  }

  private buildGround() {
    // Grass over the land half; the beach module paints sand + sea below.
    for (let r = 0; r < SAND_TOP; r++) {
      for (let c = 0; c < COLS; c++) {
        const noise = (r * 31 + c * 17) % 100
        let frame = T.GRASS_A
        if (noise < 22) frame = T.GRASS_B
        else if (noise < 26) frame = T.GRASS_FLOWERS
        this.tile(c, r, frame, 0)
      }
    }
    // Forest border: top edge + west/east flanks down to the sand line.
    for (let c = 0; c < COLS; c++) {
      this.tile(c, 0, T.TREE_GREEN, 1)
      this.block(c, 0)
    }
    for (let r = 0; r < SAND_TOP + 3; r++) {
      this.tile(0, r, T.TREE_GREEN, 1)
      this.block(0, r)
      this.tile(COLS - 1, r, T.TREE_GREEN, 1)
      this.block(COLS - 1, r)
    }
  }

  private buildPaths() {
    // South road: fountain -> southgate -> lane -> beach.
    for (let r = TOWN_CY - 1; r < SAND_TOP; r++) {
      this.tile(TOWN_CX - 1, r, T.DIRT, 1)
      this.tile(TOWN_CX, r, T.DIRT, 1)
      this.tile(TOWN_CX + 1, r, T.DIRT, 1)
    }
    // East-west road through the plaza, out the east gate, to the meadow.
    for (let c = 2; c <= 62; c++) {
      this.tile(c, TOWN_CY - 1, T.DIRT, 1)
      this.tile(c, TOWN_CY, T.DIRT, 1)
      this.tile(c, TOWN_CY + 1, T.DIRT, 1)
    }
    // Forge-road spur down to the clock tower arch.
    for (let r = TOWN_CY + 2; r <= 30; r++) {
      this.tile(42, r, T.DIRT, 1)
    }
  }

  private buildPlaza() {
    const cxStart = TOWN_CX - 5
    const cyStart = TOWN_CY - 3
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 10; c++) {
        this.tile(cxStart + c, cyStart + r, T.STONE_PATH, 2)
      }
    }
    // Fountain at plaza centre -- stone rim + animated water layers.
    const fcx = TOWN_CX * TILE
    const fcy = TOWN_CY * TILE
    this.add.circle(fcx, fcy, 22, 0x9b8a72).setStrokeStyle(2, 0x5a4838).setDepth(3)
    const waterOuter = this.add.circle(fcx, fcy, 18, 0x7fb9e5, 0.92).setDepth(3)
    if (!this.reduced) {
      this.tweens.add({
        targets: waterOuter, alpha: 0.72,
        duration: 1600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
      const ripple = this.add.circle(fcx, fcy, 8, 0x9bd0eb, 0.85).setDepth(3)
      this.tweens.add({
        targets: ripple, scale: 1.8, alpha: 0.15,
        duration: 1400, ease: 'Sine.easeOut', repeat: -1,
        onRepeat: () => { ripple.setScale(1); ripple.setAlpha(0.85) },
      })
    }
    this.add.circle(fcx, fcy, 3, 0xffffff, 0.95).setDepth(3)
    this.block(TOWN_CX, TOWN_CY)
    // fountain click
    const fhit = this.add.zone(fcx, fcy, 48, 48).setInteractive({ useHandCursor: true })
    fhit.on('pointerdown', () =>
      this.showDialog('The Fountain', ['a copper coin sits at the bottom. you decide not to disturb it.']))

    // Bell tower NE of the fountain.
    const bcx = TOWN_CX + 2
    const bcy = TOWN_CY - 3
    this.tile(bcx, bcy, T.ROOF_PEAK, 4)
    this.tile(bcx, bcy + 1, T.BLUE_WALL_L, 4)
    this.tile(bcx, bcy + 2, T.BLUE_WALL_L, 4)
    this.blockRect(bcx, bcy, 1, 3)

    this.add.text(fcx, fcy + 80, 'TOWN SQUARE', {
      fontFamily: FONT_TITLE, fontSize: '18px', color: '#3a2418', fontStyle: '600',
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)
  }

  private buildDecorations() {
    // Cherry grove NW.
    const cherrySpots: [number, number][] = [
      [4, 2], [6, 3], [8, 2], [5, 4], [3, 6], [7, 5], [9, 4], [6, 6], [4, 7],
    ]
    for (const [c, r] of cherrySpots) {
      // orange poplar tinted rose -- multiply-tint over warm base reads as
      // sakura pink (green base goes muddy instead)
      this.tile(c, r, T.TREE_ORANGE, 2).setTint(0xffb8d8)
      this.block(c, r)
    }
    this.add.text(7 * TILE, 1 * TILE, 'Cherry Blossom Grove', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#7a3957', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)

    if (!this.reduced) {
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
    }

    // Wild bushes + trees in outer fields.
    const spots: [number, number, number][] = [
      [3, 12, T.BUSH_B], [5, 14, T.BUSH_C], [11, 12, T.BUSH_A],
      [38, 5, T.TREE_ORANGE], [43, 8, T.BUSH_D], [44, 11, T.TREE_GREEN],
      [3, 22, T.BUSH_A], [7, 23, T.TREE_ORANGE], [4, 26, T.BUSH_B],
      [38, 22, T.TREE_GREEN], [44, 25, T.BUSH_C], [42, 26, T.BUSH_D],
      [10, 30, T.TREE_ORANGE], [15, 32, T.BUSH_A], [33, 31, T.TREE_GREEN],
      [11, 5, T.SHRUB], [40, 11, T.SHRUB], [12, 28, T.SHRUB],
      // new south + east fields
      [5, 34, T.BUSH_B], [36, 35, T.BUSH_C], [38, 36, T.TREE_ORANGE],
      [46, 35, T.TREE_GREEN], [47, 38, T.BUSH_A], [12, 34, T.BUSH_D],
    ]
    for (const [c, r, f] of spots) {
      this.tile(c, r, f, 2)
      if (f === T.TREE_ORANGE || f === T.TREE_GREEN) this.block(c, r)
    }

    // Wheat patch SW.
    for (const [c, r] of [[6, 30], [7, 30], [8, 30], [6, 31], [7, 31], [8, 31]]) {
      this.tile(c, r, T.GRASS_FLOWERS, 1).setTint(0xf3d36d)
    }
  }

  // ============================================================
  // BUILDINGS (the four in-town doors)
  // ============================================================

  private buildBuildings() {
    for (const b of BUILDINGS) {
      this.placeHouse(b)
      const cxPx = (b.cx + b.w / 2) * TILE
      const cyPx = (b.cy + 3) * TILE + 8
      const hit = this.add.zone(cxPx, (b.cy + 1.5) * TILE, b.w * TILE, 2 * TILE)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.enterInterior(b.scene, b.key))
      this.add.text(cxPx, cyPx, b.label, {
        fontFamily: FONT_BODY, fontSize: '16px', color: '#3a2418', fontStyle: '500',
      }).setOrigin(0.5).setResolution(3).setDepth(5)
      if (isBuildingVisited(b.key)) {
        this.add.text(cxPx, cyPx + 18, '~ returned ~', {
          fontFamily: FONT_BODY, fontSize: '13px', color: '#8a5a2a', fontStyle: 'italic',
        }).setOrigin(0.5).setResolution(3).setDepth(5)
      }
    }
  }

  private placeHouse(b: BuildingDef) {
    const isRed = b.kind === 'red'
    const ROOF_L = isRed ? T.RED_ROOF_L : T.BLUE_ROOF_L
    const ROOF_M = isRed ? T.RED_ROOF_M : T.BLUE_ROOF_M
    const ROOF_R = isRed ? T.RED_ROOF_R : T.BLUE_ROOF_R
    const WALL_L = isRed ? T.RED_WALL_L : T.BLUE_WALL_L
    const WALL_M = isRed ? T.RED_WALL_L : T.BLUE_WALL_L
    const DOOR = isRed ? T.RED_DOOR : T.BLUE_DOOR
    const WALL_R = isRed ? T.RED_WALL_R : T.BLUE_WALL_R

    const doorCol = Math.floor(b.w / 2)
    for (let i = 0; i < b.w; i++) {
      this.tile(b.cx + i, b.cy, i === 0 ? ROOF_L : i === b.w - 1 ? ROOF_R : ROOF_M, 3)
    }
    for (let i = 0; i < b.w; i++) {
      let frame: number
      if (i === doorCol) frame = DOOR
      else if (i === 0) frame = WALL_L
      else if (i === b.w - 1) frame = WALL_R
      else frame = WALL_M
      this.tile(b.cx + i, b.cy + 1, frame, 3)
    }
    if (b.w >= 5) this.tile(b.cx + doorCol, b.cy - 1, T.ROOF_PEAK, 4)
    this.blockRect(b.cx, b.cy, b.w, 2)
  }

  private enterInterior(sceneKey: string, buildingKey: string): void {
    if (this.dialogOpen || this.fishing?.active) return
    markBuildingVisited(buildingKey)
    sfxDoor()
    // return the visitor to where they stood, not to the spawn road
    try {
      this.registry.set('aetherveil.spawnAt', { x: this.player.x, y: this.player.y })
    } catch { /* ignore */ }
    this.cameras.main.fadeOut(280, 26, 16, 8)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(sceneKey)
    })
  }

  // ============================================================
  // CASTLE + WALLS + VILLAGERS
  // ============================================================

  private buildCastle() {
    const cx = 22
    const cy = 1
    const W = 14
    const peakCx = cx + Math.floor(W / 2) - 1
    const KEEP_W = 3

    for (let c = cx - 1; c <= cx + W; c++) this.tile(c, 0, T.GRASS_A, 0)

    this.tile(peakCx + 1, 0, T.ROOF_PEAK, 5)
    for (let i = 0; i < KEEP_W; i++) {
      this.tile(peakCx + i, 1, i === 0 ? T.STONE_CREN_L : i === KEEP_W - 1 ? T.STONE_CREN_R : T.STONE_CREN_M, 5)
    }
    for (let i = 0; i < W; i++) {
      this.tile(cx + i, cy + 1, i === 0 ? T.STONE_CREN_L : i === W - 1 ? T.STONE_CREN_R : T.STONE_CREN_M, 4)
    }
    for (let i = 0; i < W; i++) {
      this.tile(cx + i, cy + 2, i === 0 ? T.STONE_SLIT_L : i === W - 1 ? T.STONE_SLIT_R : T.STONE_SLIT_M, 4)
    }
    const gateCol = Math.floor(W / 2)
    for (let i = 0; i < W; i++) {
      let f: number
      if (i === gateCol) f = T.STONE_CASTLE_DOOR
      else if (i === 0) f = T.STONE_WALL_L
      else if (i === W - 1) f = T.STONE_WALL_R
      else f = T.STONE_WALL_M
      this.tile(cx + i, cy + 3, f, 4)
    }
    for (let i = 0; i < W; i++) {
      this.tile(cx + i, cy + 4, i === 0 ? T.STONE_BASE_L : i === W - 1 ? T.STONE_BASE_R : T.STONE_BASE_M, 4)
    }

    const towerCols: number[] = [cx - 1, cx + W]
    for (const tc of towerCols) {
      this.tile(tc, cy, T.ROOF_PEAK, 5)
      this.tile(tc, cy + 1, T.STONE_CREN_M, 5)
      this.tile(tc, cy + 2, T.STONE_SLIT_M, 5)
      this.tile(tc, cy + 3, T.STONE_WALL_M, 5)
      this.tile(tc, cy + 4, T.STONE_BASE_M, 5)
      const px = tc * TILE + TILE / 2
      const py = cy * TILE + 4
      const pennant = this.add.triangle(px + 8, py, 0, -6, 18, -2, 0, 10, 0xa83232)
        .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
      if (!this.reduced) {
        this.tweens.add({
          targets: pennant, scaleX: 0.55,
          duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        })
      }
    }
    const keepBannerX = (peakCx + 1) * TILE + TILE / 2
    const keepBanner = this.add.triangle(keepBannerX + 10, 4, 0, -8, 24, -2, 0, 14, 0xc04848)
      .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
    if (!this.reduced) {
      this.tweens.add({
        targets: keepBanner, scaleX: 0.6,
        duration: 1100, ease: 'Sine.easeInOut', yoyo: true, repeat: -1, delay: 200,
      })
    }

    this.add.text((cx + gateCol + 0.5) * TILE, (cy + 5) * TILE + 14, 'Castle Aetherveil', {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#f5e5c5', fontStyle: '600',
      stroke: '#3a2418', strokeThickness: 4,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)

    this.blockRect(cx - 1, 0, W + 2, 6)
  }

  private buildPerimeterWalls() {
    // West + east runs.
    for (let r = 10; r < SOUTH_WALL; r++) {
      const top = r === 10
      const bottom = r === SOUTH_WALL - 1
      const f = top ? T.STONE_CREN_M : bottom ? T.STONE_BASE_M : T.STONE_WALL_M
      this.tile(WEST_WALL, r, f, 2)
      this.block(WEST_WALL, r)
      // east wall opens rows 17-19 -- the East Gate to the bridge road
      if (r >= TOWN_CY - 1 && r <= TOWN_CY + 1) continue
      this.tile(EAST_WALL, r, f, 2)
      this.block(EAST_WALL, r)
    }
    // gate caps either side of the east opening
    this.tile(EAST_WALL, TOWN_CY - 2, T.STONE_CREN_M, 2)
    this.tile(EAST_WALL, TOWN_CY + 2, T.STONE_CREN_M, 2)
    this.add.text(EAST_WALL * TILE + TILE / 2, (TOWN_CY - 2) * TILE - 6, 'Eastgate', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#f5e5c5', fontStyle: 'italic',
      stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(5)

    // South wall -- openings at Southgate (TOWN_CX) and the clock tower (41-43).
    for (let c = WEST_WALL + 1; c < EAST_WALL; c++) {
      if (c === TOWN_CX) continue
      if (c >= 41 && c <= 43) continue
      let f: number
      if (c === TOWN_CX - 1) f = T.STONE_CREN_R
      else if (c === TOWN_CX + 1) f = T.STONE_CREN_L
      else if (c === WEST_WALL + 1) f = T.STONE_CREN_L
      else if (c === EAST_WALL - 1) f = T.STONE_CREN_R
      else f = T.STONE_CREN_M
      this.tile(c, SOUTH_WALL, f, 2)
      this.block(c, SOUTH_WALL)
    }
    this.tile(TOWN_CX, SOUTH_WALL - 1, T.STONE_GATE_ARCH, 2)
    this.add.text(TOWN_CX * TILE + TILE / 2, (SOUTH_WALL + 1) * TILE + 6, 'Southgate', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#f5e5c5',
      fontStyle: 'italic', stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  private buildVillagers() {
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
        col: 40, row: 24, frame: 99, name: 'A Noble in Travel Cloak',
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
      if (!this.reduced) {
        this.tweens.add({
          targets: sprite, y: py - 2,
          duration: 1200 + (v.frame % 7) * 80, ease: 'Sine.easeInOut',
          yoyo: true, repeat: -1, delay: (v.frame % 11) * 60,
        })
      }
      const hit = this.add.zone(px, py, 48, 56).setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(v.name, v.beats))
    }
  }

  private buildMayor() {
    const fcx = TOWN_CX * TILE
    const fcy = TOWN_CY * TILE + 56
    this.add.ellipse(fcx, fcy + 26, 32, 9, 0x000000, 0.30).setDepth(5)
    this.mayor = this.add.sprite(fcx, fcy, 'tiny-dungeon', 84)
      .setScale(CHAR_SCALE).setDepth(6)
    if (!this.reduced) {
      this.tweens.add({
        targets: this.mayor, y: fcy - 3,
        duration: 1400, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
    }
    const hit = this.add.zone(fcx, fcy, 52, 56).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => this.openMayorDialog())
    this.add.text(fcx, fcy - 36, 'Mayor Halden', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5', fontStyle: '600',
      stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(7)
  }

  private openMayorDialog() {
    const allVisited = ALL_BUILDING_KEYS.every((k) => isBuildingVisited(k))
    if (allVisited) {
      this.showDialog('Mayor Halden', [
        "So -- you've seen all five doors. Every one. Most travelers visit two or three, and the rest stay shut until next season.",
        "I won't ask which you liked. That's between you and the crafter. But Aetherveil is smaller for being known, isn't it. The valley fits in the head now.",
        "Come back when the road brings you. You'll find a flame still lit on the Beacon. The crafter prefers it that way.",
      ])
      return
    }
    if (isFirstVisit() || this.mayorGreetPending) {
      this.mayorGreetPending = false
      markVisited()
      this.showDialog('Mayor Halden', MAYOR_TOUR)
      return
    }
    this.showDialog('Mayor Halden', MAYOR_RETURNING)
  }

  // ============================================================
  // PLAYER + HUD + AMBIENT
  // ============================================================

  private buildPlayer() {
    // Default spawn: the south road between the lane and the beach.
    let px = TOWN_CX * TILE + TILE / 2
    let py = 39 * TILE
    // Returning from an interior: resume at the door.
    try {
      const back = this.registry.get('aetherveil.spawnAt') as { x: number; y: number } | undefined
      if (back && typeof back.x === 'number') {
        px = back.x
        py = back.y
        this.registry.remove('aetherveil.spawnAt')
      }
    } catch { /* ignore */ }
    // Debug spawn override (?spawn=plaza|beach|falls|lane|tower) for screenshots.
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search).get('spawn')
        if (sp === 'castle') { px = 29 * TILE; py = 8 * TILE }
        else if (sp === 'plaza' || sp === 'fountain') { px = 25 * TILE; py = 21 * TILE }
        else if (sp === 'north') { px = 25 * TILE; py = 3 * TILE }
        else if (sp === 'beach') { px = 30 * TILE; py = 42 * TILE }
        else if (sp === 'dock') { px = 25.7 * TILE; py = 44 * TILE }
        else if (sp === 'falls') { px = 53 * TILE; py = 12 * TILE }
        else if (sp === 'bridge') { px = 52 * TILE; py = 18.5 * TILE }
        else if (sp === 'lane') { px = 16 * TILE; py = 38.5 * TILE }
        else if (sp === 'tower') { px = 42.5 * TILE; py = 27 * TILE }
        else if (sp === 'grove') { px = 7 * TILE; py = 9 * TILE }
      }
    } catch { /* ignore */ }
    this.playerShadow = this.add.ellipse(px, py + 22, 30, 9, 0x000000, 0.30).setDepth(5)
    this.player = this.physics.add.sprite(px, py, 'tiny-dungeon', 100)
      .setScale(CHAR_SCALE).setDepth(6)
    this.player.setCollideWorldBounds(true)
  }

  private showWelcomeTooltip() {
    const tip = this.add.text(this.player.x, this.player.y - 56,
      'Welcome to Aetherveil.\narrow keys / WASD to walk -- click what glints.', {
        fontFamily: FONT_BODY, fontSize: '16px', color: '#f5e5c5', align: 'center',
        stroke: '#3a2418', strokeThickness: 4,
      }).setOrigin(0.5).setResolution(3).setDepth(120)
    this.tweens.add({
      targets: tip, alpha: 0, y: tip.y - 14,
      delay: 5200, duration: 900,
      onComplete: () => tip.destroy(),
    })
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

    const camW = this.scale.gameSize.width
    const camH = this.scale.gameSize.height

    // findings counter (click for the list)
    this.findingsText = this.add.text(camW - 20, 22, '', {
      fontFamily: FONT_BODY, fontSize: '16px', color: '#f5e5c5',
      stroke: '#3a2418', strokeThickness: 3,
    }).setScrollFactor(0).setResolution(3).setOrigin(1, 0).setDepth(100)
      .setInteractive({ useHandCursor: true })
    this.findingsText.on('pointerdown', () => {
      const labels = findingsLabels()
      if (labels.length === 0) {
        this.showDialog('Findings', ['nothing yet. the valley hides small things for the unhurried: shells, coins, riddles, trust.'])
        return
      }
      this.showDialog('Findings', [
        'so far the valley has given you:\n- ' + labels.join('\n- '),
      ])
    })
    this.refreshFindings()

    // mute toggle
    this.muteText = this.add.text(camW - 20, camH - 26, '', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#d4b890',
      stroke: '#3a2418', strokeThickness: 3,
    }).setScrollFactor(0).setResolution(3).setOrigin(1, 1).setDepth(100)
      .setInteractive({ useHandCursor: true })
    this.muteText.setText(audioMuted() ? '[ sound: off ]' : '[ sound: on ]')
    this.muteText.on('pointerdown', () => {
      const m = toggleMute()
      this.muteText.setText(m ? '[ sound: off ]' : '[ sound: on ]')
      if (!m) sfxBlip()
    })

    this.add.text(20, camH - 30,
      'arrows / WASD -- walk     SPACE at the dock -- fish     click NPCs, doors, and what glints',
      { fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5',
        stroke: '#3a2418', strokeThickness: 3 },
    ).setScrollFactor(0).setResolution(3).setOrigin(0, 1).setDepth(100)

    // dock prompt (world-anchored, hidden until the player stands there)
    this.dockPrompt = this.add.text(0, 0, 'SPACE -- cast a line', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#ffc24b', fontStyle: 'italic',
      stroke: '#3a2418', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(110).setVisible(false)

    // underpass dim + sunset overlay (screen-space)
    this.dimRect = this.add.rectangle(camW / 2, camH / 2, camW, camH, 0x06040a, 0)
      .setScrollFactor(0).setDepth(140)
    this.sunsetRect = this.add.rectangle(camW / 2, camH / 2, camW, camH, 0xff8c42, 0)
      .setScrollFactor(0).setDepth(139)

    this.buildDpad()
  }

  private refreshFindings(): void {
    if (this.findingsText) {
      this.findingsText.setText(`findings: ${findingsCount()}/${ALL_FINDINGS.length}`)
    }
  }

  private collectFinding(key: string, label: string): boolean {
    const fresh = addFinding(key)
    if (fresh) {
      sfxCollect()
      this.refreshFindings()
      const p = this.player
      if (p) {
        const pop = this.add.text(p.x, p.y - 40, '+ ' + label, {
          fontFamily: FONT_BODY, fontSize: '15px', color: '#ffc24b',
          stroke: '#3a2418', strokeThickness: 3,
        }).setOrigin(0.5).setResolution(3).setDepth(120)
        this.tweens.add({
          targets: pop, y: p.y - 70, alpha: 0, duration: 1600,
          ease: 'Sine.easeOut', onComplete: () => pop.destroy(),
        })
      }
    }
    return fresh
  }

  private buildDpad(): void {
    let isTouch = false
    try {
      // pointer:coarse = the PRIMARY input is a touch screen; plain
      // touch-capability checks false-positive on touch laptops + headless
      isTouch = typeof window !== 'undefined'
        && window.matchMedia('(pointer: coarse)').matches
    } catch { isTouch = false }
    if (!isTouch) return

    const camH = this.scale.gameSize.height
    const cx = 110
    const cy = camH - 130
    const defs: { dx: number; dy: number; dir: 'up' | 'down' | 'left' | 'right'; glyph: string }[] = [
      { dx: 0, dy: -54, dir: 'up', glyph: '^' },
      { dx: 0, dy: 54, dir: 'down', glyph: 'v' },
      { dx: -54, dy: 0, dir: 'left', glyph: '<' },
      { dx: 54, dy: 0, dir: 'right', glyph: '>' },
    ]
    for (const d of defs) {
      const btn = this.add.circle(cx + d.dx, cy + d.dy, 30, 0x2a1a0c, 0.55)
        .setScrollFactor(0).setStrokeStyle(2, 0xa98758, 0.8).setDepth(160)
        .setInteractive({ useHandCursor: true })
      this.add.text(cx + d.dx, cy + d.dy, d.glyph, {
        fontFamily: FONT_TITLE, fontSize: '20px', color: '#f5e5c5',
      }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setDepth(161)
      btn.on('pointerdown', () => { this.vdir[d.dir] = true })
      btn.on('pointerup', () => { this.vdir[d.dir] = false })
      btn.on('pointerout', () => { this.vdir[d.dir] = false })
    }
  }

  private buildAmbient(): void {
    if (this.reduced) return
    // a flock of birds crosses the sky every ~90 s
    this.time.addEvent({
      delay: 90000, loop: true, callback: () => this.spawnBirds(),
    })
    this.time.delayedCall(25000, () => this.spawnBirds())
  }

  private spawnBirds(): void {
    const y = 80 + Math.random() * 400
    const flock = this.add.container(-80, y).setDepth(90)
    for (let i = 0; i < 5; i++) {
      const bx = (i % 3) * 26 - 26
      const by = Math.floor(i / 3) * 18 - 9 + (i % 2) * 6
      const wing = this.add.triangle(bx, by, 0, 4, 7, 0, 14, 4, 0x2a2438).setOrigin(0.5)
      flock.add(wing)
      this.tweens.add({
        targets: wing, scaleY: 0.4, duration: 240 + i * 30, yoyo: true, repeat: -1,
      })
    }
    this.tweens.add({
      targets: flock,
      x: WORLD_W + 120,
      y: y - 60 - Math.random() * 80,
      duration: 16000,
      onComplete: () => flock.destroy(),
    })
  }

  private touchInput(): void {
    this.lastInputAt = this.time.now
    if (this.sunsetOn) {
      this.sunsetOn = false
      this.tweens.add({ targets: this.sunsetRect, fillAlpha: 0, duration: 1200 })
      for (const g of this.lanternGlows) {
        this.tweens.add({ targets: g, alpha: 0.10, duration: 1200 })
      }
    }
  }

  private maybeSunset(): void {
    if (this.sunsetOn || this.reduced) return
    if (this.time.now - this.lastInputAt < 180000) return
    this.sunsetOn = true
    this.tweens.add({ targets: this.sunsetRect, fillAlpha: 0.20, duration: 2400 })
    for (const g of this.lanternGlows) {
      this.tweens.add({ targets: g, alpha: 0.45, duration: 2400 })
    }
  }

  // ============================================================
  // DIALOG
  // ============================================================

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
    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24, 'click / space ->', {
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
      sfxBlip()
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
  // INPUT + UPDATE
  // ============================================================

  private onActionKey(): void {
    if (this.dialogOpen) return
    if (this.fishing.active) {
      this.fishing.onAction()
      return
    }
    if (this.fishing.playerAtDock()) {
      this.fishing.start()
    }
  }

  update() {
    if (!this.player || !this.cursors || !this.wasd) return
    this.player.setVelocity(0)
    this.fishing?.update()

    if (this.dialogOpen || this.fishing?.active) {
      this.syncPlayerShadow()
      this.maybeSunset()
      this.updateDockPrompt()
      return
    }

    const speed = 220
    let vx = 0, vy = 0
    if (this.cursors.left.isDown || this.wasd.A?.isDown || this.vdir.left) vx -= 1
    if (this.cursors.right.isDown || this.wasd.D?.isDown || this.vdir.right) vx += 1
    if (this.cursors.up.isDown || this.wasd.W?.isDown || this.vdir.up) vy -= 1
    if (this.cursors.down.isDown || this.wasd.S?.isDown || this.vdir.down) vy += 1
    if (vx !== 0 || vy !== 0) this.lastInputAt = this.time.now
    if (vx !== 0 && vy !== 0) { const inv = 1 / Math.sqrt(2); vx *= inv; vy *= inv }

    // collision: test each axis against the blocked grid
    const dt = this.game.loop.delta / 1000
    const nx = this.player.x + vx * speed * dt
    const ny = this.player.y + vy * speed * dt
    if (vx !== 0 && this.feetCollide(nx, this.player.y)) vx = 0
    if (vy !== 0 && this.feetCollide(this.player.x, ny)) vy = 0
    if (vx !== 0 && vy !== 0 && this.feetCollide(nx, ny)) vy = 0

    this.player.setVelocity(vx * speed, vy * speed)
    if (vx < 0) this.player.setFlipX(true)
    else if (vx > 0) this.player.setFlipX(false)
    this.syncPlayerShadow()

    this.updateZones()
    this.updateDockPrompt()
    this.maybeSunset()

    // Mayor greets the first-time visitor when they reach the square.
    if (this.mayorGreetPending) {
      const p = this.player
      if (p.x > (TOWN_CX - 6) * TILE && p.x < (TOWN_CX + 5) * TILE
        && p.y > (TOWN_CY - 4) * TILE && p.y < (TOWN_CY + 4) * TILE) {
        this.openMayorDialog()
      }
    }
  }

  private updateZones(): void {
    const p = this.player
    // bridge echo
    const onBridge = this.bridgeRect
      && Phaser.Geom.Rectangle.Contains(this.bridgeRect, p.x, p.y)
    if (onBridge && !this.inBridge) {
      this.inBridge = true
      sfxEcho()
    } else if (!onBridge && this.inBridge) {
      this.inBridge = false
    }
    // clock tower underpass dim
    const inPass = this.passageRect
      && Phaser.Geom.Rectangle.Contains(this.passageRect, p.x, p.y)
    if (inPass && !this.inPassage) {
      this.inPassage = true
      sfxChime()
      this.tweens.add({ targets: this.dimRect, fillAlpha: 0.34, duration: 600 })
    } else if (!inPass && this.inPassage) {
      this.inPassage = false
      this.tweens.add({ targets: this.dimRect, fillAlpha: 0, duration: 700 })
    }
  }

  private updateDockPrompt(): void {
    if (!this.dockPrompt) return
    const show = !this.fishing.active && !this.dialogOpen && this.fishing.playerAtDock()
    this.dockPrompt.setVisible(show)
    if (show) {
      this.dockPrompt.setPosition(this.player.x, this.player.y - 44)
    }
  }

  private syncPlayerShadow() {
    if (this.playerShadow && this.player) {
      this.playerShadow.x = this.player.x
      this.playerShadow.y = this.player.y + 22
    }
  }
}
