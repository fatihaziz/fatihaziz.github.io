import Phaser from 'phaser'

/**
 * Aetherveil Overworld -- rebuilt from the overworld design map (j9):
 * 80x60 tiles @ 32 px, single Phaser scene (2560x1920 px world).
 *
 * Geography (per docs/spec/concept-map-j9.png):
 *   NW  Cherry Blossom Grove (sakura, swing, meditation stone)
 *   N   The Atelier, Quest Board, Cathedral of Whisperleaf-on-the-Hill
 *   NE  Waterfall Cascade -> pool -> river south to the sea; Aetherveil Keep
 *   E   Embers' Forge on the keep road; two bridges over the river
 *   W   Residential lane: Vaults of Whisperleaf + six trade shops + the
 *       odd houses (cats, inventor, painter, hermit, music) + Quiet Grove
 *   C   Walled Town Square: bell tower, bazaar stalls, well, Mayor Halden
 *   S   Hearthlight Inn, Great Gate, windmill, spawn crossroads, Clock
 *       Tower underpass on the beach road, stilt house, stables
 *   SE  Wheat fields + scarecrows, Beacon of Distant Roads on the shore
 *   S   Beach, fishing dock, the sea
 *
 * Region builders live in game/world/regions/*; they receive a WorldCtx.
 * This scene owns terrain, walls, roads, villagers, the player, collision
 * movement, HUD, the dialog box, fishing integration, and ambient systems.
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
import { buildNorth } from '../world/regions/north'
import { buildKeep } from '../world/regions/keep'
import { buildRiver } from '../world/regions/river'
import { buildLane } from '../world/regions/lane'
import { buildSquare } from '../world/regions/square'
import { buildClockTower } from '../world/regions/clockTower'
import { buildShore, SAND_TOP } from '../world/regions/shore'
import { FishingMinigame } from '../minigames/fishing'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 2
const TILE = SRC_TILE * SCALE       // 32 px on screen
const CHAR_SCALE = 3                // 48 px tall char on 32 px tiles
const COLS = 80
const ROWS = 60
const WORLD_W = COLS * TILE         // 2560
const WORLD_H = ROWS * TILE         // 1920

// Anchor rows/cols from the design map.
const NORTH_WALL = 17               // wall rows 17-18, road rows 19-20
const NORTH_ROAD = 19
const SOUTH_WALL = 47               // wall rows 47-48, Great Gate cols 29-32
const BEACH_ROAD = 38               // E-W road rows 38-39 through the underpass
const VROAD = 41                    // vertical road cols 41-42

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
  STONE_GATE_ARCH: 75,
  STONE_CREN_L: 96, STONE_CREN_M: 97, STONE_CREN_R: 98,
  STONE_WALL_L: 99, STONE_WALL_M: 100, STONE_WALL_R: 101,
  STONE_BASE_L: 108, STONE_BASE_M: 109, STONE_BASE_R: 110,
}

const MAYOR_TOUR = [
  "Ah, a new face! Welcome, traveler. You've reached Aetherveil -- a small valley of craftsmen, dreamers, and one talkative miller. I am the Mayor here. Halden, if you'd like a name to call me by.",
  'North, past the wall, stands The Atelier -- wonders forged from focused thought, crafts on display. Follow the petal-fall north-west and you reach the Cherry Blossom Grove: a swing, a stone for sitting, and quiet enough to hear yourself.',
  'On the hill above the square rises the Cathedral of Whisperleaf-on-the-Hill. Its little sister sits west along the lane: the Vaults of Whisperleaf, where the bound scrolls live. The lane itself is full of odd doors -- a cat or five, a tinkerer, a painter, a hermit who trades in riddles, a hut full of song.',
  "East, over the Stone Bridge, glows the Embers' Forge -- every art has its temper learned there. The river it sits on falls from the cascade up north, below Aetherveil Keep. The Keep watches; it always has.",
  'South of the square: the Hearthlight Inn, where the road tells its chapters. The Great Gate opens to the shore. The Clock Tower arch on the east road leads to the wheat fields -- mind the scarecrows, they mind you back.',
  'Past the wheat, on the shore, stands the Beacon of Distant Roads -- wake a flame there, and a message will travel. Cast a line off the dock if you fancy. Wander where you will, traveler: each door listens. When you have seen the valley, return to the well. I will be here.',
]

const MAYOR_RETURNING = [
  "Welcome back, traveler. The valley's much as you left it -- though the fishing's been better.",
  "If you lose your way: the Atelier and the grove north, the Forge and the Keep east over the bridges, the Vaults and the lane west, the Gate, the fields and the Beacon south. I'll be here.",
]

const ALL_BUILDING_KEYS = ['atelier', 'vaults', 'forge', 'inn', 'beacon']

export default class AetherveilOverworld extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private playerShadow!: Phaser.GameObjects.Ellipse
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private dialogOpen = false
  private uiModalOpen = false
  private reduced = false

  private blocked = new Set<number>()
  private vdir = { up: false, down: false, left: false, right: false }
  private lastSafe = { x: 0, y: 0 }

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

    // scene-owned terrain
    this.buildGround()
    this.buildWalls()
    this.buildRoads()
    this.buildWilds()

    // regions (module-owned), west to east, north to south
    buildGrove(ctx)
    buildNorth(ctx)
    buildKeep(ctx)
    const river = buildRiver(ctx)
    this.bridgeRect = river.stoneBridgeRect
    buildLane(ctx)
    const square = buildSquare(ctx)
    this.lanternGlows = square.lanternGlows
    const tower = buildClockTower(ctx)
    this.passageRect = tower.passageRect
    const shore = buildShore(ctx)
    this.fishing = new FishingMinigame(ctx, shore.dockRect, shore.bobberPoint)

    this.buildVillagers()
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

    // test/debug hook: probe the collision grid from Playwright
    try {
      ;(window as any).__aetherveilIsBlocked =
        (c: number, r: number) => this.blocked.has(this.tileKey(c, r))
    } catch { /* ignore */ }
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
      modalOpen: (open) => { this.uiModalOpen = open },
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

  /** the player's feet box -- a slab around (x, y+12)..(x, y+22) */
  private feetCollide(x: number, y: number): boolean {
    const hw = 9
    return this.isBlockedPx(x - hw, y + 12) || this.isBlockedPx(x + hw, y + 12)
      || this.isBlockedPx(x - hw, y + 22) || this.isBlockedPx(x + hw, y + 22)
  }

  // ============================================================
  // TERRAIN: ground, walls, roads, wild scatter
  // ============================================================

  private tile(col: number, row: number, frame: number, depth = 0): Phaser.GameObjects.Image {
    return this.add.image(col * TILE, row * TILE, 'tiny-town', frame)
      .setOrigin(0, 0)
      .setScale(SCALE)
      .setDepth(depth)
  }

  private buildGround() {
    // Grass over the land half; the shore module paints sand + sea below.
    for (let r = 0; r < SAND_TOP; r++) {
      for (let c = 0; c < COLS; c++) {
        const noise = (r * 31 + c * 17) % 100
        let frame = T.GRASS_A
        if (noise < 22) frame = T.GRASS_B
        else if (noise < 26) frame = T.GRASS_FLOWERS
        this.tile(c, r, frame, 0)
      }
    }
    // Pine forest border: two rows top, two columns down each flank.
    for (let c = 0; c < COLS; c++) {
      this.tile(c, 0, T.TREE_GREEN, 1); this.block(c, 0)
      this.tile(c, 1, T.TREE_GREEN, 1); this.block(c, 1)
    }
    for (let r = 2; r < SAND_TOP; r++) {
      for (const c of [0, 1, COLS - 2, COLS - 1]) {
        this.tile(c, r, T.TREE_GREEN, 1)
        this.block(c, r)
      }
    }
  }

  private buildWalls() {
    // North town wall, rows 17-18. Openings: grove path (12-13), the
    // Atelier path (32-33); the Cathedral hill interrupts cols 38-48; the
    // wall resumes 49-52 and stops at the river.
    const gap = (c: number) =>
      (c >= 12 && c <= 13) || (c >= 32 && c <= 33) || (c >= 38 && c <= 48)
    for (let c = 2; c <= 52; c++) {
      if (gap(c)) continue
      this.tile(c, NORTH_WALL, T.STONE_CREN_M, 2)
      this.tile(c, NORTH_WALL + 1, T.STONE_WALL_M, 2)
      this.block(c, NORTH_WALL)
      this.block(c, NORTH_WALL + 1)
    }
    // arches over the two wall openings
    for (const c of [12, 13, 32, 33]) {
      this.tile(c, NORTH_WALL, T.STONE_GATE_ARCH, 2)
    }

    // South town wall, rows 47-48, west half only (cols 2-34); the Great
    // Gate (cols 29-32) is built by the square region. East of col 34 the
    // town opens onto the stilt-house slope and the fields.
    for (let c = 2; c <= 34; c++) {
      if (c >= 29 && c <= 32) continue
      this.tile(c, SOUTH_WALL, T.STONE_CREN_M, 2)
      this.tile(c, SOUTH_WALL + 1, T.STONE_BASE_M, 2)
      this.block(c, SOUTH_WALL)
      this.block(c, SOUTH_WALL + 1)
    }

    // Rampart watch-towers: west end of the south wall + the lone field
    // tower by the river (per the map).
    this.rampartTower(6, SOUTH_WALL - 2)
    this.rampartTower(53, 42)
  }

  private rampartTower(c: number, topRow: number): void {
    this.tile(c, topRow, T.STONE_CREN_L, 3)
    this.tile(c + 1, topRow, T.STONE_CREN_R, 3)
    this.tile(c, topRow + 1, T.STONE_WALL_L, 3)
    this.tile(c + 1, topRow + 1, T.STONE_WALL_R, 3)
    this.tile(c, topRow + 2, T.STONE_BASE_L, 3)
    this.tile(c + 1, topRow + 2, T.STONE_BASE_R, 3)
    this.blockRect(c, topRow, 2, 3)
    const px = (c + 1) * TILE
    const py = topRow * TILE + 2
    const pennant = this.add.triangle(px + 6, py, 0, -6, 16, -2, 0, 9, 0xa83232)
      .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
    if (!this.reduced) {
      this.tweens.add({
        targets: pennant, scaleX: 0.55,
        duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
    }
  }

  private buildRoads() {
    const stone = (c: number, r: number) => this.tile(c, r, T.STONE_PATH, 1)
    const dirt = (c: number, r: number) => this.tile(c, r, T.DIRT, 1)

    // North road below the wall (rows 19-20, cols 2-53).
    for (let c = 2; c <= 53; c++) { stone(c, NORTH_ROAD); stone(c, NORTH_ROAD + 1) }
    // Vertical road below the hill: cathedral forecourt -> spawn crossroads.
    for (let r = 24; r < BEACH_ROAD; r++) { stone(VROAD, r); stone(VROAD + 1, r) }
    // East-west beach road through the Clock Tower (rows 38-39, cols 25-53).
    for (let c = 25; c <= 53; c++) { stone(c, BEACH_ROAD); stone(c, BEACH_ROAD + 1) }
    // Gate road: below the Inn -> Great Gate -> beach (cols 30-31).
    for (let r = 43; r < SAND_TOP + 1; r++) { stone(30, r); stone(31, r) }
    // Forge road: vertical road -> Stone Bridge (rows 28-29).
    for (let c = 43; c <= 53; c++) { stone(c, 28); stone(c, 29) }
    // Keep road: north bridge -> Keep door (dirt, rows 19-20 east of river).
    for (let c = 57; c <= 70; c++) { dirt(c, NORTH_ROAD); dirt(c, NORTH_ROAD + 1) }
    // Grove path through the wall opening (cols 12-13).
    for (let r = 15; r < NORTH_ROAD; r++) { dirt(12, r); dirt(13, r) }
    // Atelier path through its wall opening (cols 32-33).
    for (let r = 13; r < NORTH_ROAD; r++) { dirt(32, r); dirt(33, r) }
    // West lane (dirt, rows 36-37) + its connector up to the north road.
    for (let c = 3; c <= 26; c++) { dirt(c, 36); dirt(c, 37) }
    for (let r = 21; r < 36; r++) { dirt(18, r); dirt(19, r) }
    // Lane -> plaza connector.
    for (let c = 20; c <= 26; c++) { dirt(c, 33); dirt(c, 34) }
  }

  private buildWilds() {
    // Scattered bushes/trees in the open meadows (kept off roads + regions).
    const spots: [number, number, number][] = [
      [26, 8, T.TREE_GREEN], [27, 14, T.BUSH_B], [37, 5, T.BUSH_C],
      [50, 8, T.TREE_ORANGE], [51, 14, T.BUSH_A], [36, 15, T.SHRUB],
      [22, 22, T.BUSH_D], [25, 24, T.TREE_GREEN], [35, 23, T.BUSH_A],
      [45, 23, T.TREE_ORANGE], [48, 24, T.BUSH_B], [39, 26, T.SHRUB],
      [44, 33, T.TREE_GREEN], [46, 31, T.BUSH_C], [22, 44, T.BUSH_B],
      [36, 42, T.TREE_ORANGE], [34, 44, T.BUSH_A], [24, 40, T.SHRUB],
      [62, 24, T.TREE_GREEN], [66, 27, T.BUSH_D], [72, 25, T.TREE_ORANGE],
      [64, 31, T.BUSH_A], [70, 33, T.TREE_GREEN], [74, 36, T.BUSH_C],
      [62, 38, T.TREE_ORANGE], [68, 40, T.BUSH_B], [74, 42, T.SHRUB],
      [47, 43, T.BUSH_D], [10, 22, T.BUSH_A], [6, 24, T.TREE_GREEN],
      [4, 20, T.SHRUB], [23, 26, T.BUSH_C],
    ]
    for (const [c, r, f] of spots) {
      this.tile(c, r, f, 2)
      if (f === T.TREE_ORANGE || f === T.TREE_GREEN) this.block(c, r)
    }
  }

  // ============================================================
  // VILLAGERS
  // ============================================================

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
        col: 15, row: 34, frame: 88, name: 'A Librarian',
        beats: [
          'The keeper of the Vaults does not speak. I tend the shelves while she sleeps. Three sheaves of scrolls arrived this moon -- try the cedar rack at the south wall, they still smell of pine.',
          'Take any you wish, only return them by dusk. The scrolls remember which hands held them last.',
        ],
      },
      {
        col: 61, row: 21, frame: 109, name: "A Smith's Apprentice",
        beats: [
          'Master tempers the steel by sound, not colour. I am still learning to hear it.',
          'If you bring a cracked blade he will look at it for a long time, then ask what you struck. The answer matters more than the steel.',
        ],
      },
      {
        col: 9, row: 38.5, frame: 87, name: 'An Old Wanderer',
        beats: [
          'The road from Greybranch narrows each season. Soon only foxes and grief will pass that way.',
          'The Inn-keep keeps a fire for travellers who have nothing to trade. That is rare, in this age.',
        ],
      },
      {
        col: 64, row: 54, frame: 99, name: 'A Noble in Travel Cloak',
        beats: [
          'If I light the flame at the Beacon tonight, my brother will see it from the hold by dawn. He always watches at dawn.',
          'It is a small magic, but small magics keep families standing.',
        ],
      },
      {
        col: 35, row: 31.5, frame: 85, name: 'A Market Crier',
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

  // mayor dialog logic stays scene-owned; the square region places his
  // sprite and calls back through this method
  openMayorDialog() {
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
  // INTERIOR TRANSITIONS
  // ============================================================

  enterInteriorScene(sceneKey: string, buildingKey: string): void {
    this.enterInterior(sceneKey, buildingKey)
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
  // PLAYER + HUD + AMBIENT
  // ============================================================

  private buildPlayer() {
    // Default spawn: the crossroads by the windmill (per the map: "YOU").
    let px = 42.5 * TILE
    let py = 39.5 * TILE
    // Returning from an interior: resume at the door.
    try {
      const back = this.registry.get('aetherveil.spawnAt') as { x: number; y: number } | undefined
      if (back && typeof back.x === 'number') {
        px = back.x
        py = back.y
        this.registry.remove('aetherveil.spawnAt')
      }
    } catch { /* ignore */ }
    // Debug spawn override (?spawn=plaza|grove|falls|...) for screenshots.
    try {
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search).get('spawn')
        if (sp === 'plaza' || sp === 'square') { px = 34 * TILE; py = 36 * TILE }
        else if (sp === 'grove') { px = 12.5 * TILE; py = 16 * TILE }
        else if (sp === 'north') { px = 33 * TILE; py = 15 * TILE }
        else if (sp === 'falls') { px = 60 * TILE; py = 16 * TILE }
        else if (sp === 'keep') { px = 66 * TILE; py = 20 * TILE }
        else if (sp === 'bridge') { px = 47 * TILE; py = 29 * TILE }
        else if (sp === 'forge') { px = 58.5 * TILE; py = 27.5 * TILE }
        else if (sp === 'lane') { px = 12 * TILE; py = 36.5 * TILE }
        else if (sp === 'tower') { px = 45 * TILE; py = 39 * TILE }
        else if (sp === 'gate') { px = 30.5 * TILE; py = 44 * TILE }
        else if (sp === 'fields') { px = 60 * TILE; py = 41 * TILE }
        else if (sp === 'beach') { px = 34 * TILE; py = 54.5 * TILE }
        else if (sp === 'dock') { px = 43.5 * TILE; py = 55.5 * TILE }
      }
    } catch { /* ignore */ }
    this.playerShadow = this.add.ellipse(px, py + 22, 30, 9, 0x000000, 0.30).setDepth(5)
    this.player = this.physics.add.sprite(px, py, 'tiny-dungeon', 100)
      .setScale(CHAR_SCALE).setDepth(6)
    this.player.setCollideWorldBounds(true)
    this.lastSafe = { x: px, y: py }
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

    // findings counter (click for the list) + mute toggle.
    // scrollFactor-0 objects hit-test in world space (long-standing Phaser
    // quirk), so screen-fixed UI is hit-tested manually on pointer.x/y.
    this.findingsText = this.add.text(camW - 20, 22, '', {
      fontFamily: FONT_BODY, fontSize: '16px', color: '#f5e5c5',
      stroke: '#3a2418', strokeThickness: 3,
    }).setScrollFactor(0).setResolution(3).setOrigin(1, 0).setDepth(100)
    this.refreshFindings()

    this.muteText = this.add.text(camW - 20, camH - 26, '', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#d4b890',
      stroke: '#3a2418', strokeThickness: 3,
    }).setScrollFactor(0).setResolution(3).setOrigin(1, 1).setDepth(100)
    this.muteText.setText(audioMuted() ? '[ sound: off ]' : '[ sound: on ]')

    const screenHit = (t: Phaser.GameObjects.Text, x: number, y: number) => {
      const w = t.displayWidth + 16
      const h = t.displayHeight + 12
      const left = t.x - w + 8        // both texts are right-aligned (originX 1)
      const top = t.originY === 1 ? t.y - h + 6 : t.y - 6
      return x >= left && x <= t.x + 8 && y >= top && y <= top + h
    }
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.dialogOpen || this.uiModalOpen) return
      if (screenHit(this.muteText, pointer.x, pointer.y)) {
        const m = toggleMute()
        this.muteText.setText(m ? '[ sound: off ]' : '[ sound: on ]')
        if (!m) sfxBlip()
      } else if (screenHit(this.findingsText, pointer.x, pointer.y)) {
        const labels = findingsLabels()
        if (labels.length === 0) {
          this.showDialog('Findings', ['nothing yet. the valley hides small things for the unhurried: shells, coins, riddles, trust.'])
          return
        }
        this.showDialog('Findings', [
          'so far the valley has given you:\n- ' + labels.join('\n- '),
        ])
      }
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
      this.add.circle(cx + d.dx, cy + d.dy, 30, 0x2a1a0c, 0.55)
        .setScrollFactor(0).setStrokeStyle(2, 0xa98758, 0.8).setDepth(160)
      this.add.text(cx + d.dx, cy + d.dy, d.glyph, {
        fontFamily: FONT_TITLE, fontSize: '20px', color: '#f5e5c5',
      }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setDepth(161)
    }
    // manual screen-space hit-testing (same Phaser scrollFactor quirk as HUD)
    const dirAt = (x: number, y: number) => {
      for (const d of defs) {
        if (Phaser.Math.Distance.Between(x, y, cx + d.dx, cy + d.dy) <= 34) return d.dir
      }
      return null
    }
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const dir = dirAt(pointer.x, pointer.y)
      if (dir) this.vdir[dir] = true
    })
    const clearAll = () => {
      this.vdir.up = false; this.vdir.down = false
      this.vdir.left = false; this.vdir.right = false
    }
    this.input.on('pointerup', clearAll)
    this.input.on('pointerupoutside', clearAll)
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
    const y = 80 + Math.random() * 500
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
      duration: 18000,
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

    if (this.dialogOpen || this.uiModalOpen || this.fishing?.active) {
      this.syncPlayerShadow()
      this.maybeSunset()
      this.updateDockPrompt()
      return
    }

    // physics may apply velocity over a longer real frame than the dt used
    // for prediction (headless / busy tabs) -- if we ended up inside a
    // blocked tile, snap back to the last safe spot
    if (this.feetCollide(this.player.x, this.player.y)) {
      this.player.setPosition(this.lastSafe.x, this.lastSafe.y)
    } else {
      this.lastSafe.x = this.player.x
      this.lastSafe.y = this.player.y
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

    // test/debug hook: current player tile, readable from Playwright
    try {
      ;(window as any).__aetherveil = {
        x: this.player.x, y: this.player.y,
        col: this.player.x / TILE, row: this.player.y / TILE,
      }
    } catch { /* ignore */ }

    this.updateZones()
    this.updateDockPrompt()
    this.maybeSunset()

    // Mayor greets the first-time visitor when they reach the square.
    if (this.mayorGreetPending) {
      const p = this.player
      if (p.x > 27 * TILE && p.x < 40 * TILE
        && p.y > 28 * TILE && p.y < 38 * TILE) {
        this.openMayorDialog()
      }
    }
  }

  private updateZones(): void {
    const p = this.player
    // stone bridge echo
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
