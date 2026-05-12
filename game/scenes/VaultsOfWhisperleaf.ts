import Phaser from 'phaser'

/**
 * J.3 Vaults of Whisperleaf interior. Stone-walled archive lined with four
 * tall bookshelves, each holding three scrolls. Twelve scrolls in total --
 * each a Frieren-coded alias for a real article. Clicking a scroll opens a
 * 2-beat dialog beat. Door at the south returns to AetherveilOverworld.
 */

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const SRC_TILE = 16
const SCALE = 3
const TILE = SRC_TILE * SCALE         // 48
const COLS = 22
const ROWS = 14
const WORLD_W = COLS * TILE           // 1056
const WORLD_H = ROWS * TILE           // 672

const T = {
  STONE_WALL: 100,
  STONE_CREN_M: 97,
  STONE_BASE_M: 109,
  DOOR_BIG: 103,
}

interface Scroll {
  name: string
  beats: string[]
}

// 12 scrolls -- 4 shelves x 3 scrolls each. In-world Frieren names that map
// loosely to article topics. Real article content can replace beats without
// touching layout.
const SCROLLS: Scroll[][] = [
  [
    {
      name: 'The Long Road from Greybranch',
      beats: [
        'A traveller\'s ledger. How a person who knew nothing of cities came to read their patterns.',
        'The road taught them that a city is just a forest where the trees argue in numbers.',
      ],
    },
    {
      name: 'Of Sealings and Their Breaking',
      beats: [
        'A study of locks, keys, and the soft places between. Some seals are not meant to hold forever -- only long enough.',
        'The scrivener\'s rule: a seal that lasts forever is no longer a seal. It is a wall, and walls forget who they were made for.',
      ],
    },
    {
      name: 'When the Loom Forgets',
      beats: [
        'A tale of a great brass loom that slipped a thread, and the harvest-tallies that came out wrong for an entire moon.',
        'The fix was not in the loom but in the weaver. The lesson: every thread you do not name will some day name itself.',
      ],
    },
  ],
  [
    {
      name: 'Lanterns That Do Not Wane',
      beats: [
        'Notes on lanterns built to outlast their builders. The trick is not the flame -- it is the keeper who knows when to look away.',
        'A lantern watched too closely teaches the keeper nothing. A lantern watched not at all teaches them too late.',
      ],
    },
    {
      name: 'On the Patience of Cogs',
      beats: [
        'A small cog inside a great mill turns a thousand times for every grain it grinds. The mill does not thank it.',
        'And yet, if the cog stops, the mill stops. The scrivener does not believe in unimportant cogs.',
      ],
    },
    {
      name: 'A Charter for Fair Tides',
      beats: [
        'How a market built on tides learned that the tide does not negotiate. Only the boats can.',
        'When you cannot change the sea, change the harbour. The scrivener calls this principle "honest constraints."',
      ],
    },
  ],
  [
    {
      name: 'Beasts in the Bramble',
      beats: [
        'A chronicle of three nights when the wards broke and a thing came through. Each time, the scrivener was the one who closed it.',
        'The scrivener writes: "A beast in the open is a problem. A beast in the bramble is also the bramble\'s problem."',
      ],
    },
    {
      name: "The Sailor's Lesson on Knots",
      beats: [
        'Why a sailor ties twelve different knots when one would hold. Each knot is a different question about wind.',
        'The scrivener applies this to bindings between unrelated towns. One knot fits the calm; another fits the storm.',
      ],
    },
    {
      name: 'Notes from Beacon-Watch',
      beats: [
        'Fragments from the months the scrivener spent at the Beacon, listening to flame-signals from villages too far to walk to.',
        'They learned that the most urgent flame is rarely the most important. The skill was learning to tell the two apart.',
      ],
    },
  ],
  [
    {
      name: "Whisperleaf's Old Question",
      beats: [
        'An archivist\'s riddle: how much of a record may you change before it is no longer the same record?',
        'The scrivener\'s answer was unsatisfying to the archivist and useful to everyone else.',
      ],
    },
    {
      name: "The Smith's Three Questions",
      beats: [
        'Before forging anything, the smith asks: who will hold it, what will it strike, and what will fail first.',
        'The scrivener applies the same to anything they build. The third question saves the most time.',
      ],
    },
    {
      name: 'Of Maps That Lie Politely',
      beats: [
        'A study of old maps that were never wrong, exactly -- only out of date in ways the cartographer did not advertise.',
        'The scrivener now distrusts any map that does not have a date in its corner. A polite lie is still a lie.',
      ],
    },
  ],
]

export default class VaultsOfWhisperleaf extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd?: Record<string, Phaser.Input.Keyboard.Key>
  private player!: Phaser.Physics.Arcade.Sprite
  private dialogOpen = false
  private doorZone!: Phaser.GameObjects.Zone

  constructor() {
    super('VaultsOfWhisperleaf')
  }

  create() {
    this.cameras.main.setBackgroundColor('#1a1a26')

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(-300, -180, WORLD_W + 600, WORLD_H + 360)
    this.cameras.main.centerOn(WORLD_W / 2, WORLD_H / 2)

    this.buildFloor()
    this.buildWalls()
    this.buildSign()
    this.buildBookshelves()
    this.buildDoor()
    this.buildPlayer()
    this.buildHud()
    this.buildAmbientGlow()

    this.cursors = this.input.keyboard?.createCursorKeys()
    this.wasd = this.input.keyboard?.addKeys('W,A,S,D,SPACE,E,ESC') as Record<string, Phaser.Input.Keyboard.Key>
    this.input.keyboard?.on('keydown-ESC', () => {
      if (!this.dialogOpen) this.exitToOverworld()
    })
  }

  private tile(col: number, row: number, frame: number, depth = 0, tint?: number) {
    const img = this.add.image(col * TILE, row * TILE, 'tiny-town', frame)
      .setOrigin(0, 0)
      .setScale(SCALE)
      .setDepth(depth)
    if (tint !== undefined) img.setTint(tint)
    return img
  }

  private buildFloor() {
    // Flat flagstone-toned base, then sparse darker squares give a tiled feel
    // without dragging in any grass-laden tiny-town frames.
    const fx = TILE
    const fy = TILE
    const fw = (COLS - 2) * TILE
    const fh = (ROWS - 2) * TILE
    this.add.rectangle(fx, fy, fw, fh, 0x3a3848).setOrigin(0, 0).setDepth(0)

    // Grout lines every tile -- vertical
    for (let c = 1; c < COLS - 1; c++) {
      this.add.rectangle(c * TILE, fy, 1, fh, 0x2a2838, 0.6).setOrigin(0, 0).setDepth(0.1)
    }
    for (let r = 1; r < ROWS - 1; r++) {
      this.add.rectangle(fx, r * TILE, fw, 1, 0x2a2838, 0.6).setOrigin(0, 0).setDepth(0.1)
    }

    // Sparse darker flagstones for stone-grain feel
    for (let r = 1; r < ROWS - 1; r++) {
      for (let c = 1; c < COLS - 1; c++) {
        const n = (r * 31 + c * 17) % 100
        if (n < 14) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x322f40)
            .setOrigin(0, 0).setDepth(0.15)
        } else if (n < 22) {
          this.add.rectangle(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4, 0x423f54)
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
    this.add.rectangle(sx, sy, 540, 56, 0x2a2438, 0.94)
      .setStrokeStyle(3, 0x9d8fbf).setDepth(2)
    this.add.text(sx, sy, 'Vaults of Whisperleaf', {
      fontFamily: FONT_TITLE, fontSize: '28px', color: '#e8dcf5',
      fontStyle: '600', stroke: '#0a0612', strokeThickness: 3,
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(3).setDepth(3)
    this.add.text(sx, sy + 32, 'twelve scrolls, twelve questions, none of them new', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#c0b0d8', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(3)
  }

  private buildBookshelves() {
    // Four tall shelves spread across cols ~3, 8, 13, 18, each 2 tiles wide
    // x 5 tiles tall (rows 3-7). Three scrolls per shelf -> 12 total.
    const shelfCols = [3, 8, 13, 18]
    SCROLLS.forEach((scrolls, shelfIdx) => {
      const cx = shelfCols[shelfIdx]
      const top = 3
      const bottom = 7

      const x0 = cx * TILE
      const x1 = (cx + 2) * TILE
      const y0 = top * TILE
      const y1 = (bottom + 1) * TILE
      const w = x1 - x0
      const h = y1 - y0

      // Outer wooden frame
      this.add.rectangle(x0 + w / 2, y0 + h / 2, w + 6, h + 6, 0x3a2818, 1).setDepth(2)
      // Inner darker recess
      this.add.rectangle(x0 + w / 2, y0 + h / 2, w - 8, h - 8, 0x1f1410, 1).setDepth(2.5)
      // Vertical wooden bar between the 2-tile columns
      this.add.rectangle(x0 + w / 2, y0 + h / 2, 4, h - 8, 0x4a3520, 1).setDepth(3)

      // 3 horizontal shelf planks at evenly spaced heights
      const shelfYs = [
        y0 + h * 0.30,
        y0 + h * 0.58,
        y0 + h * 0.86,
      ]
      shelfYs.forEach((sy) => {
        this.add.rectangle(x0 + w / 2, sy, w - 14, 6, 0x4a3520, 1).setDepth(3)
      })

      // Place 3 scrolls -- one above each shelf plank, centred either left or
      // right side of the shelf. We alternate sides for visual variety.
      scrolls.forEach((scroll, scrollIdx) => {
        const sy = shelfYs[scrollIdx] - 28      // scroll sits just above the plank
        const side = scrollIdx % 2 === 0 ? 0.30 : 0.70
        const sx = x0 + w * side

        // Glow plate -- subtle, draws the eye on hover-ish
        this.add.circle(sx, sy, 22, 0xe8dcf5, 0.14).setDepth(3.5)

        // Scroll body: 3 stacked rectangles = rolled parchment look
        const scrollBody = this.add.rectangle(sx, sy, 30, 38, 0xe8d8a8, 1)
          .setStrokeStyle(2, 0x6a4818).setDepth(4)
        // Ribbon
        this.add.rectangle(sx, sy, 32, 6, 0xa83232, 1).setDepth(5)
        // Cap top + bottom (the rolled ends)
        this.add.rectangle(sx, sy - 18, 32, 6, 0xc09060, 1).setDepth(5)
        this.add.rectangle(sx, sy + 18, 32, 6, 0xc09060, 1).setDepth(5)

        // Idle drift
        this.tweens.add({
          targets: scrollBody, y: sy - 3,
          duration: 1700 + scrollIdx * 80 + shelfIdx * 40,
          ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
          delay: (shelfIdx * 3 + scrollIdx) * 110,
        })

        // Hit zone -- generous click target
        const hit = this.add.zone(sx, sy, 48, 56)
          .setInteractive({ useHandCursor: true })
        hit.on('pointerdown', () => this.showDialog(scroll.name, scroll.beats))
      })

      // Shelf label below the bookshelf
      const labels = ['I', 'II', 'III', 'IV']
      this.add.text(x0 + w / 2, y1 + 22, `Shelf ${labels[shelfIdx]}`, {
        fontFamily: FONT_TITLE, fontSize: '18px', color: '#f5e5c5',
        fontStyle: '600', stroke: '#0a0612', strokeThickness: 3,
      }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(4)
    })
  }

  private buildAmbientGlow() {
    // Two faint torch-like glows on the side walls to break up the dimness.
    const ys = [4 * TILE, 9 * TILE]
    ys.forEach((y) => {
      this.add.circle(TILE * 1.2, y, 60, 0xf5b878, 0.10).setDepth(1.5)
      this.add.circle((COLS - 1.2) * TILE, y, 60, 0xf5b878, 0.10).setDepth(1.5)
    })
    // Drifting dust motes -- tween-driven circles, no particle texture needed.
    for (let i = 0; i < 14; i++) {
      const mx = 200 + Math.random() * (WORLD_W - 400)
      const my = 80 + Math.random() * 180
      const m = this.add.circle(mx, my, 1.6, 0xe8dcf5, 0.6).setDepth(1.2)
      this.tweens.add({
        targets: m,
        y: my + 320 + Math.random() * 200,
        alpha: 0,
        duration: 6500 + Math.random() * 3500,
        delay: Math.random() * 5000,
        ease: 'Linear',
        repeat: -1,
        onRepeat: () => {
          m.y = 80 + Math.random() * 180
          m.x = 200 + Math.random() * (WORLD_W - 400)
          m.setAlpha(0.6)
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
      fontFamily: FONT_BODY, fontSize: '13px', color: '#c0b0d8', fontStyle: 'italic',
      stroke: '#0a0612', strokeThickness: 2,
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
      'click a scroll to read its passage   ·   walk to the door or press ESC to leave',
      {
        fontFamily: FONT_BODY, fontSize: '14px', color: '#e8dcf5',
        stroke: '#0a0612', strokeThickness: 3,
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

    const bg = this.add.rectangle(boxX, boxY, boxW, boxH, 0x1a1224, 0.96)
      .setScrollFactor(0).setStrokeStyle(3, 0x9d8fbf).setDepth(200)
    const inner = this.add.rectangle(boxX, boxY, boxW - 18, boxH - 18)
      .setScrollFactor(0).setStrokeStyle(1, 0xc0b0d8, 0.7).setDepth(201)
    const nameBg = this.add.rectangle(boxX - boxW / 2 + 180, boxY - boxH / 2 - 16, 360, 30, 0x1a1224)
      .setScrollFactor(0).setStrokeStyle(2, 0x9d8fbf).setDepth(202)
    const nameText = this.add.text(boxX - boxW / 2 + 180, boxY - boxH / 2 - 16, speaker, {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#e8dcf5', fontStyle: '600',
    }).setOrigin(0.5).setScrollFactor(0).setResolution(3).setLetterSpacing(1).setDepth(203)
    const bodyText = this.add.text(boxX - boxW / 2 + 40, boxY - boxH / 2 + 28, beats[0], {
      fontFamily: FONT_BODY, fontSize: '22px', color: '#e8dcf5',
      wordWrap: { width: boxW - 80, useAdvancedWrap: true }, lineSpacing: 6,
    }).setScrollFactor(0).setResolution(3).setDepth(203)
    const hint = this.add.text(boxX + boxW / 2 - 40, boxY + boxH / 2 - 24, 'click / space →', {
      fontFamily: FONT_BODY, fontSize: '14px', color: '#c0b0d8', fontStyle: 'italic',
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
