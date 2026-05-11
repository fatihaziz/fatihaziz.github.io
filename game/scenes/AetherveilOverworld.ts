import Phaser from 'phaser'

/**
 * J.1 Aetherveil Overworld -- a walkable world rendered with hand-built
 * primitives (rectangles + circles + polygons) instead of a real tilemap.
 * J.1b will swap in the Kenney Tiny Town tilemap; the gameplay shape is
 * what we are validating here.
 *
 * Includes:
 *  - 50x36 ground grid (~1600x1152 world, larger than the viewport)
 *  - Cobblestone central plaza + fountain + small bell tower
 *  - 5 named building rectangles at the four cardinal-ish directions
 *  - Player sprite (rectangle) with 4-direction arrow / WASD movement
 *  - Camera follow with deadzone and bounds clamped to the world
 *  - Mayor Halden NPC; click him for the 6-beat welcome dialog
 *  - Building rectangles are clickable -> "interior arrives next /grind"
 *  - localStorage aetherveil.visited flag auto-opens Mayor dialog on first
 *    visit
 *  - Persistent HUD overlay (Aetherveil heading + control hint), pinned
 *    to the camera so it ignores world scroll
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const TILE = 32
const COLS = 50
const ROWS = 36
const WORLD_W = COLS * TILE   // 1600
const WORLD_H = ROWS * TILE   // 1152

const GRASS_PALETTE = [0x88b04b, 0x7fa755, 0x9ec370, 0x82a850]

interface BuildingDef {
  key: string
  label: string
  x: number
  y: number
  w: number
  h: number
  roofColor: number
  bodyColor: number
}

const BUILDINGS: BuildingDef[] = [
  // The Atelier — north of plaza
  { key: 'atelier', label: 'The Atelier',
    x: WORLD_W / 2 - 80, y: 4 * TILE,
    w: 6 * TILE, h: 5 * TILE,
    roofColor: 0x6f4321, bodyColor: 0xa96b3a },
  // Vaults of Whisperleaf — west of plaza
  { key: 'vaults', label: 'Vaults of Whisperleaf',
    x: 3 * TILE, y: WORLD_H / 2 + 30,
    w: 6 * TILE, h: 5 * TILE,
    roofColor: 0x454545, bodyColor: 0x9c9c9c },
  // Embers' Forge — east of plaza, across the bridge in spirit
  { key: 'forge', label: "Embers' Forge",
    x: WORLD_W - 9 * TILE, y: WORLD_H / 2 - 60,
    w: 6 * TILE, h: 5 * TILE,
    roofColor: 0x3a2310, bodyColor: 0x6f4a3a },
  // Hearthlight Inn — south of plaza
  { key: 'inn', label: 'The Hearthlight Inn',
    x: WORLD_W / 2 + 60, y: WORLD_H - 9 * TILE,
    w: 7 * TILE, h: 5 * TILE,
    roofColor: 0x6f1f1f, bodyColor: 0x8a5a3b },
  // Beacon of Distant Roads — south-east on the far edge
  { key: 'beacon', label: 'Beacon of Distant Roads',
    x: WORLD_W - 7 * TILE, y: WORLD_H - 8 * TILE,
    w: 3 * TILE, h: 7 * TILE,
    roofColor: 0xa44a4a, bodyColor: 0xe0e0e0 },
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
  private player!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }
  private mayor!: Phaser.GameObjects.Rectangle
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private dialogOpen = false

  constructor() {
    super('AetherveilOverworld')
  }

  create() {
    this.cameras.main.setBackgroundColor('#88b04b')

    // World bounds
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)

    this.buildGround()
    this.buildForestBorder()
    this.buildPaths()
    this.buildPlaza()
    this.buildBuildings()
    this.buildMayor()
    this.buildPlayer()
    this.buildHud()

    // Camera follow with deadzone
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setDeadzone(220, 140)

    // Input
    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE,E,ESC') as Record<string, Phaser.Input.Keyboard.Key>

    // First-visit auto-open
    let firstVisit = true
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem('aetherveil.visited')) {
        firstVisit = false
      } else if (typeof window !== 'undefined') {
        window.localStorage.setItem('aetherveil.visited', '1')
      }
    } catch {
      // localStorage blocked -- treat as first visit
    }
    if (firstVisit) {
      this.time.delayedCall(800, () => this.openMayorDialog())
    }
  }

  // ============================================================
  // BUILD HELPERS
  // ============================================================

  private buildGround() {
    // Hand-painted grass field using ROWS x COLS rectangles. Phaser
    // batches these efficiently. Variation seeded by (r, c) for stable look.
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const variant = (r * 7 + c * 13) % GRASS_PALETTE.length
        this.add.rectangle(
          c * TILE + TILE / 2,
          r * TILE + TILE / 2,
          TILE, TILE, GRASS_PALETTE[variant],
        )
      }
    }
  }

  private buildForestBorder() {
    // Dark pine strips along all four edges. Pure decoration.
    const dark = 0x3a6b3d
    const darker = 0x274a2a
    // Top
    this.add.rectangle(WORLD_W / 2, TILE, WORLD_W, TILE * 2, dark)
    for (let x = TILE; x < WORLD_W; x += 40) {
      this.add.triangle(x, TILE + 6, -10, 24, 0, -18, 10, 24, darker)
    }
    // Bottom
    this.add.rectangle(WORLD_W / 2, WORLD_H - TILE, WORLD_W, TILE * 2, dark)
    // Left
    this.add.rectangle(TILE, WORLD_H / 2, TILE * 2, WORLD_H, dark)
    // Right
    this.add.rectangle(WORLD_W - TILE, WORLD_H / 2, TILE * 2, WORLD_H, dark)
  }

  private buildPaths() {
    // Vertical cobble path connecting south entrance to plaza
    this.add.rectangle(WORLD_W / 2, WORLD_H - 6 * TILE, 4 * TILE, 12 * TILE, 0xa98758)
    // Horizontal path bisecting the plaza row
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W - 6 * TILE, 4 * TILE, 0xa98758)
  }

  private buildPlaza() {
    const px = WORLD_W / 2
    const py = WORLD_H / 2
    const pw = 12 * TILE
    const ph = 9 * TILE
    // Plaza floor
    this.add.rectangle(px, py, pw, ph, 0xc8a777).setStrokeStyle(2, 0x7a5c30)
    // Inner dashed border (decorative)
    this.add.rectangle(px, py, pw - 16, ph - 16).setStrokeStyle(1, 0xffffff, 0.55)
    // Fountain
    this.add.circle(px, py, 28, 0x7fb9e5).setStrokeStyle(2, 0x3a6b8c)
    this.add.circle(px, py, 10, 0x9bd0eb).setStrokeStyle(1, 0x3a6b8c)
    this.add.circle(px, py, 3, 0xffffff)
    // Bell Tower (small placeholder rectangle just NE of fountain)
    this.add.rectangle(px + 80, py - 80, 40, 80, 0x9c9c9c).setStrokeStyle(2, 0x454545)
    this.add.polygon(px + 80, py - 130, [-26, 10, 0, -18, 26, 10], 0xa44a4a).setStrokeStyle(1, 0x6f1f1f)
    this.add.text(px + 80, py - 30, 'Bell Tower', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418',
    }).setOrigin(0.5).setResolution(3)
    // 4 lantern posts at plaza corners
    for (const [lx, ly] of [
      [px - pw / 2 + 14, py - ph / 2 + 14], [px + pw / 2 - 14, py - ph / 2 + 14],
      [px - pw / 2 + 14, py + ph / 2 - 14], [px + pw / 2 - 14, py + ph / 2 - 14],
    ]) {
      this.add.rectangle(lx, ly + 6, 2, 16, 0x3a2418)
      this.add.polygon(lx, ly - 6, [-6, 6, 6, 6, 7, -2, -7, -2], 0xf7e08a).setStrokeStyle(1, 0x7a5c20)
    }
    // Plaza label below
    this.add.text(px, py + ph / 2 + 24, 'TOWN SQUARE', {
      fontFamily: FONT_TITLE, fontSize: '16px', color: '#3a2418', fontStyle: '600',
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2)
  }

  private buildBuildings() {
    for (const b of BUILDINGS) {
      // Body
      const body = this.add.rectangle(b.x, b.y, b.w, b.h, b.bodyColor)
        .setStrokeStyle(2, 0x3a2310).setInteractive({ useHandCursor: true })
      // Roof
      this.add.polygon(
        b.x, b.y - b.h / 2 - 12,
        [-b.w / 2, 14, 0, -18, b.w / 2, 14],
        b.roofColor,
      ).setStrokeStyle(2, 0x3a2310)
      // Door
      this.add.rectangle(b.x, b.y + b.h / 2 - 16, 16, 32, 0x3a2310)
      // Window
      this.add.rectangle(b.x - b.w / 4, b.y - b.h / 4, 18, 14, 0xf8e9b8).setStrokeStyle(1, 0x3a2310)
      this.add.rectangle(b.x + b.w / 4, b.y - b.h / 4, 18, 14, 0xf8e9b8).setStrokeStyle(1, 0x3a2310)
      // Name placard
      this.add.text(b.x, b.y + b.h / 2 + 18, b.label, {
        fontFamily: FONT_BODY, fontSize: '17px', color: '#3a2418', fontStyle: '500',
      }).setOrigin(0.5).setResolution(3)
      body.on('pointerdown', () => this.openBuildingStub(b.label))
    }
  }

  private buildMayor() {
    const px = WORLD_W / 2
    const py = WORLD_H / 2 + 60
    // Cloak body
    this.add.ellipse(px, py + 8, 18, 22, 0x4a6b3a).setStrokeStyle(1.5, 0x2a3f22)
    // Head
    this.add.circle(px, py - 6, 7, 0xf5d8b0).setStrokeStyle(1, 0x3a2418)
    // Click area
    this.mayor = this.add.rectangle(px, py, 28, 32, 0xffffff, 0).setInteractive({ useHandCursor: true })
    this.mayor.on('pointerdown', () => this.openMayorDialog())
    // Name plate above
    this.add.text(px, py - 30, 'Mayor Halden', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#3a2418', fontStyle: '600',
    }).setOrigin(0.5).setResolution(3)
  }

  private buildPlayer() {
    const px = WORLD_W / 2
    const py = WORLD_H - 7 * TILE
    const rect = this.add.rectangle(px, py, 22, 28, 0x5a4a8a).setStrokeStyle(2, 0x3a2a6a)
    this.physics.add.existing(rect)
    this.player = rect as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body }
    this.player.body.setCollideWorldBounds(true)
    // A tiny head-circle so it doesn't read as a die
    const head = this.add.circle(px, py - 12, 5, 0xf5d8b0).setStrokeStyle(1, 0x3a2418)
    // Make head follow player via update loop -- attach via setData
    this.player.setData('head', head)
  }

  private buildHud() {
    // Top-left heading in Cinzel
    this.add.text(20, 18, 'AETHERVEIL', {
      fontFamily: FONT_TITLE, fontSize: '24px', color: '#3a2418', fontStyle: '700',
    }).setScrollFactor(0).setResolution(3).setLetterSpacing(2)
    this.add.text(20, 50, 'a valley of craftsmen and dreamers', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#5a3826', fontStyle: 'italic',
    }).setScrollFactor(0).setResolution(3)

    // Bottom-left control hint
    const camH = this.scale.gameSize.height
    this.add.text(20, camH - 30, '↑ ← ↓ → / WASD — walk     click NPCs and buildings to interact',
      {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#3a2418',
      },
    ).setScrollFactor(0).setResolution(3).setOrigin(0, 1)
  }

  // ============================================================
  // DIALOG SYSTEM
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

    // Backdrop (dark wood)
    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x2a1a0c, 0.95)
      .setScrollFactor(0).setStrokeStyle(3, 0xa98758)
    // Brass-inner border
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xd4b890, 0.7)

    // Speaker name plate (top-left of box)
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 110, boxY - boxH / 2 - 16, 220, 30, 0x2a1a0c)
      .setScrollFactor(0).setStrokeStyle(2, 0xa98758)
    const nameText = this.add.text(boxX - boxW / 2 + 110, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '18px', color: '#f5e5c5', fontStyle: '600',
    }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setLetterSpacing(1)

    // Body text
    const bodyText = this.add.text(boxX - boxW / 2 + 40, boxY - boxH / 2 + 28, beats[0], {
      fontFamily: FONT_BODY, fontSize: '22px', color: '#f5e5c5',
      wordWrap: { width: boxW - 80, useAdvancedWrap: true },
      lineSpacing: 6,
    }).setScrollFactor(0).setResolution(3)

    // Advance hint
    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24,
      'click / space  →', {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#d4b890', fontStyle: 'italic',
      })
      .setScrollFactor(0).setResolution(3).setOrigin(1, 1)

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
    const closeAll = () => {
      while (idx < beats.length) idx++
      advance()
    }

    // Register handlers AFTER a delay so the click that opened this
    // dialog (mayor/building) does not immediately advance it.
    this.time.delayedCall(120, () => {
      this.input.keyboard?.on('keydown-SPACE', advance)
      this.input.keyboard?.on('keydown-ESC', closeAll)
      this.input.on('pointerdown', advance)
    })
  }

  // ============================================================
  // UPDATE LOOP — movement
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
    // Normalise diagonals
    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.sqrt(2)
      vx *= inv; vy *= inv
    }
    body.setVelocity(vx * speed, vy * speed)
    // Sync the floating head with the body
    const head = this.player.getData('head') as Phaser.GameObjects.Arc
    if (head) {
      head.x = this.player.x
      head.y = this.player.y - 12
    }
  }
}
