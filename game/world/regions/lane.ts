/**
 * Residential Lane -- five odd little houses on the south fields
 * (spec B.7.2): the Cat Lady's porch, the Inventor's workshop, the
 * Painter's cottage, the Hermit's hut, and the Music Hut.
 */
import type Phaser from 'phaser'
import type { WorldCtx } from '../ctx'
import { flagSet, flagCount } from '../save'
import { MUSIC_TRACKS, playMelody, stopMelody, sfxBlip } from '../audio'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const PEAK_ROW = 34
const ROOF_ROW = 35
const WALL_ROW = 36

export function buildLane(ctx: WorldCtx): void {
  buildLanePath(ctx)
  buildCatLady(ctx)
  buildInventor(ctx)
  buildPainter(ctx)
  buildHermit(ctx)
  buildMusicHut(ctx)
}

// ---- shared cottage shell ------------------------------------------------------

function cottage(ctx: WorldCtx, cx: number, kind: 'red' | 'blue', roofTint?: number): void {
  const isRed = kind === 'red'
  const ROOF = isRed ? [64, 65, 66] : [48, 49, 50]
  const WALL = isRed ? [52, 55, 54] : [48, 51, 50]
  for (let i = 0; i < 3; i++) {
    const roof = ctx.tile(cx + i, ROOF_ROW, ROOF[i], 3)
    if (roofTint) roof.setTint(roofTint)
    ctx.tile(cx + i, WALL_ROW, WALL[i], 3)
  }
  const peak = ctx.tile(cx + 1, PEAK_ROW, 67, 4)
  if (roofTint) peak.setTint(roofTint)
  ctx.blockRect(cx, ROOF_ROW, 3, 2)
}

function houseLabel(ctx: WorldCtx, cx: number, label: string): void {
  ctx.scene.add.text((cx + 1.5) * ctx.TILE, (WALL_ROW + 1) * ctx.TILE + 6, label, {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
}

function buildLanePath(ctx: WorldCtx): void {
  // dirt lane along row 38 from the houses to the southgate road
  for (let c = 4; c <= 31; c++) {
    ctx.tile(c, 38, 39 + (c % 3), 1)
  }
}

// ---- house 1: the cat lady ------------------------------------------------------

interface CatDef {
  id: string
  name: string
  dx: number
  dy: number
  frame: number
  tint: number
  pose: 'sit' | 'curl'
  line: string
}

function buildCatLady(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 4
  cottage(ctx, cx, 'blue', 0x9ec98a)   // mossy roof
  houseLabel(ctx, cx, "the Cat Lady's porch")

  const cats: CatDef[] = [
    { id: 'marigold', name: 'Marigold', dx: -0.6, dy: 1.4, frame: 120, tint: 0xf2a23c, pose: 'sit', line: "that's marigold. she'll be twelve come autumn." },
    { id: 'tinder', name: 'Tinder', dx: 0.8, dy: 1.7, frame: 123, tint: 0xb8b8c0, pose: 'curl', line: "don't mind tinder -- she sleeps eighteen hours." },
    { id: 'gray', name: 'the gray one', dx: 2.4, dy: 1.3, frame: 120, tint: 0x9a9aa6, pose: 'sit', line: 'oh, the gray one is new. found him by the river.' },
    { id: 'smudge', name: 'Smudge', dx: 3.4, dy: 1.8, frame: 120, tint: 0x8a6444, pose: 'sit', line: "smudge thinks he's a tiger. don't tell him otherwise." },
    { id: 'unnamed', name: 'the unnamed one', dx: 1.6, dy: 2.3, frame: 123, tint: 0x4a4a52, pose: 'curl', line: 'that one has no name yet. names are for cats who choose to stay.' },
  ]

  for (const cat of cats) {
    const px = (cx + cat.dx + 0.5) * TILE
    const py = (WALL_ROW + cat.dy) * TILE
    const spr = scene.add.image(px, py, 'tiny-dungeon', cat.frame)
      .setScale(1.6).setTint(cat.tint).setDepth(4)
    const hit = scene.add.zone(px, py, 30, 30).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => {
      if (!ctx.reduced) {
        if (cat.pose === 'curl') {
          scene.tweens.add({ targets: spr, scaleY: 1.85, duration: 220, yoyo: true })   // stretch awake
        } else {
          scene.tweens.add({ targets: spr, angle: 360, duration: 420 })                  // playful roll
        }
      }
      flagSet('cats', cat.id)
      const beats = [cat.line]
      if (flagCount('cats') >= 5 && ctx.collect('cats.allFive', 'the trust of five cats')) {
        beats.push("you've met them all. marigold approves -- in her way.")
      }
      ctx.showDialog('The Cat Lady (from the window)', beats)
    })
  }
}

// ---- house 2: the inventor -------------------------------------------------------

function buildInventor(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 9
  cottage(ctx, cx, 'red', 0xc88a5a)    // copper roof
  houseLabel(ctx, cx, "the Inventor's workshop")
  // copper pipe sticking out of the roof + smoke puffs
  scene.add.rectangle((cx + 2.4) * TILE, (ROOF_ROW - 0.2) * TILE, 6, 16, 0xb87333).setDepth(4)
  if (!ctx.reduced) {
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: (cx + 2.4) * TILE,
      y: (ROOF_ROW - 0.5) * TILE,
      lifespan: 2400,
      speedY: { min: -16, max: -8 },
      speedX: { min: -3, max: 3 },
      scale: { start: 0.35, end: 0.75 },
      alpha: { start: 0.3, end: 0 },
      tint: 0xd8d8d8,
      frequency: 3800,
    }).setDepth(5)
  }

  // the contraption: gears + bellows + lantern, beside the house
  const px = (cx + 3.9) * TILE
  const py = (WALL_ROW + 0.7) * TILE
  const rig = scene.add.container(px, py).setDepth(4)
  const gearBig = makeGear(scene, 0, 0, 11, 0x8a8a92)
  const gearSmall = makeGear(scene, 13, -7, 7, 0xa8a8b0)
  const bellows = scene.add.rectangle(-13, 6, 16, 10, 0x7a5226).setStrokeStyle(1, 0x4a2e14)
  const lantern = scene.add.circle(13, 8, 4, 0xffd98a).setStrokeStyle(1, 0x6e5a3a)
  rig.add([bellows, gearBig, gearSmall, lantern])
  ctx.block(cx + 4, WALL_ROW + 1)

  let clicks = 0
  const hit = scene.add.zone(px, py, 52, 40).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => {
    clicks++
    if (!ctx.reduced) {
      scene.tweens.add({ targets: gearBig, angle: gearBig.angle + 180, duration: 600, ease: 'Cubic.easeOut' })
      scene.tweens.add({ targets: gearSmall, angle: gearSmall.angle - 280, duration: 600, ease: 'Cubic.easeOut' })
      scene.tweens.add({ targets: lantern, alpha: 0.3, duration: 140, yoyo: true, repeat: 1 })
    }
    if (clicks === 7) {
      // the rig produces a tiny rune that floats into the visitor's findings
      const rune = scene.add.rectangle(px, py - 8, 8, 10, 0x7ae0e8).setStrokeStyle(1, 0x2a7a82).setDepth(6)
      scene.tweens.add({
        targets: rune, y: py - 44, alpha: 0, duration: 1400, ease: 'Sine.easeOut',
        onComplete: () => rune.destroy(),
      })
      ctx.collect('rune.inventor', 'a tiny rune of unknown make')
      ctx.showDialog('The Inventor', ["ah! it made a thing! ...i think that's good.",
        'a tiny rune of unknown make. it hums when you hold it. keep it -- it clearly likes you.'])
      return
    }
    ctx.showDialog('The Inventor', ["i can't figure out what it does either. but it does it well."])
  })
}

function makeGear(scene: Phaser.Scene, x: number, y: number, r: number, color: number): Phaser.GameObjects.Container {
  const gear = scene.add.container(x, y)
  const body = scene.add.circle(0, 0, r, color).setStrokeStyle(1.5, 0x4a4a52)
  const hub = scene.add.circle(0, 0, r * 0.3, 0x4a4a52)
  gear.add([body, hub])
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    const tooth = scene.add.rectangle(Math.cos(a) * r, Math.sin(a) * r, 4, 4, color).setStrokeStyle(1, 0x4a4a52)
    gear.add(tooth)
  }
  return gear
}

// ---- house 3: the painter ---------------------------------------------------------

interface PaintingDef {
  key: string
  title: string
  caption: string
  paint(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number): void
}

const PAINTINGS: PaintingDef[] = [
  {
    key: 'sunset', title: 'Sunset over the Beacon',
    caption: 'painted the day the lighthouse first lit.',
    paint(g, x, y, w, h) {
      const bands = [0xf7b267, 0xf79d65, 0xf4845f, 0xf27059, 0x9a5a78]
      bands.forEach((c, i) => { g.fillStyle(c, 1); g.fillRect(x, y + (h / 5) * i, w, h / 5 + 1) })
      g.fillStyle(0xffe8b0, 1); g.fillCircle(x + w * 0.62, y + h * 0.34, h * 0.13)
      g.fillStyle(0x2a2438, 1); g.fillRect(x + w * 0.16, y + h * 0.55, w * 0.06, h * 0.45)
      g.fillStyle(0xffd98a, 1); g.fillCircle(x + w * 0.19, y + h * 0.52, 3)
    },
  },
  {
    key: 'ship', title: 'The Ship That Stayed Out',
    caption: 'never reached the shore. perhaps it preferred the journey.',
    paint(g, x, y, w, h) {
      g.fillStyle(0x3a5a8c, 1); g.fillRect(x, y, w, h * 0.62)
      g.fillStyle(0x2c4a74, 1); g.fillRect(x, y + h * 0.62, w, h * 0.38)
      g.fillStyle(0x6a4a2a, 1); g.fillRect(x + w * 0.38, y + h * 0.58, w * 0.26, h * 0.1)
      g.fillStyle(0xf0e6c8, 1); g.fillTriangle(x + w * 0.5, y + h * 0.18, x + w * 0.5, y + h * 0.56, x + w * 0.72, y + h * 0.5)
      g.fillStyle(0xffffff, 0.7)
      for (let i = 0; i < 4; i++) g.fillRect(x + (w / 5) * (i + 0.5), y + h * (0.68 + 0.07 * (i % 2)), w * 0.1, 2)
    },
  },
  {
    key: 'portrait', title: 'Unfinished Portrait',
    caption: "i'll finish it when i remember the face.",
    paint(g, x, y, w, h) {
      g.fillStyle(0xc9b690, 1); g.fillRect(x, y, w, h)
      g.fillStyle(0x4a3a30, 1); g.fillEllipse(x + w / 2, y + h * 0.36, w * 0.3, h * 0.3)
      g.fillStyle(0x5a4438, 1); g.fillRect(x + w * 0.32, y + h * 0.48, w * 0.36, h * 0.52)
      // the face side is simply... not there
      g.fillStyle(0xc9b690, 1); g.fillRect(x + w * 0.5, y + h * 0.18, w * 0.5, h * 0.34)
    },
  },
]

function buildPainter(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 14
  cottage(ctx, cx, 'blue')
  houseLabel(ctx, cx, "the Painter's cottage")

  // painter at the door
  const painter = ctx.dtile(cx + 1.5, WALL_ROW + 0.9, 87, 4)
  painter.setOrigin(0.5, 0.8).setScale(2)
  const pHit = scene.add.zone((cx + 1.5) * TILE, (WALL_ROW + 0.9) * TILE, 30, 40)
    .setInteractive({ useHandCursor: true })
  pHit.on('pointerdown', () =>
    ctx.showDialog('The Painter', ['take a look. some of them are finished. some of them never will be.']))

  PAINTINGS.forEach((p, i) => {
    const ex = (cx - 0.8 + i * 1.7) * TILE
    const ey = (WALL_ROW + 2.1) * TILE
    // easel A-frame
    scene.add.line(ex, ey, -7, 14, 0, -10, 0x6e4a26).setLineWidth(2).setOrigin(0).setDepth(3)
    scene.add.line(ex, ey, 7, 14, 0, -10, 0x6e4a26).setLineWidth(2).setOrigin(0).setDepth(3)
    // small canvas
    const g = scene.add.graphics().setDepth(4)
    g.fillStyle(0xf0e6c8, 1)
    g.fillRect(ex - 10, ey - 12, 20, 16)
    p.paint(g, ex - 8, ey - 10, 16, 12)
    g.lineStyle(1.5, 0x6e4a26, 1)
    g.strokeRect(ex - 10, ey - 12, 20, 16)

    const hit = scene.add.zone(ex, ey, 26, 32).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => openPaintingModal(ctx, p))
  })
}

function openPaintingModal(ctx: WorldCtx, p: PaintingDef): void {
  const { scene } = ctx
  const camW = scene.scale.gameSize.width
  const camH = scene.scale.gameSize.height
  const layer = scene.add.container(0, 0).setScrollFactor(0).setDepth(300)

  const dim = scene.add.rectangle(camW / 2, camH / 2, camW, camH, 0x000000, 0.55).setInteractive()
  const frameW = 460
  const frameH = 380
  const fx = camW / 2
  const fy = camH / 2 - 30
  const frame = scene.add.rectangle(fx, fy, frameW, frameH, 0x4a3018).setStrokeStyle(4, 0xa98758)
  const g = scene.add.graphics()
  g.fillStyle(0xf0e6c8, 1)
  g.fillRect(fx - frameW / 2 + 18, fy - frameH / 2 + 18, frameW - 36, frameH - 36)
  p.paint(g, fx - frameW / 2 + 26, fy - frameH / 2 + 26, frameW - 52, frameH - 52)

  const title = scene.add.text(fx, fy + frameH / 2 + 24, p.title, {
    fontFamily: FONT_TITLE, fontSize: '20px', color: '#f5e5c5', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3)
  const caption = scene.add.text(fx, fy + frameH / 2 + 50, p.caption, {
    fontFamily: FONT_BODY, fontSize: '17px', color: '#d4b890', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3)
  const hint = scene.add.text(fx, fy + frameH / 2 + 78, 'click anywhere to step back', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#9a8a6e',
  }).setOrigin(0.5).setResolution(3)

  layer.add([dim, frame, g, title, caption, hint])
  // swallow the opening click, then close on the next one
  scene.time.delayedCall(150, () => {
    dim.once('pointerdown', () => layer.destroy())
  })
}

// ---- house 4: the hermit ------------------------------------------------------------

const RIDDLES: [string, string][] = [
  ['what walks the road without leaving a footprint?', "a thought. you carry many of them, i'd guess."],
  ['what burns brighter the more it gives?', 'a lantern. or a person, in their better hours.'],
  ['what is heaviest when it weighs nothing?', 'a regret. set it down before you walk on.'],
]

function buildHermit(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 19
  cottage(ctx, cx, 'red', 0x8a7a5a)    // weathered roof
  houseLabel(ctx, cx, "the Hermit's hut")
  // herbs hanging by the door
  for (let i = 0; i < 3; i++) {
    scene.add.rectangle((cx + 0.6 + i * 0.35) * TILE, (WALL_ROW + 0.25) * TILE, 4, 9, 0x5a7a3e).setDepth(4)
  }

  // hermit on a stump outside
  const hx = (cx + 3.6) * TILE
  const hy = (WALL_ROW + 1.1) * TILE
  scene.add.ellipse(hx, hy + 12, 24, 10, 0x6e4a26).setStrokeStyle(1, 0x4a2e14).setDepth(3)
  const hermit = scene.add.image(hx, hy, 'tiny-dungeon', 111).setScale(2.4).setDepth(4)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: hermit, y: hy - 2, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
  }
  ctx.block(cx + 4, WALL_ROW + 1)

  let stage = 0
  const hit = scene.add.zone(hx, hy, 40, 48).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => {
    if (stage === 0) {
      ctx.showDialog('The Hermit', [
        "pull up a stump, traveler. the road's been long, hasn't it.",
        RIDDLES[0][0],
        RIDDLES[0][1],
      ])
      flagSet('riddles', 'r1')
      stage = 1
    } else if (stage === 1) {
      ctx.showDialog('The Hermit', [RIDDLES[1][0], RIDDLES[1][1]])
      flagSet('riddles', 'r2')
      stage = 2
    } else if (stage === 2) {
      flagSet('riddles', 'r3')
      const beats = [RIDDLES[2][0], RIDDLES[2][1]]
      if (ctx.collect('riddles.allThree', "the hermit's three riddles")) {
        beats.push('few travelers stop to listen. fewer still hear themselves listening.')
      }
      ctx.showDialog('The Hermit', beats)
      stage = 3
    } else {
      ctx.showDialog('The Hermit', ['the stump beside me is warm whenever you need it, traveler.'])
    }
  })
}

// ---- house 5: the music hut -----------------------------------------------------------

function buildMusicHut(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 28
  cottage(ctx, cx, 'blue', 0x8aa8d8)
  houseLabel(ctx, cx, 'the Music Hut')

  // painted notes on the door: circles with stems (procedural, font-safe)
  const dx = (cx + 1.5) * TILE
  const dy = (WALL_ROW + 0.45) * TILE
  const g = scene.add.graphics().setDepth(4)
  for (const [ox, oy] of [[-7, 0], [0, -5], [7, 1]] as const) {
    g.fillStyle(0x2a2438, 1)
    g.fillEllipse(dx + ox, dy + oy, 5, 4)
    g.lineStyle(1.4, 0x2a2438, 1)
    g.lineBetween(dx + ox + 2, dy + oy, dx + ox + 2, dy + oy - 8)
  }

  const hit = scene.add.zone(dx, (WALL_ROW + 0.5) * TILE, 3 * TILE, TILE * 1.4)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => openMusicBox(ctx))
}

function openMusicBox(ctx: WorldCtx): void {
  const { scene } = ctx
  const camW = scene.scale.gameSize.width
  const camH = scene.scale.gameSize.height
  const layer = scene.add.container(0, 0).setScrollFactor(0).setDepth(300)

  const dim = scene.add.rectangle(camW / 2, camH / 2, camW, camH, 0x000000, 0.55).setInteractive()
  const w = 520
  const h = 420
  const fx = camW / 2
  const fy = camH / 2
  const box = scene.add.rectangle(fx, fy, w, h, 0x2a1a0c, 0.97).setStrokeStyle(3, 0xa98758)
  const title = scene.add.text(fx, fy - h / 2 + 36, 'The Music Box', {
    fontFamily: FONT_TITLE, fontSize: '24px', color: '#f5e5c5', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(2)
  const sub = scene.add.text(fx, fy - h / 2 + 64, 'listen. pick a song. each one was written for a different walk.', {
    fontFamily: FONT_BODY, fontSize: '15px', color: '#d4b890', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3)
  layer.add([dim, box, title, sub])

  MUSIC_TRACKS.forEach((t, i) => {
    const ty = fy - h / 2 + 116 + i * 64
    const row = scene.add.rectangle(fx, ty, w - 70, 52, 0x4a3018).setStrokeStyle(2, 0x6e4a26)
      .setInteractive({ useHandCursor: true })
    const name = scene.add.text(fx - w / 2 + 60, ty - 10, t.name, {
      fontFamily: FONT_TITLE, fontSize: '17px', color: '#f5e5c5',
    }).setOrigin(0, 0.5).setResolution(3)
    const line = scene.add.text(fx - w / 2 + 60, ty + 11, t.line, {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#d4b890', fontStyle: 'italic',
    }).setOrigin(0, 0.5).setResolution(3)
    const play = scene.add.text(fx + w / 2 - 64, ty, '[ play ]', {
      fontFamily: FONT_BODY, fontSize: '15px', color: '#ffc24b',
    }).setOrigin(0.5).setResolution(3)
    row.on('pointerdown', () => {
      sfxBlip()
      playMelody(t.key)
      row.setFillStyle(0x5a3e20)
      scene.time.delayedCall(400, () => row.setFillStyle(0x4a3018))
    })
    layer.add([row, name, line, play])
  })

  const closeBtn = scene.add.text(fx, fy + h / 2 - 30, '[ close the lid ]', {
    fontFamily: FONT_BODY, fontSize: '16px', color: '#9a8a6e',
  }).setOrigin(0.5).setResolution(3).setInteractive({ useHandCursor: true })
  closeBtn.on('pointerdown', () => {
    stopMelody()
    layer.destroy()
  })
  layer.add(closeBtn)
}
