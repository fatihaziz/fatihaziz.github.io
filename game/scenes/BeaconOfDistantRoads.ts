import Phaser from 'phaser'

/**
 * J.6 Beacon of Distant Roads interior. A circular stone watch-room at the
 * top of a beacon-tower, with four signal-braziers arranged in an arc.
 * Each brazier lights a different "road" -- a different way to reach the
 * crafter when the visitor leaves the valley.
 *
 * Beats are in-world Frieren prose; the real contact handle should be
 * appended to the second beat once the site owner is ready to publish it.
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 3
const TILE = SRC_TILE * SCALE
const COLS = 22
const ROWS = 14
const WORLD_W = COLS * TILE
const WORLD_H = ROWS * TILE

const T = {
  STONE_WALL: 100,
  STONE_CREN_M: 97,
  STONE_BASE_M: 109,
  DOOR_BIG: 103,
}

interface SignalFlame {
  name: string                    // long, ceremonial name (shown in dialog)
  shortName: string               // one-word label under the brazier
  flameColor: number              // outer flame hue (also halo)
  innerColor: number
  beats: string[]
}

const FLAMES: SignalFlame[] = [
  {
    name: 'The Hearth-Word Flame',
    shortName: 'Hearth-Word',
    flameColor: 0xff8030, innerColor: 0xffd060,
    beats: [
      'A small steady flame the crafter uses for letters meant to be opened in private -- the kind written at a kitchen table, not a guild-hall.',
      'Send a sealed envelope toward the crafter\'s hearth. The path is left on the sign-board outside the Beacon for those who would write.',
    ],
  },
  {
    name: 'The Loom-Trail Flame',
    shortName: 'Loom-Trail',
    flameColor: 0x70a8d8, innerColor: 0xc8e0f0,
    beats: [
      'A blue flame that points toward the open workshop, where every loom the crafter has ever built is laid out for any apprentice who would learn from them.',
      'Follow the blue flame to find the crafter\'s open looms. The path is marked on the sign-board outside the Beacon.',
    ],
  },
  {
    name: 'The Guild-Hall Flame',
    shortName: 'Guild-Hall',
    flameColor: 0xc8a050, innerColor: 0xf5e5c5,
    beats: [
      'An amber flame favoured by guild masters and registrars. Used when a meeting must be witnessed and a contract recorded.',
      'Wake this flame when the matter requires a guild-introduction. The crafter\'s guild-name is listed on the sign-board outside the Beacon.',
    ],
  },
  {
    name: "The Crier's Flame",
    shortName: 'Crier',
    flameColor: 0x9d8fbf, innerColor: 0xe8dcf5,
    beats: [
      "A purple flame the village criers used to use to call out short news. The crafter keeps one out of habit; they leave brief words there when the road is long.",
      "If the matter is small and the answer can wait a day, leave a note at the crier's flame. The path is on the sign-board outside the Beacon.",
    ],
  },
]

export default class BeaconOfDistantRoads extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private player!: Phaser.Physics.Arcade.Sprite
  private dialogOpen = false
  private doorZone!: Phaser.GameObjects.Zone

  constructor() {
    super('BeaconOfDistantRoads')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0a0814')
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(-300, -180, WORLD_W + 600, WORLD_H + 360)
    this.cameras.main.centerOn(WORLD_W / 2, WORLD_H / 2)

    this.buildFloor()
    this.buildWalls()
    this.buildSign()
    this.buildArrowSlits()
    this.buildBraziers()
    this.buildCentralLens()
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
      .setOrigin(0, 0).setScale(SCALE).setDepth(depth)
  }

  private buildFloor() {
    const fx = TILE
    const fy = TILE
    const fw = (COLS - 2) * TILE
    const fh = (ROWS - 2) * TILE
    // Cool blue-stone floor of a high tower
    this.add.rectangle(fx, fy, fw, fh, 0x2a2a3a).setOrigin(0, 0).setDepth(0)
    for (let c = 1; c < COLS - 1; c++) {
      this.add.rectangle(c * TILE, fy, 1, fh, 0x1a1a26, 0.7).setOrigin(0, 0).setDepth(0.1)
    }
    for (let r = 1; r < ROWS - 1; r++) {
      this.add.rectangle(fx, r * TILE, fw, 1, 0x1a1a26, 0.7).setOrigin(0, 0).setDepth(0.1)
    }
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const n = (r * 31 + c * 17) % 100
        if (n < 14) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x222230)
            .setOrigin(0, 0).setDepth(0.15)
        } else if (n < 22) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x32324a)
            .setOrigin(0, 0).setDepth(0.15)
        }
      }
    }
    // Inlaid compass-circle on the floor at centre
    const cx = (COLS / 2) * TILE
    const cy = (ROWS / 2) * TILE
    this.add.circle(cx, cy, 130, 0x000000, 0).setStrokeStyle(2, 0x70a8d8, 0.55).setDepth(0.2)
    this.add.circle(cx, cy, 90, 0x000000, 0).setStrokeStyle(2, 0x70a8d8, 0.45).setDepth(0.2)
    this.add.circle(cx, cy, 50, 0x000000, 0).setStrokeStyle(2, 0x70a8d8, 0.4).setDepth(0.2)
    // Compass rose lines (N, E, S, W)
    const lines: [number, number, number, number][] = [
      [cx, cy - 130, cx, cy + 130],
      [cx - 130, cy, cx + 130, cy],
    ]
    lines.forEach(([x1, y1, x2, y2]) => {
      const g = this.add.graphics().setDepth(0.21)
      g.lineStyle(1, 0x70a8d8, 0.4).beginPath()
      g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokePath()
    })
  }

  private buildWalls() {
    for (let c = 0; c < COLS; c++) this.tile(c, 0, T.STONE_CREN_M, 1)
    for (let r = 1; r < ROWS - 1; r++) {
      this.tile(0, r, T.STONE_WALL, 1)
      this.tile(COLS - 1, r, T.STONE_WALL, 1)
    }
    const doorC = Math.floor(COLS / 2)
    for (let c = 0; c < COLS; c++) {
      if (c === doorC - 1 || c === doorC) continue
      this.tile(c, ROWS - 1, T.STONE_BASE_M, 1)
    }
  }

  private buildSign() {
    const sx = (COLS / 2) * TILE
    const sy = 1.4 * TILE
    this.add.rectangle(sx, sy, 580, 56, 0x141422, 0.94)
      .setStrokeStyle(3, 0x70a8d8).setDepth(2)
    this.add.text(sx, sy, 'Beacon of Distant Roads', {
      fontFamily: FONT_TITLE, fontSize: '28px', color: '#dce8f5',
      fontStyle: '600', stroke: '#040408', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(3).setDepth(3)
    this.add.text(sx, sy + 32, 'four flames, four roads home', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#a8c0d8', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(3)
  }

  private buildArrowSlits() {
    // Narrow window slits along the side walls -- starlight pouring in
    const rows = [3, 6, 9]
    rows.forEach((r) => {
      // Left wall
      this.add.rectangle(TILE * 1.05, r * TILE + TILE * 0.5, 8, TILE * 0.7, 0x141422)
        .setStrokeStyle(2, 0x4a4a62).setDepth(1.5)
      this.add.rectangle(TILE * 1.05, r * TILE + TILE * 0.5, 4, TILE * 0.6, 0x88a8d8, 0.45)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(1.6)
      // Right wall
      this.add.rectangle((COLS - 1.05) * TILE, r * TILE + TILE * 0.5, 8, TILE * 0.7, 0x141422)
        .setStrokeStyle(2, 0x4a4a62).setDepth(1.5)
      this.add.rectangle((COLS - 1.05) * TILE, r * TILE + TILE * 0.5, 4, TILE * 0.6, 0x88a8d8, 0.45)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(1.6)
    })
  }

  private drawBrazier(cx: number, cy: number, flame: SignalFlame, depth: number) {
    // Brazier scale: a taller, more visible pedestal so 4 in a horizontal row
    // read clearly. cy here is the bowl-rim y (where the flames sit on top).
    // Pedestal: a tapered column
    this.add.rectangle(cx, cy + 80, 40, 18, 0x4a4a62)
      .setStrokeStyle(2, 0x2a2a3a).setDepth(depth)
    this.add.rectangle(cx, cy + 60, 32, 28, 0x5a5a72)
      .setStrokeStyle(2, 0x2a2a3a).setDepth(depth + 0.1)
    this.add.rectangle(cx, cy + 36, 24, 24, 0x6a6a82)
      .setStrokeStyle(2, 0x2a2a3a).setDepth(depth + 0.15)
    // Bowl: wider rim sitting on the column
    this.add.rectangle(cx, cy + 18, 58, 14, 0x6a6a82)
      .setStrokeStyle(2, 0x2a2a3a).setDepth(depth + 0.2)
    this.add.rectangle(cx, cy + 14, 62, 4, 0x4a4a62).setDepth(depth + 0.25)
    // Coal bed
    this.add.rectangle(cx, cy + 6, 46, 10, 0x4a2818)
      .setStrokeStyle(1, 0x2a1408).setDepth(depth + 0.3)

    // Three nested teardrop flames in the flame's signature colour, big enough
    // to read across the room
    const halo = this.add.circle(cx, cy - 10, 56, flame.flameColor, 0.35)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth + 0.35)
    const flameOuter = this.add.polygon(cx, cy - 18,
      [-22, 24, -14, 4, -8, -14, 0, -32, 8, -12, 14, 6, 22, 24],
      flame.flameColor)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth + 0.4).setAlpha(0.85)
    const flameInner = this.add.polygon(cx, cy - 12,
      [-14, 16, -8, 2, 0, -20, 8, 2, 14, 16],
      flame.innerColor)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth + 0.5).setAlpha(0.9)
    const flameCore = this.add.polygon(cx, cy - 6,
      [-6, 8, 0, -12, 6, 8],
      0xffffff)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth + 0.6)

    this.tweens.add({
      targets: flameOuter, scaleY: 1.15, scaleX: 0.9, alpha: 0.7,
      duration: 320, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: flameInner, scaleY: 1.20, scaleX: 0.88, alpha: 0.75,
      duration: 240, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: flameCore, scaleY: 1.30, scaleX: 0.82,
      duration: 180, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: halo, radius: 72, alpha: 0.18,
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
  }

  private buildBraziers() {
    // Four braziers in a horizontal row across the upper half, each in its
    // own column so labels never collide. Each gets ~5 tiles of horizontal
    // room.
    const cols = [4, 9, 13.5, 18]
    const brazierY = 5.0 * TILE
    FLAMES.forEach((f, i) => {
      const bx = cols[i] * TILE
      const by = brazierY
      this.drawBrazier(bx, by, f, 2)

      // Two-line label: short name + "Flame" suffix
      this.add.text(bx, by + 114, f.shortName, {
        fontFamily: FONT_TITLE, fontSize: '15px', color: '#dce8f5',
        fontStyle: '600', stroke: '#040408', strokeThickness: 3,
      }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(4)
      this.add.text(bx, by + 134, 'Flame', {
        fontFamily: FONT_BODY, fontSize: '12px', color: '#a8c0d8',
        fontStyle: 'italic', stroke: '#040408', strokeThickness: 2,
      }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(4)

      // Generous hit zone covering brazier + label
      const hit = this.add.zone(bx, by + 30, 110, 200)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(f.name, f.beats))
    })
  }

  private buildCentralLens() {
    // A beacon's central crystal-lens at the heart of the room. Sits below
    // the brazier row so it doesn't fight for attention with the flames.
    const cx = (COLS / 2) * TILE
    const cy = 8.5 * TILE
    // Stand
    this.add.rectangle(cx, cy + 36, 32, 14, 0x6a4828)
      .setStrokeStyle(2, 0x2a1408).setDepth(3)
    this.add.rectangle(cx, cy + 22, 24, 14, 0x8a5028)
      .setStrokeStyle(2, 0x2a1408).setDepth(3.1)
    // Lens (crystal)
    const lens = this.add.ellipse(cx, cy + 0, 42, 52, 0x88c8f0, 0.7)
      .setStrokeStyle(2, 0xc8d8e8).setDepth(3.2)
    this.add.ellipse(cx, cy - 6, 18, 26, 0xc8e8ff, 0.4).setDepth(3.3)
    // Halo
    const halo = this.add.circle(cx, cy, 40, 0x88c8f0, 0.32)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(3.15)
    this.tweens.add({
      targets: [lens, halo], scaleX: 1.05, scaleY: 1.05,
      duration: 1400, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    // Lens label
    this.add.text(cx, cy + 60, 'the Beacon-Lens', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#88c8f0',
      fontStyle: 'italic', stroke: '#040408', strokeThickness: 2,
    }).setOrigin(0.5).setResolution(3).setDepth(4)
  }

  private buildDoor() {
    const doorC = Math.floor(COLS / 2)
    const doorR = ROWS - 1
    this.tile(doorC - 1, doorR, T.DOOR_BIG, 1)
    this.tile(doorC, doorR, T.DOOR_BIG, 1)
    const dx = doorC * TILE
    const dy = doorR * TILE + TILE / 2
    this.doorZone = this.add.zone(dx, dy, 2 * TILE, TILE)
      .setInteractive({ useHandCursor: true })
    this.doorZone.on('pointerdown', () => this.exitToOverworld())
    this.add.text(dx, dy + TILE * 0.4, '← Back to Aetherveil  (ESC)', {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#a8c0d8', fontStyle: 'italic',
      stroke: '#040408', strokeThickness: 2,
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  private buildPlayer() {
    // Spawn south, slightly out of the door zone so we don't auto-exit on entry
    const px = (COLS / 2) * TILE
    const py = (ROWS - 3) * TILE
    this.add.ellipse(px, py + 22, 30, 9, 0x000000, 0.30).setDepth(4)
    this.player = this.physics.add.sprite(px, py, 'tiny-dungeon', 100)
      .setScale(3).setDepth(5)
    this.player.setCollideWorldBounds(true)
  }

  private buildHud() {
    const camH = this.scale.gameSize.height
    this.add.text(this.scale.gameSize.width / 2, camH - 28,
      'click a brazier to wake its road   ·   walk to the door or press ESC to leave',
      {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#dce8f5',
        stroke: '#040408', strokeThickness: 3,
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

    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x0a0a14, 0.96)
      .setScrollFactor(0).setStrokeStyle(3, 0x70a8d8).setDepth(200)
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xa8c0d8, 0.7).setDepth(201)
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 200, boxY - boxH / 2 - 16, 400, 30, 0x0a0a14)
      .setScrollFactor(0).setStrokeStyle(2, 0x70a8d8).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 200, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#dce8f5', fontStyle: '600',
    }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setLetterSpacing(1).setDepth(203)
    const bodyText = this.add.text(boxX - boxW / 2 + 40, boxY - boxH / 2 + 28, beats[0], {
      fontFamily: FONT_BODY, fontSize: '22px', color: '#dce8f5',
      wordWrap: { width: boxW - 80, useAdvancedWrap: true }, lineSpacing: 6,
    }).setScrollFactor(0).setResolution(3).setDepth(203)
    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24, 'click / space →', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#a8c0d8', fontStyle: 'italic',
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
    this.cameras.main.fadeOut(280, 8, 8, 20)
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
