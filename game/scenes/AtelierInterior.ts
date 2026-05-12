import Phaser from 'phaser'

/**
 * J.2 The Atelier interior. A timber-walled workshop with five workbenches
 * arranged around a central aisle. Each bench displays a single "craft"
 * (a placeholder for one of the Atelier's projects, in-world). Clicking a
 * craft opens a dialog beat describing it. A door at the south returns
 * the visitor to AetherveilOverworld.
 *
 * No real-life names appear here -- all crafts are in-world objects with
 * Frieren-coded names (Brass Loom, Sealing Quill, etc.). Real project
 * descriptions can replace the placeholders without touching layout.
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 3                       // bigger tiles indoors -- 48 px each
const TILE = SRC_TILE * SCALE         // 48
const COLS = 22
const ROWS = 14
const WORLD_W = COLS * TILE           // 1056
const WORLD_H = ROWS * TILE           // 672

// Tile constants -- a subset of tiny-town frames good for interior reads
const T = {
  WOOD_FLOOR_A: 39,        // pure brown dirt -- reads as workshop floor
  WOOD_FLOOR_B: 40,
  WOOD_FLOOR_C: 41,
  STONE_WALL: 100,         // wall middle band
  STONE_CREN_M: 97,        // crenellation top -- used as cap row
  STONE_BASE_M: 109,
  DOOR_BIG: 103,           // castle door -- works for entrance
  BENCH_TOP: 72,           // brown horizontal plank/bench top
  BENCH_BASE: 73,          // brown small box
  ROOF_PEAK: 67,
}

interface Craft {
  name: string
  iconFrame: number        // tiny-town frame index for the displayed item
  beats: string[]
}

const CRAFTS: Craft[] = [
  {
    name: 'Brass Loom',
    iconFrame: 117,
    beats: [
      'A brass-frame loom that weaves a thousand threads at once -- the crafter calls it a "data pipeline" when no one is listening.',
      'Pull on any one thread and ten more shift in answer. Useful for sorting harvests, fishery records, the keeper\'s scroll-counts.',
    ],
  },
  {
    name: 'Sealing Quill',
    iconFrame: 119,
    beats: [
      'A quill of forged iron and reed. Each signature it makes is unique, and only the bearer of the matching key can break the seal.',
      'The crafter says it remembers every hand that has held it. Useful when trust must travel further than the speaker can.',
    ],
  },
  {
    name: "Tide-Charter's Lens",
    iconFrame: 95,
    beats: [
      'A bronze lens set in a wooden frame. Hold it over coin-tallies or harvest-logs and the patterns rise like fish to bait.',
      'The crafter charts the tides of value with it -- which seasons hold, which months break. A merchant\'s tool, gentled.',
    ],
  },
  {
    name: "Hearthkeeper's Lantern",
    iconFrame: 93,
    beats: [
      'A lantern that holds a steady flame for a thousand nights without needing oil. The crafter built it for the Inn-keep first.',
      'Other townsmen use it now to light the road from Greybranch when storms keep the moon hidden.',
    ],
  },
  {
    name: 'Soft Cog',
    iconFrame: 129,
    beats: [
      'A small wooden cog that turns inside any other cog and never grinds. The crafter says it is mostly listening, only a little turning.',
      'Place it where a thing keeps breaking, and the breaking grows quieter. The Forge took two for the bellows.',
    ],
  },
]

export default class AtelierInterior extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private player!: Phaser.Physics.Arcade.Sprite
  private dialogOpen = false
  private doorZone!: Phaser.GameObjects.Zone

  constructor() {
    super('AtelierInterior')
  }

  create() {
    this.cameras.main.setBackgroundColor('#2a1810')

    // Centre the interior in the 1600x1000 game canvas (camera is 1600x1000;
    // world is 1056x672). Set camera bounds wider than world so we get a
    // dim margin around the workshop, framing it like a vignette.
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(-300, -180, WORLD_W + 600, WORLD_H + 360)
    this.cameras.main.centerOn(WORLD_W / 2, WORLD_H / 2)

    this.buildFloor()
    this.buildWalls()
    this.buildSign()
    this.buildWorkbenches()
    this.buildDoor()
    this.buildPlayer()
    this.buildHud()

    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE,E,ESC') as Record<string, Phaser.Input.Keyboard.Key>
    this.input.keyboard?.on('keydown-ESC', () => {
      if (!this.dialogOpen) this.exitToOverworld()
    })
  }

  private tile(col: number, row: number, frame: number, depth = 0) {
    return this.add.image(col * TILE, row * TILE, 'tiny-town', frame)
      .setOrigin(0, 0)
      .setScale(SCALE)
      .setDepth(depth)
  }

  private buildFloor() {
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const n = (r * 31 + c * 17) % 100
        let f = T.WOOD_FLOOR_A
        if (n < 25) f = T.WOOD_FLOOR_B
        else if (n < 32) f = T.WOOD_FLOOR_C
        this.tile(c, r, f, 0)
      }
    }
  }

  private buildWalls() {
    // Top crenellation row (interior reads as exposed beams / stone trim)
    for (let c = 0; c < COLS; c++) this.tile(c, 0, T.STONE_CREN_M, 1)
    // Middle stone wall rows -- we keep the wall 1 tile thick on each side
    for (let r = 1; r < ROWS - 1; r++) {
      this.tile(0, r, T.STONE_WALL, 1)
      this.tile(COLS - 1, r, T.STONE_WALL, 1)
    }
    // Bottom row (south wall) -- skip the centre 2 tiles where the door is
    const doorC = Math.floor(COLS / 2)
    for (let c = 0; c < COLS; c++) {
      if (c === doorC - 1 || c === doorC) continue
      this.tile(c, ROWS - 1, T.STONE_BASE_M, 1)
    }
  }

  private buildSign() {
    // Wooden plaque hanging at the top of the room
    const sx = (COLS / 2) * TILE
    const sy = 1.4 * TILE
    this.add.rectangle(sx, sy, 460, 56, 0x4a3018, 0.92)
      .setStrokeStyle(3, 0xa98758).setDepth(2)
    this.add.text(sx, sy, 'The Atelier', {
      fontFamily: FONT_TITLE, fontSize: '28px', color: '#f5e5c5',
      fontStyle: '600', stroke: '#1a0a04', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(3).setDepth(3)
    this.add.text(sx, sy + 32, 'where wonders are forged from focused thought', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#d4b890', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(3)
  }

  private buildWorkbenches() {
    // Five workbenches, 2 columns x 3 rows minus one slot. Use grid layout.
    // Bench width 3 tiles, height 2 tiles (top plank + base + icon on top).
    const slots: [number, number][] = [
      [3, 5], [9, 5], [15, 5],   // back row
      [5, 9], [13, 9],            // front row
    ]
    CRAFTS.forEach((craft, i) => {
      if (i >= slots.length) return
      const [cx, cy] = slots[i]
      // Bench: 3 wide, 2 tall (top plank row + base row)
      for (let dx = 0; dx < 3; dx++) {
        this.tile(cx + dx, cy, T.BENCH_TOP, 2)
        this.tile(cx + dx, cy + 1, T.BENCH_BASE, 2)
      }
      // Icon -- the displayed craft. Centered on top of the bench plank.
      const ix = (cx + 1.5) * TILE
      const iy = cy * TILE - 6
      // Soft glow plate behind icon
      this.add.circle(ix, iy, 26, 0xf5e5c5, 0.18).setDepth(3)
      const icon = this.add.image(ix, iy, 'tiny-town', craft.iconFrame)
        .setScale(SCALE * 0.9).setDepth(4)
      // Idle bob to draw the eye
      this.tweens.add({
        targets: icon, y: iy - 4,
        duration: 1500 + i * 90, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: i * 120,
      })
      // Name label below the bench
      this.add.text((cx + 1.5) * TILE, (cy + 2) * TILE + 6, craft.name, {
        fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5',
        fontStyle: '500', stroke: '#1a0a04', strokeThickness: 3,
      }).setOrigin(0.5).setResolution(3).setDepth(4)
      // Hit-zone covering bench + icon
      const hit = this.add.zone(ix, (cy + 1) * TILE, 3 * TILE, 2.6 * TILE)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(craft.name, craft.beats))
    })
  }

  private buildDoor() {
    const doorC = Math.floor(COLS / 2)
    const doorR = ROWS - 1
    // Draw the door arch as 2 tiles wide at floor row
    this.tile(doorC - 1, doorR, T.DOOR_BIG, 1)
    this.tile(doorC, doorR, T.DOOR_BIG, 1)
    // Hit-zone above door (player walks through to exit)
    const dx = doorC * TILE
    const dy = doorR * TILE + TILE / 2
    this.doorZone = this.add.zone(dx, dy, 2 * TILE, TILE)
      .setInteractive({ useHandCursor: true })
    this.doorZone.on('pointerdown', () => this.exitToOverworld())
    // Door label
    this.add.text(dx, dy + TILE * 0.4, '← Back to Aetherveil  (ESC)', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#d4b890', fontStyle: 'italic',
      stroke: '#1a0a04', strokeThickness: 2,
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  private buildPlayer() {
    // Spawn in the south aisle, between the front-row benches.
    const px = (COLS / 2) * TILE
    const py = (ROWS - 3) * TILE
    this.add.ellipse(px, py + 22, 30, 9, 0x000000, 0.30).setDepth(4)
    this.player = this.physics.add.sprite(px, py, 'tiny-dungeon', 100)
      .setScale(3).setDepth(5)
    this.player.setCollideWorldBounds(true)
  }

  private buildHud() {
    // Persistent hint footer
    const camH = this.scale.gameSize.height
    this.add.text(this.scale.gameSize.width / 2, camH - 28,
      'click a craft to learn its making   ·   walk to the door or press ESC to leave',
      {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5',
        stroke: '#1a0a04', strokeThickness: 3,
      },
    ).setOrigin(0.5).setScrollFactor(0).setResolution(3).setDepth(100)
  }

  private showDialog(speaker: string, beats: string[]) {
    if (this.dialogOpen) return
    this.dialogOpen = true
    const camW = this.scale.gameSize.width
    const camH = this.scale.gameSize.height
    const boxW = Math.min(camW - 80, 1200)
    const boxH = 200
    const boxX = camW / 2
    const boxY = camH - boxH / 2 - 60

    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x2a1a0c, 0.96)
      .setScrollFactor(0).setStrokeStyle(3, 0xa98758).setDepth(200)
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xd4b890, 0.7).setDepth(201)
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 130, boxY - boxH / 2 - 16, 260, 30, 0x2a1a0c)
      .setScrollFactor(0).setStrokeStyle(2, 0xa98758).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 130, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#f5e5c5', fontStyle: '600',
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

  private exitToOverworld() {
    if (this.dialogOpen) return
    this.cameras.main.fadeOut(280, 26, 16, 8)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('AetherveilOverworld')
    })
  }

  update() {
    if (!this.player || !this.cursors || !this.wasd || this.dialogOpen) {
      if (this.player) this.player.setVelocity(0)
      return
    }
    this.player.setVelocity(0)
    const speed = 200
    let vx = 0, vy = 0
    if (this.cursors.left.isDown || this.wasd.A?.isDown) vx -= 1
    if (this.cursors.right.isDown || this.wasd.D?.isDown) vx += 1
    if (this.cursors.up.isDown || this.wasd.W?.isDown) vy -= 1
    if (this.cursors.down.isDown || this.wasd.S?.isDown) vy += 1
    if (vx !== 0 && vy !== 0) { const inv = 1 / Math.sqrt(2); vx *= inv; vy *= inv }
    this.player.setVelocity(vx * speed, vy * speed)
    if (vx < 0) this.player.setFlipX(true)
    else if (vx > 0) this.player.setFlipX(false)
    // Auto-exit when player overlaps the door zone.
    if (this.doorZone) {
      const dz = this.doorZone
      const px = this.player.x
      const py = this.player.y
      if (px >= dz.x - dz.width / 2 && px <= dz.x + dz.width / 2 &&
          py >= dz.y - dz.height / 2 && py <= dz.y + dz.height / 2) {
        this.exitToOverworld()
      }
    }
  }
}
