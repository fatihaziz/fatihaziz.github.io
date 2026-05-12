import Phaser from 'phaser'

/**
 * J.4 Embers' Forge interior. A stone smithy with a glowing forge on the
 * left wall, a central anvil, and eight weapons mounted on the back wall.
 * Each weapon corresponds to one of the crafter's skills; the mastery pips
 * underneath show how deeply it has been honed (filled = mastered).
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

interface Weapon {
  name: string
  mastery: number             // 0..5 filled pips out of 5
  // Visual recipe -- a vertical weapon silhouette drawn from primitives
  hilt: number                // hilt + handle colour
  blade: number               // blade colour
  pommel: number              // pommel gem colour
  shape: 'sword' | 'hammer' | 'axe' | 'staff' | 'dagger' | 'bow'
  beats: string[]
}

const WEAPONS: Weapon[] = [
  {
    name: 'Brass Hammer',
    mastery: 5, hilt: 0x8a5a2a, blade: 0xc8a050, pommel: 0xa83232, shape: 'hammer',
    beats: [
      'A hammer the crafter has carried longest. The brass head is dented in three places, each from a job that mattered.',
      'It hits exactly where it is aimed -- not because the hammer is clever, but because the arm above it stopped flinching years ago.',
    ],
  },
  {
    name: 'Sealing Quill',
    mastery: 5, hilt: 0x4a3520, blade: 0xe8d8a8, pommel: 0xc04848, shape: 'dagger',
    beats: [
      'A quill the crafter forged into a small blade. Used to write contracts that bind, and to cut them when binding stops being honest.',
      'The crafter learned early that a seal is only as strong as the willingness to break it when the cause demands. The quill remembers both.',
    ],
  },
  {
    name: 'Loom Stave',
    mastery: 5, hilt: 0x4a3520, blade: 0x9d8fbf, pommel: 0x70a8d8, shape: 'staff',
    beats: [
      'A staff hewn from a single piece of pale wood, with a crystal at the head that hums when threads are taut.',
      'The crafter uses it to weave many tasks into a single pattern. The hum tells them when one thread is straining the others.',
    ],
  },
  {
    name: "Tide Compass",
    mastery: 4, hilt: 0x8a5a2a, blade: 0x70a8a8, pommel: 0xf5e5c5, shape: 'sword',
    beats: [
      'A compass set into a sword hilt. Points always at the heaviest current in a room, not the loudest voice in it.',
      'The crafter swings it lightly -- the weight is in the reading, not the blade. Useful for cutting through the wrong question.',
    ],
  },
  {
    name: 'Lantern Iron',
    mastery: 4, hilt: 0x4a3520, blade: 0xc8a050, pommel: 0xf5b878, shape: 'hammer',
    beats: [
      'An iron worked while a lantern burned beside it -- the crafter learned to forge by warmth, not by daylight.',
      'It keeps things lit when other tools would go cold. The Inn-keep borrowed one once and never gave it back.',
    ],
  },
  {
    name: 'Ember Stylus',
    mastery: 4, hilt: 0x4a3520, blade: 0xf5b878, pommel: 0xc04848, shape: 'dagger',
    beats: [
      'A small bright tool for drawing in the air. The crafter uses it to sketch what a thing should look like before the loom and stave commit.',
      'Sketches that please the eye, but only because the hand learned what the eye actually wants -- which took longer than the eye admits.',
    ],
  },
  {
    name: 'Beacon Lens',
    mastery: 3, hilt: 0x4a3520, blade: 0xf5e5c5, pommel: 0x70a8d8, shape: 'staff',
    beats: [
      "A lens on a wooden rod -- the crafter holds it up and far-off signals come closer without the watcher having to walk to them.",
      'Useful when the village runs many things at once and no one person can be at every furnace. The crafter is still honing this one.',
    ],
  },
  {
    name: 'Whisper-Knife',
    mastery: 4, hilt: 0x8a5a2a, blade: 0xc0c8d0, pommel: 0x4a3520, shape: 'dagger',
    beats: [
      'A small knife the crafter uses to pare back what is already made. To remove what does not belong, gently, without cutting the rest.',
      'Most of the work is choosing where not to cut. The crafter says this knife taught them more than the hammer ever did.',
    ],
  },
]

export default class EmbersForge extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private player!: Phaser.Physics.Arcade.Sprite
  private dialogOpen = false
  private doorZone!: Phaser.GameObjects.Zone

  constructor() {
    super('EmbersForge')
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a0c08')
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(-300, -180, WORLD_W + 600, WORLD_H + 360)
    this.cameras.main.centerOn(WORLD_W / 2, WORLD_H / 2)

    this.buildFloor()
    this.buildWalls()
    this.buildSign()
    this.buildForgeFire()
    this.buildAnvil()
    this.buildWeaponRack()
    this.buildDoor()
    this.buildPlayer()
    this.buildHud()
    this.buildEmberMotes()

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
    // Warm soot-grey base
    this.add.rectangle(fx, fy, fw, fh, 0x3a2820).setOrigin(0, 0).setDepth(0)
    // Grout grid
    for (let c = 1; c < COLS - 1; c++) {
      this.add.rectangle(c * TILE, fy, 1, fh, 0x1a0c08, 0.7).setOrigin(0, 0).setDepth(0.1)
    }
    for (let r = 1; r < ROWS - 1; r++) {
      this.add.rectangle(fx, r * TILE, fw, 1, 0x1a0c08, 0.7).setOrigin(0, 0).setDepth(0.1)
    }
    // Random darker bricks for grain
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const n = (r * 31 + c * 17) % 100
        if (n < 14) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x2a1810)
            .setOrigin(0, 0).setDepth(0.15)
        } else if (n < 22) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x4a2818)
            .setOrigin(0, 0).setDepth(0.15)
        }
      }
    }
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
    this.add.rectangle(sx, sy, 480, 56, 0x2a1408, 0.94)
      .setStrokeStyle(3, 0xc8a050).setDepth(2)
    this.add.text(sx, sy, "Embers' Forge", {
      fontFamily: FONT_TITLE, fontSize: '28px', color: '#f5d8a8',
      fontStyle: '600', stroke: '#1a0c08', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(3).setDepth(3)
    this.add.text(sx, sy + 32, 'eight weapons, eight ways of striking true', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#e8c890', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(3)
  }

  private buildForgeFire() {
    // Forge fire on the left wall, big enough to read clearly
    const fx = TILE * 2.0
    const fy = 7.5 * TILE
    const alcoveW = TILE * 2.6
    const alcoveH = TILE * 3.0
    // Forge brick alcove + stone lip
    this.add.rectangle(fx, fy, alcoveW, alcoveH, 0x1a0c08, 1)
      .setStrokeStyle(3, 0x4a2818).setDepth(2)
    // Brick chimney throat -- a darker hollow at the top
    this.add.rectangle(fx, fy - alcoveH * 0.35, alcoveW * 0.6, alcoveH * 0.20, 0x0a0604, 1).setDepth(2.1)
    // Stone lip below
    this.add.rectangle(fx, fy + alcoveH / 2 - 8, alcoveW, 12, 0x6a4828).setStrokeStyle(2, 0x2a1408).setDepth(2.2)
    // Coal-bed at the bottom (orange/red base)
    this.add.rectangle(fx, fy + alcoveH * 0.20, alcoveW - 20, 22, 0x8a3010).setDepth(2.5)

    // Three teardrop-shaped flames via polygon
    const fyBase = fy + alcoveH * 0.18
    const flameMain = this.add.polygon(fx, fyBase - 22,
      [-22, 22, -16, 4, -8, -12, 0, -28, 8, -10, 16, 6, 22, 22],
      0xff8030)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(3).setAlpha(0.85)
    const flameInner = this.add.polygon(fx, fyBase - 14,
      [-14, 14, -8, 2, 0, -18, 8, 0, 14, 14],
      0xffd060)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(3.1).setAlpha(0.9)
    const flameCore = this.add.polygon(fx, fyBase - 6,
      [-7, 7, 0, -10, 7, 7],
      0xfff0a0)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(3.2)

    // Glow halo around the whole thing
    const halo = this.add.circle(fx, fyBase - 6, 56, 0xff7020, 0.30)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.8)

    // Flicker tweens
    this.tweens.add({
      targets: [flameMain], scaleY: 1.15, scaleX: 0.92, alpha: 0.7,
      duration: 320, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: [flameInner], scaleY: 1.20, scaleX: 0.88, alpha: 0.75,
      duration: 240, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: [flameCore], scaleY: 1.25, scaleX: 0.85,
      duration: 180, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: [halo], radius: 68, alpha: 0.18,
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })

    // Hearth label
    this.add.text(fx, fy + alcoveH / 2 + 18, 'the Hearth', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#f5b878',
      fontStyle: 'italic', stroke: '#1a0c08', strokeThickness: 2,
    }).setOrigin(0.5).setResolution(3).setDepth(4)
  }

  private buildAnvil() {
    // Central anvil + tools, decorative
    const ax = (COLS / 2) * TILE
    const ay = (ROWS - 5) * TILE
    // Anvil base (stump)
    this.add.rectangle(ax, ay + 12, 38, 36, 0x4a2818).setStrokeStyle(2, 0x2a1408).setDepth(3)
    // Anvil body (steel)
    this.add.rectangle(ax, ay - 12, 70, 22, 0x4a4a52).setStrokeStyle(2, 0x2a2a32).setDepth(4)
    // Anvil horn (left taper)
    this.add.triangle(ax - 42, ay - 12, 0, 0, 14, -6, 14, 6, 0x4a4a52).setStrokeStyle(2, 0x2a2a32).setDepth(4)
    // Anvil top stripe
    this.add.rectangle(ax, ay - 22, 60, 4, 0x6a6a72).setDepth(4.5)
    // Small hammer leaning on anvil
    this.add.rectangle(ax + 26, ay - 22, 4, 22, 0x4a3520).setDepth(5)
    this.add.rectangle(ax + 26, ay - 30, 14, 8, 0x6a6a72).setStrokeStyle(1, 0x2a2a32).setDepth(5.1)
  }

  private drawWeapon(cx: number, cy: number, w: Weapon, depth: number): Phaser.GameObjects.GameObject[] {
    // Draws a vertical weapon centered on (cx, cy). Returns the parts so we
    // can tween them collectively.
    const parts: Phaser.GameObjects.GameObject[] = []
    const len = 88
    const top = cy - len / 2
    const bot = cy + len / 2

    if (w.shape === 'sword') {
      // Blade (top 60% of length)
      parts.push(this.add.rectangle(cx, top + len * 0.30, 8, len * 0.60, w.blade)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      // Crossguard
      parts.push(this.add.rectangle(cx, top + len * 0.60, 32, 6, w.hilt).setDepth(depth + 0.1))
      // Hilt grip
      parts.push(this.add.rectangle(cx, top + len * 0.74, 6, len * 0.22, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.1))
      // Pommel
      parts.push(this.add.circle(cx, bot - 4, 6, w.pommel).setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.2))
    } else if (w.shape === 'dagger') {
      // Shorter overall
      parts.push(this.add.rectangle(cx, top + len * 0.28, 7, len * 0.50, w.blade)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      parts.push(this.add.rectangle(cx, top + len * 0.55, 22, 5, w.hilt).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx, top + len * 0.72, 6, len * 0.30, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.1))
      parts.push(this.add.circle(cx, bot - 4, 5, w.pommel).setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.2))
    } else if (w.shape === 'hammer') {
      // Long handle + boxy head at top
      parts.push(this.add.rectangle(cx, cy + len * 0.10, 6, len * 0.80, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      parts.push(this.add.rectangle(cx, top + 10, 26, 18, w.blade)
        .setStrokeStyle(2, 0x2a1408).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx, top + 6, 22, 4, 0xf5e5c5, 0.7).setDepth(depth + 0.15))
      parts.push(this.add.circle(cx, bot - 4, 5, w.pommel).setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.2))
    } else if (w.shape === 'staff') {
      // Long rod + crystal at top
      parts.push(this.add.rectangle(cx, cy, 5, len, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      // Crystal -- a diamond shape
      parts.push(this.add.polygon(cx, top + 4, [0, -10, 8, 0, 0, 10, -8, 0], w.blade)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.1))
      // Crystal glow
      parts.push(this.add.circle(cx, top + 4, 12, w.blade, 0.35)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth - 0.1))
      // Wrappings
      parts.push(this.add.rectangle(cx, cy - 12, 9, 4, w.pommel).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx, cy + 12, 9, 4, w.pommel).setDepth(depth + 0.1))
    } else if (w.shape === 'axe') {
      parts.push(this.add.rectangle(cx, cy, 6, len, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      // Axe head (right-side blade)
      parts.push(this.add.triangle(cx + 12, top + 14, 0, -14, 0, 14, 16, 0, w.blade)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth + 0.1))
    } else if (w.shape === 'bow') {
      parts.push(this.add.rectangle(cx, cy, 5, len, w.hilt)
        .setStrokeStyle(1, 0x1a0c08).setDepth(depth))
      parts.push(this.add.rectangle(cx, cy, 1, len - 8, w.blade, 0.8).setDepth(depth + 0.1))
    }
    return parts
  }

  private buildWeaponRack() {
    // Two horizontal rack plaques across the back wall, 4 weapons per row.
    // Total 8 weapons. Each gets ~3 tiles of horizontal room -- plenty for
    // a full name + pips without overlap.
    const rackX0 = 4.5 * TILE
    const rackX1 = (COLS - 2.5) * TILE
    const rackW = rackX1 - rackX0
    const rowYs = [3.0 * TILE, 7.0 * TILE]   // top + bottom rack plaque y

    rowYs.forEach((rackY) => {
      this.add.rectangle(rackX0 + rackW / 2, rackY, rackW, 18, 0x3a2418)
        .setStrokeStyle(2, 0x1a0c08).setDepth(1.5)
      this.add.rectangle(rackX0 + rackW / 2, rackY - 2, rackW - 8, 2, 0x5a3826, 0.7).setDepth(1.6)
    })

    const perRow = 4
    const padding = TILE * 0.8
    const innerW = rackW - padding * 2
    const step = innerW / (perRow - 1)

    WEAPONS.forEach((w, i) => {
      const row = Math.floor(i / perRow)
      const col = i % perRow
      const wx = rackX0 + padding + step * col
      const wy = rowYs[row] + 64
      const parts = this.drawWeapon(wx, wy, w, 2)
      parts.forEach((p) => {
        const start = (p as Phaser.GameObjects.Components.Transform).y
        this.tweens.add({
          targets: p, y: start - 2,
          duration: 1700 + i * 70,
          ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
          delay: i * 90,
        })
      })

      // Name label
      this.add.text(wx, wy + 60, w.name, {
        fontFamily: FONT_TITLE, fontSize: '14px', color: '#f5d8a8',
        fontStyle: '600', stroke: '#1a0c08', strokeThickness: 3,
      }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(4)

      // Mastery pips -- bright orange when filled, hollow brass ring when not
      for (let p = 0; p < 5; p++) {
        const px = wx - 28 + p * 14
        const py = wy + 80
        const filled = p < w.mastery
        if (filled) {
          this.add.circle(px, py, 5, 0xff9040)
            .setStrokeStyle(1.5, 0x1a0c08).setDepth(4)
        } else {
          this.add.circle(px, py, 5, 0x2a1408)
            .setStrokeStyle(2, 0xc8a050).setDepth(4)
        }
      }

      const hit = this.add.zone(wx, wy + 20, 80, 160)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(w.name, w.beats))
    })
  }

  private buildEmberMotes() {
    // Small embers drift up from the forge fire region
    for (let i = 0; i < 16; i++) {
      const mx = TILE * 1.0 + Math.random() * TILE * 1.0
      const my = 8 * TILE + Math.random() * 60
      const m = this.add.circle(mx, my, 1.8 + Math.random(), 0xff9040, 0.85)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(3.5)
      this.tweens.add({
        targets: m,
        y: my - 200 - Math.random() * 160,
        x: mx + (Math.random() - 0.5) * 100,
        alpha: 0,
        duration: 3200 + Math.random() * 2200,
        delay: Math.random() * 3500,
        ease: 'Sine.easeOut',
        repeat: -1,
        onRepeat: () => {
          m.y = 8 * TILE + Math.random() * 60
          m.x = TILE * 1.0 + Math.random() * TILE * 1.0
          m.setAlpha(0.85)
        },
      })
    }
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
      fontFamily: FONT_BODY, fontSize: '13px', color: '#f5d8a8', fontStyle: 'italic',
      stroke: '#1a0c08', strokeThickness: 2,
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  private buildPlayer() {
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
      'click a weapon to hear its tempering   ·   walk to the door or press ESC to leave',
      {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#f5d8a8',
        stroke: '#1a0c08', strokeThickness: 3,
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

    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x1a0c08, 0.96)
      .setScrollFactor(0).setStrokeStyle(3, 0xc8a050).setDepth(200)
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xe8c890, 0.7).setDepth(201)
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 160, boxY - boxH / 2 - 16, 320, 30, 0x1a0c08)
      .setScrollFactor(0).setStrokeStyle(2, 0xc8a050).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 160, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#f5d8a8', fontStyle: '600',
    }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setLetterSpacing(1).setDepth(203)
    const bodyText = this.add.text(boxX - boxW / 2 + 40, boxY - boxH / 2 + 28, beats[0], {
      fontFamily: FONT_BODY, fontSize: '22px', color: '#f5d8a8',
      wordWrap: { width: boxW - 80, useAdvancedWrap: true }, lineSpacing: 6,
    }).setScrollFactor(0).setResolution(3).setDepth(203)
    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24, 'click / space →', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#e8c890', fontStyle: 'italic',
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
