/**
 * Cherry Blossom Grove extras -- the swing and the meditation stone.
 * (Petal particles + the cherry trees themselves are placed by the
 * overworld's decoration pass; this module adds the two interactives.)
 */
import type { WorldCtx } from '../ctx'

const QUOTES = [
  'the river does not hurry, yet it reaches the sea.',
  'a quiet hour is the deepest currency.',
  'perfect is the enemy of shipped.',
  'what you tend grows. what you ignore returns wild.',
  'you are allowed to begin again, today, before noon.',
]

export function buildGrove(ctx: WorldCtx): void {
  buildSwing(ctx)
  buildMeditationStone(ctx)
}

function buildSwing(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // Hangs from the big cherry tree at tile (8,2). Ropes + plank in a
  // container so the sway tween moves them as one.
  const ax = 8 * TILE + TILE / 2
  const ay = 2 * TILE + 18
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
  const cx = 6
  const cy = 9
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

  scene.add.text(px, py + 22, 'a stone for sitting', {
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
    fontSize: '12px', color: '#7a3957', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(3)
}
