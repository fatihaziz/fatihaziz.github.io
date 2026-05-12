import Phaser from 'phaser'

/**
 * J.5 The Hearthlight Inn. A warm wood-floored common room with a stone
 * fireplace at the back wall and five mantel-pieces above the hearth -- one
 * for each chapter of the crafter's road. Clicking a trophy plays a 2-beat
 * memory. Two long tables sit in the middle of the room, decorative.
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

type TrophyShape = 'pot' | 'nest' | 'antler' | 'lantern' | 'scroll'

interface Chapter {
  name: string
  shape: TrophyShape
  primary: number
  accent: number
  beats: string[]
}

const CHAPTERS: Chapter[] = [
  {
    name: 'The Origin Stone',
    shape: 'pot',
    primary: 0xa07058, accent: 0x4a3520,
    beats: [
      'A clay pot from the cottage the crafter grew up in -- a small house on the edge of a forest no one had bothered to name yet.',
      "It chipped on the road and the crafter did not repair it. They keep it as a reminder that beginnings don't have to be tidy to be worth carrying.",
    ],
  },
  {
    name: 'The First Quill Lesson',
    shape: 'scroll',
    primary: 0xe8d8a8, accent: 0xa83232,
    beats: [
      'The first scroll the crafter ever wrote that the elder kept -- a single page of careful, wrong arithmetic.',
      "The elder wrote in the margin: 'Your sums are off, but your hand is steady. The first is correctable; the second is what I was looking for.' The crafter still reads it sometimes.",
    ],
  },
  {
    name: 'The Road to Greybranch',
    shape: 'lantern',
    primary: 0xc8a050, accent: 0xff8030,
    beats: [
      'A traveler\'s lantern from the first time the crafter left home. Twelve days walking, two nights lost, one wolf that turned out to be a dog.',
      'Greybranch was not the destination they had imagined. It was, however, the destination. The crafter learned to tell the difference.',
    ],
  },
  {
    name: "The Weaver's Apprenticeship",
    shape: 'nest',
    primary: 0x8a6838, accent: 0xe8d8a8,
    beats: [
      'A bird\'s nest the master weaver gave the crafter on the day they were sent to work alone. "Look at how it holds without any one twig being the strongest."',
      'The crafter has carried it through three towns. It has not come apart. They are not sure what this teaches them, but they are sure it teaches them something.',
    ],
  },
  {
    name: 'The Present Hearth',
    shape: 'antler',
    primary: 0xc8b890, accent: 0x6a4828,
    beats: [
      'An antler dropped by a deer that passed through the yard last winter. The crafter found it the morning after the first thaw.',
      'It marks the chapter the crafter is in now -- still working, still learning, still surprised by what wanders past when the door is open.',
    ],
  },
]

export default class HearthlightInn extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private player!: Phaser.Physics.Arcade.Sprite
  private dialogOpen = false
  private doorZone!: Phaser.GameObjects.Zone

  constructor() {
    super('HearthlightInn')
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a0e08')
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(-300, -180, WORLD_W + 600, WORLD_H + 360)
    this.cameras.main.centerOn(WORLD_W / 2, WORLD_H / 2)

    this.buildFloor()
    this.buildWalls()
    this.buildSign()
    this.buildFireplace()
    this.buildMantelTrophies()
    this.buildTables()
    this.buildDoor()
    this.buildPlayer()
    this.buildHud()
    this.buildWarmGlow()
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
    // Warm wooden plank floor base
    this.add.rectangle(fx, fy, fw, fh, 0x6a3818).setOrigin(0, 0).setDepth(0)
    // Plank seams every 2 tiles horizontally (wood grain)
    for (let r = 1; r < ROWS - 1; r += 2) {
      this.add.rectangle(fx, r * TILE, fw, 2, 0x3a1e08, 0.6).setOrigin(0, 0).setDepth(0.1)
    }
    // Stagger plank breaks
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c += 4) {
        const off = (r % 2) * 2
        const x = (c + off) * TILE
        if (x < fx + fw - TILE) {
          this.add.rectangle(x, r * TILE, 2, TILE, 0x3a1e08, 0.55).setOrigin(0, 0).setDepth(0.15)
        }
      }
    }
    // Sparse darker plank tiles for variation
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const n = (r * 31 + c * 17) % 100
        if (n < 14) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x5a2c10, 0.6)
            .setOrigin(0, 0).setDepth(0.18)
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
    this.add.rectangle(sx, sy, 540, 56, 0x2a1408, 0.94)
      .setStrokeStyle(3, 0xc8a050).setDepth(2)
    this.add.text(sx, sy, 'The Hearthlight Inn', {
      fontFamily: FONT_TITLE, fontSize: '28px', color: '#f5d8a8',
      fontStyle: '600', stroke: '#1a0c08', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(3).setDepth(3)
    this.add.text(sx, sy + 32, "five mantel pieces, five chapters of the road", {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#e8c890', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(3)
  }

  private buildFireplace() {
    // Stone fireplace centred along the back wall. Chimney breast on top,
    // mantel shelf in the middle, hearth opening below.
    const cx = (COLS / 2) * TILE
    const topY = 2.3 * TILE                        // chimney top
    const chimneyH = 2.8 * TILE                    // chimney breast height
    const w = 12 * TILE
    const mantelThick = 12
    const mantelY = topY + chimneyH + mantelThick / 2   // mantel SHELF y
    const hearthY = mantelY + mantelThick / 2 + 4       // opening top
    const openH = 2.0 * TILE

    // Chimney breast: stone block sits ABOVE the mantel
    this.add.rectangle(cx, topY + chimneyH / 2, w, chimneyH, 0x4a4248)
      .setStrokeStyle(3, 0x2a2228).setDepth(1.8)

    // Brick pattern -- rows of staggered bricks across the chimney breast
    const brickStart = topY + 10
    for (let row = 0; row < 3; row++) {
      const by = brickStart + row * 18
      for (let bx = 0; bx < 16; bx++) {
        const offset = row % 2 === 0 ? 0 : 14
        const xpos = cx - w / 2 + 14 + bx * 26 + offset
        if (xpos > cx + w / 2 - 6) break
        this.add.rectangle(xpos, by, 24, 14, 0x5a5258, 0.6)
          .setStrokeStyle(1, 0x2a2228, 0.7).setDepth(1.9)
      }
    }

    // Mantel shelf (where trophies sit) -- centred just below the chimney
    this.add.rectangle(cx, mantelY, w + 24, mantelThick, 0x4a3018)
      .setStrokeStyle(2, 0x2a1408).setDepth(2)
    this.add.rectangle(cx, mantelY - 4, w + 18, 3, 0x6a4828, 0.8).setDepth(2.1)

    // Hearth opening below the mantel
    const openW = TILE * 2.6
    const openY = hearthY + openH / 2
    this.add.rectangle(cx, openY, openW, openH, 0x0a0604)
      .setStrokeStyle(3, 0x2a1408).setDepth(2.2)

    // Stone side-piers of the opening
    const pierW = (w - openW) / 2
    this.add.rectangle(cx - openW / 2 - pierW / 2, openY, pierW, openH, 0x5a5258)
      .setStrokeStyle(2, 0x2a2228).setDepth(2.15)
    this.add.rectangle(cx + openW / 2 + pierW / 2, openY, pierW, openH, 0x5a5258)
      .setStrokeStyle(2, 0x2a2228).setDepth(2.15)

    // Logs at the base of the opening
    this.add.rectangle(cx - 24, openY + openH / 2 - 12, 30, 10, 0x4a2818)
      .setStrokeStyle(1, 0x2a1408).setDepth(2.3)
    this.add.rectangle(cx + 22, openY + openH / 2 - 12, 30, 10, 0x4a2818)
      .setStrokeStyle(1, 0x2a1408).setDepth(2.3)
    this.add.rectangle(cx, openY + openH / 2 - 22, 36, 10, 0x6a4828)
      .setStrokeStyle(1, 0x2a1408).setDepth(2.35)

    // Fire glow inside the hearth
    const fireY = openY + openH / 2 - 12
    const halo = this.add.circle(cx, fireY, 60, 0xff7020, 0.32)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.4)
    const flameOuter = this.add.polygon(cx, fireY - 10,
      [-26, 28, -16, 6, -8, -10, 0, -28, 8, -8, 16, 4, 26, 28],
      0xff8030)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.5).setAlpha(0.85)
    const flameInner = this.add.polygon(cx, fireY - 6,
      [-14, 16, -8, 4, 0, -18, 8, 2, 14, 14],
      0xffd060)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.6).setAlpha(0.9)
    const flameCore = this.add.polygon(cx, fireY - 2,
      [-7, 8, 0, -10, 7, 8],
      0xfff0a0)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.7)

    this.tweens.add({
      targets: flameOuter, scaleY: 1.15, scaleX: 0.9, alpha: 0.7,
      duration: 340, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: flameInner, scaleY: 1.20, scaleX: 0.88, alpha: 0.75,
      duration: 240, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: flameCore, scaleY: 1.25, scaleX: 0.85,
      duration: 180, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
    this.tweens.add({
      targets: halo, radius: 78, alpha: 0.18,
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })

    // Cast a small pool of warm light on the floor in front of the hearth
    const floorGlow = this.add.ellipse(cx, hearthY + openH + 30, 220, 50, 0xff8030, 0.14)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(0.9)
    this.tweens.add({
      targets: floorGlow, alpha: 0.07,
      duration: 1100, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
  }

  private drawTrophy(cx: number, cy: number, c: Chapter, depth: number): Phaser.GameObjects.GameObject[] {
    const parts: Phaser.GameObjects.GameObject[] = []
    if (c.shape === 'pot') {
      // Clay pot -- wide body, narrow neck, small mouth
      parts.push(this.add.ellipse(cx, cy + 10, 28, 24, c.primary)
        .setStrokeStyle(2, c.accent).setDepth(depth))
      parts.push(this.add.rectangle(cx, cy - 6, 14, 10, c.primary)
        .setStrokeStyle(2, c.accent).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx, cy - 12, 18, 4, c.accent).setDepth(depth + 0.2))
    } else if (c.shape === 'scroll') {
      // Rolled scroll on its side
      parts.push(this.add.rectangle(cx, cy + 4, 38, 16, c.primary)
        .setStrokeStyle(2, 0x4a3520).setDepth(depth))
      parts.push(this.add.circle(cx - 17, cy + 4, 8, 0xc89860)
        .setStrokeStyle(2, 0x4a3520).setDepth(depth + 0.1))
      parts.push(this.add.circle(cx + 17, cy + 4, 8, 0xc89860)
        .setStrokeStyle(2, 0x4a3520).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx, cy + 4, 36, 3, c.accent).setDepth(depth + 0.15))
    } else if (c.shape === 'lantern') {
      // Hanging lantern -- top cap, glass, base
      parts.push(this.add.rectangle(cx, cy - 14, 18, 6, 0x4a3520)
        .setStrokeStyle(1, 0x2a1408).setDepth(depth))
      parts.push(this.add.rectangle(cx, cy + 2, 22, 22, c.primary)
        .setStrokeStyle(2, 0x4a3520).setDepth(depth + 0.1))
      parts.push(this.add.circle(cx, cy + 2, 8, c.accent, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(depth + 0.2))
      parts.push(this.add.rectangle(cx, cy + 14, 26, 4, 0x4a3520)
        .setStrokeStyle(1, 0x2a1408).setDepth(depth + 0.15))
    } else if (c.shape === 'nest') {
      // Bird's nest -- woven twig ellipse + 3 eggs
      parts.push(this.add.ellipse(cx, cy + 4, 36, 24, c.primary)
        .setStrokeStyle(2, 0x4a3520).setDepth(depth))
      parts.push(this.add.ellipse(cx, cy + 6, 28, 16, 0x4a2818)
        .setStrokeStyle(1, 0x2a1408).setDepth(depth + 0.1))
      parts.push(this.add.ellipse(cx - 8, cy + 4, 8, 10, c.accent).setDepth(depth + 0.2))
      parts.push(this.add.ellipse(cx + 2, cy + 2, 8, 10, c.accent).setDepth(depth + 0.2))
      parts.push(this.add.ellipse(cx + 12, cy + 4, 8, 10, c.accent).setDepth(depth + 0.2))
    } else if (c.shape === 'antler') {
      // Pair of antlers -- a base + two branching shapes
      parts.push(this.add.rectangle(cx, cy + 12, 12, 8, 0x4a3520)
        .setStrokeStyle(1, 0x2a1408).setDepth(depth))
      // Left antler -- vertical main + branches
      parts.push(this.add.rectangle(cx - 4, cy - 4, 4, 28, c.primary)
        .setStrokeStyle(1, c.accent).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx - 10, cy - 4, 8, 4, c.primary).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx - 12, cy - 10, 4, 12, c.primary).setDepth(depth + 0.1))
      // Right antler -- mirrored
      parts.push(this.add.rectangle(cx + 4, cy - 4, 4, 28, c.primary)
        .setStrokeStyle(1, c.accent).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx + 10, cy - 4, 8, 4, c.primary).setDepth(depth + 0.1))
      parts.push(this.add.rectangle(cx + 12, cy - 10, 4, 12, c.primary).setDepth(depth + 0.1))
    }
    return parts
  }

  private buildMantelTrophies() {
    // 5 trophies sit on the mantel shelf. Each is labelled with a roman
    // numeral; the full chapter name lives in the dialog beat to keep the
    // mantel uncluttered.
    const cx = (COLS / 2) * TILE
    // mantelY must match the value computed in buildFireplace
    const mantelY = (2.3 * TILE) + (2.8 * TILE) + 6     // top + chimneyH + mantelThick/2
    const trophyY = mantelY - 26                         // trophy CENTER sits 26 above shelf
    const spread = TILE * 2.0

    // 4 mantel slots flank the hearth opening (which is ~2.6 tiles wide centred on cx).
    // Slot widths place them well outside the opening so they don't overlap the fire.
    const offsets = [-2.6 * TILE, -1.5 * TILE, 1.5 * TILE, 2.6 * TILE]
    // The 5th chapter hangs from the centre of the chimney breast above the mantel.

    CHAPTERS.forEach((ch, i) => {
      let tx: number
      let ty: number
      if (i < 4) {
        tx = cx + offsets[i]
        ty = trophyY
      } else {
        // 5th piece: hangs from a peg on the chimney breast above the mantel
        tx = cx
        ty = 2.3 * TILE + 36
      }
      const parts = this.drawTrophy(tx, ty, ch, 3)
      parts.forEach((p) => {
        const start = (p as Phaser.GameObjects.Components.Transform).y
        this.tweens.add({
          targets: p, y: start - 2,
          duration: 1900 + i * 100, ease: 'Sine.easeInOut',
          yoyo: true, repeat: -1, delay: i * 200,
        })
      })

      // Roman numeral label below or above
      const labelY = i < 4 ? mantelY + 18 : ty - 30
      const numerals = ['I', 'II', 'III', 'IV', 'V']
      this.add.text(tx, labelY, numerals[i], {
        fontFamily: FONT_TITLE, fontSize: '14px', color: '#f5d8a8',
        fontStyle: '600', stroke: '#1a0c08', strokeThickness: 3,
      }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(4)

      const hit = this.add.zone(tx, ty + 6, spread - 12, 68)
        .setInteractive({ useHandCursor: true })
      hit.on('pointerdown', () => this.showDialog(ch.name, ch.beats))
    })

    // Instruction line clear of the hearth, below the floor glow
    this.add.text(cx, 8.4 * TILE, 'five mantel-pieces -- click each numeral to hear its chapter', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#e8c890',
      fontStyle: 'italic', stroke: '#1a0c08', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setDepth(4)
  }

  private buildTables() {
    // Two long wooden tables in the centre of the room. Decorative only.
    const tableConfigs = [
      { cx: 5.5 * TILE, cy: 9.5 * TILE },
      { cx: 16.5 * TILE, cy: 9.5 * TILE },
    ]
    tableConfigs.forEach(({ cx, cy }) => {
      // Table top
      this.add.rectangle(cx, cy, TILE * 3.4, TILE * 1.0, 0x6a3818)
        .setStrokeStyle(3, 0x3a1e08).setDepth(2)
      this.add.rectangle(cx, cy - 2, TILE * 3.2, 3, 0x8a5028, 0.7).setDepth(2.1)
      // Table legs
      this.add.rectangle(cx - TILE * 1.4, cy + TILE * 0.45, 8, 14, 0x3a1e08).setDepth(2.05)
      this.add.rectangle(cx + TILE * 1.4, cy + TILE * 0.45, 8, 14, 0x3a1e08).setDepth(2.05)

      // Two stools per side
      const stoolXs = [cx - TILE * 1.0, cx + TILE * 1.0]
      stoolXs.forEach((sx) => {
        this.add.circle(sx, cy - TILE * 0.7, 12, 0x4a2818)
          .setStrokeStyle(2, 0x2a1408).setDepth(1.9)
        this.add.circle(sx, cy + TILE * 0.7, 12, 0x4a2818)
          .setStrokeStyle(2, 0x2a1408).setDepth(1.9)
      })

      // A small candle on each table
      this.add.rectangle(cx, cy - 2, 5, 12, 0xe8d8a8)
        .setStrokeStyle(1, 0x4a3520).setDepth(2.5)
      const flame = this.add.circle(cx, cy - 10, 5, 0xffc060, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.6)
      this.add.circle(cx, cy - 10, 10, 0xff8030, 0.25)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.55)
      this.tweens.add({
        targets: flame, scale: 1.25, alpha: 0.7,
        duration: 300, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
    })
  }

  private buildWarmGlow() {
    // Soft warm amber tint cast over the whole interior using a big rectangle
    const cam = this.cameras.main
    void cam   // unused, just to make linter happy
    // Two faint sconces on each side wall
    const sconces: { x: number; y: number }[] = [
      { x: TILE * 1.1, y: 4 * TILE },
      { x: TILE * 1.1, y: 9 * TILE },
      { x: (COLS - 1.1) * TILE, y: 4 * TILE },
      { x: (COLS - 1.1) * TILE, y: 9 * TILE },
    ]
    sconces.forEach(({ x, y }) => {
      this.add.rectangle(x, y, 14, 18, 0x4a3520)
        .setStrokeStyle(1, 0x2a1408).setDepth(2)
      const flame = this.add.circle(x, y - 4, 5, 0xffc060, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.6)
      this.add.circle(x, y - 4, 18, 0xff8030, 0.2)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(2.55)
      this.tweens.add({
        targets: flame, scale: 1.30, alpha: 0.7,
        duration: 280 + Math.random() * 120, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
    })
  }

  private buildEmberMotes() {
    // Soft sparks drift up from the hearth
    const cx = (COLS / 2) * TILE
    const fireY = 2.5 * TILE + 3.5 * TILE * 0.55
    for (let i = 0; i < 14; i++) {
      const mx = cx + (Math.random() - 0.5) * 80
      const my = fireY + Math.random() * 30
      const m = this.add.circle(mx, my, 1.6 + Math.random(), 0xff9040, 0.85)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(3.5)
      this.tweens.add({
        targets: m,
        y: my - 180 - Math.random() * 120,
        x: mx + (Math.random() - 0.5) * 60,
        alpha: 0,
        duration: 3000 + Math.random() * 2200,
        delay: Math.random() * 4000,
        ease: 'Sine.easeOut',
        repeat: -1,
        onRepeat: () => {
          m.y = fireY + Math.random() * 30
          m.x = cx + (Math.random() - 0.5) * 80
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
      'click a mantel-piece to hear its chapter   ·   walk to the door or press ESC to leave',
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
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 200, boxY - boxH / 2 - 16, 400, 30, 0x1a0c08)
      .setScrollFactor(0).setStrokeStyle(2, 0xc8a050).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 200, boxY - boxH / 2 - 16, speaker, {
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
