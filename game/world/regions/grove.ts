/**
 * Cherry Blossom Grove (NW) -- a sakura oval per the design map: pink
 * trees ringing a clearing, drifting petals, the swing, and the
 * meditation stone. "sakura . swing . meditation"
 */
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

const QUOTES = [
  'the river does not hurry, yet it reaches the sea.',
  'a quiet hour is the deepest currency.',
  'perfect is the enemy of shipped.',
  'what you tend grows. what you ignore returns wild.',
  'you are allowed to begin again, today, before noon.',
]

// Oval ring of sakura around the clearing (centre ~ (13.5, 9)).
const TREES: [number, number][] = [
  [7, 5], [10, 4], [13, 3.6], [16, 4], [19, 5],
  [5, 7], [21, 7], [4, 9.5], [22, 9.5],
  [5, 12], [21, 12], [7, 14], [11, 14.6], [15, 14.6], [19, 14],
  [9, 7.5], [17, 8], [12, 6],
]

export function buildGrove(ctx: WorldCtx): void {
  const { scene, TILE } = ctx

  // blossom carpet -- soft pink ground glow under the oval
  const carpet = scene.add.ellipse(13.5 * TILE, 9.5 * TILE, 21 * TILE, 13 * TILE, 0xffd2e2, 0.18).setDepth(0)
  void carpet

  for (const [c, r] of TREES) {
    // trunk from the tree tile, canopy as literal pink balls -- the design
    // map draws sakura as circles, and tinting either tree frame goes muddy
    ctx.tile(c, r, 3, 2).setTint(0xc88a6a)
    const px = c * TILE + TILE / 2
    const py = r * TILE + 8
    scene.add.circle(px, py, 14, 0xf6b8d0).setStrokeStyle(1.5, 0xd890b0).setDepth(3)
    scene.add.circle(px - 6, py - 5, 7, 0xfbd0e0).setDepth(3)
    scene.add.circle(px + 7, py - 2, 5, 0xf0a8c4, 0.9).setDepth(3)
    ctx.block(c, r)
  }

  scene.add.text(13.5 * TILE, 2.6 * TILE, 'Cherry Blossom Grove', {
    fontFamily: FONT_BODY, fontSize: '17px', color: '#7a3957', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  scene.add.text(13.5 * TILE, 3.3 * TILE, 'sakura . swing . meditation', {
    fontFamily: FONT_BODY, fontSize: '12px', color: '#9a5977', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  if (!ctx.reduced) {
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: { min: 4 * TILE, max: 23 * TILE },
      y: { min: 3 * TILE, max: 14 * TILE },
      lifespan: 5000,
      speedX: { min: 12, max: 32 },
      speedY: { min: 18, max: 38 },
      scale: { start: 0.4, end: 0.15 },
      alpha: { start: 0.85, end: 0 },
      tint: [0xffaad0, 0xffc0d8, 0xff8aaa],
      frequency: 140,
    }).setDepth(4)
  }

  buildSwing(ctx)
  buildMeditationStone(ctx)
}

function buildSwing(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // Hangs from the big sakura at (12, 6). Ropes + plank in a container so
  // the sway tween moves them as one.
  const ax = 12 * TILE + TILE / 2
  const ay = 6 * TILE + 18
  const swing = scene.add.container(ax, ay).setDepth(3)
  const ropeL = scene.add.line(0, 0, -8, 0, -8, 26, 0x6b4a2a).setLineWidth(1.5).setOrigin(0)
  const ropeR = scene.add.line(0, 0, 8, 0, 8, 26, 0x6b4a2a).setLineWidth(1.5).setOrigin(0)
  const plank = scene.add.rectangle(0, 28, 24, 5, 0x8a5a30).setStrokeStyle(1, 0x4a2e14)
  swing.add([ropeL, ropeR, plank])

  const hit = scene.add.zone(ax, ay + 20, 36, 44).setInteractive({ useHandCursor: true })
  let swaying = false
  hit.on('pointerdown', () => {
    if (!swaying && !ctx.reduced) {
      swaying = true
      scene.tweens.add({
        targets: swing,
        angle: { from: -7, to: 7 },
        duration: 420,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 3,
        onComplete: () => { swing.setAngle(0); swaying = false },
      })
    }
    ctx.showDialog('The Swing', ['the rope creaks. it has held weight before.'])
  })
}

function buildMeditationStone(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 17
  const cy = 12
  const px = cx * TILE + TILE / 2
  const py = cy * TILE + TILE / 2

  // Flat grey rock with a carved spiral.
  scene.add.ellipse(px, py + 6, 40, 22, 0x8d8d95).setStrokeStyle(2, 0x55555e).setDepth(2)
  scene.add.ellipse(px, py + 2, 34, 18, 0xa5a5ad).setDepth(2)
  const spiral = scene.add.graphics().setDepth(3)
  spiral.lineStyle(1.5, 0x6a6a72, 1)
  spiral.beginPath()
  for (let a = 0; a < Math.PI * 4; a += 0.25) {
    const r = 1.2 + a * 1.1
    const x = px + Math.cos(a) * r
    const y = py + 2 + Math.sin(a) * r * 0.55
    if (a === 0) spiral.moveTo(x, y)
    else spiral.lineTo(x, y)
  }
  spiral.strokePath()

  ctx.block(cx, cy)

  let idx = 0
  const hit = scene.add.zone(px, py, 48, 36).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => {
    ctx.showDialog('The Meditation Stone', [QUOTES[idx % QUOTES.length]])
    idx++
  })

  scene.add.text(px, py + 22, 'meditation stone', {
    fontFamily: FONT_BODY, fontSize: '12px', color: '#7a3957', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(3)
}
