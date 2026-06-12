/**
 * Clock Tower + walk-through underpass, straddling the east beach road
 * (rows 38-39). The tower body rises north of the road; two stone legs
 * pinch the road into a short tunnel, and the arch is drawn OVER the
 * road at a depth above the player, so walking through reads as passing
 * beneath the tower. The overworld polls `passageRect` each frame;
 * inside it the camera dims and a chime sounds.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export interface ClockTowerRefs {
  passageRect: Phaser.Geom.Rectangle
}

export function buildClockTower(ctx: WorldCtx): ClockTowerRefs {
  const { scene, TILE } = ctx
  const L = 48                        // cols 48-52
  const W = 5
  const TOP = 32                      // body rows 32-37, legs rows 38-39

  // body above the road
  ctx.tile(L + 2, TOP - 1, 67, 5).setTint(0x8a8a92)
  for (let i = 0; i < W; i++) {
    ctx.tile(L + i, TOP, i === 0 ? 96 : i === W - 1 ? 98 : 97, 4)
    ctx.tile(L + i, TOP + 1, i === 0 ? 99 : i === W - 1 ? 101 : 100, 4)
    ctx.tile(L + i, TOP + 2, i === 0 ? 99 : i === W - 1 ? 101 : 100, 4)
    ctx.tile(L + i, TOP + 3, i === 0 ? 120 : i === W - 1 ? 122 : 121, 4)
    ctx.tile(L + i, TOP + 4, i === 0 ? 99 : i === W - 1 ? 101 : 100, 4)
    ctx.tile(L + i, TOP + 5, i === 0 ? 108 : i === W - 1 ? 110 : 109, 4)
  }
  ctx.blockRect(L, TOP - 1, W, 7)

  // south stubs below the road (row 40), centre col open as a south exit;
  // the road rows 38-39 pass clean beneath the body
  for (const c of [L, L + 1, L + 3, L + 4]) {
    ctx.tile(c, 40, 109, 4)
    ctx.block(c, 40)
  }

  // the arch over the tunnel, drawn above the player (depth 8)
  const archX = (L + W / 2) * TILE
  scene.add.rectangle(archX, 38.05 * TILE, (W - 2) * TILE, 14, 0x2a2430, 0.92).setDepth(8)
  const arch = scene.add.graphics().setDepth(8)
  arch.fillStyle(0x2a2430, 0.55)
  arch.fillRect((L + 1) * TILE, 38.2 * TILE, (W - 2) * TILE, 1.8 * TILE)
  // glowing crystals set into the legs
  for (const [cxp, cyp, d] of [
    [(L + 0.85) * TILE, 38.7 * TILE, 0],
    [(L + W - 0.85) * TILE, 39.4 * TILE, 400],
  ] as const) {
    const cr = scene.add.triangle(cxp, cyp, 0, 8, 8, 8, 4, 0, 0x7ae0e8, 0.85).setDepth(9)
    if (!ctx.reduced) {
      scene.tweens.add({
        targets: cr, alpha: 0.35, duration: 1100, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: d,
      })
    }
  }

  // clock face on the body
  const fx = archX
  const fy = (TOP + 1.5) * TILE
  scene.add.circle(fx, fy, 13, 0xf0e6c8).setStrokeStyle(2, 0x4a3a28).setDepth(5)
  scene.add.line(fx, fy, 0, 0, 0, -8, 0x3a2418).setLineWidth(1.6).setOrigin(0).setDepth(6)
  scene.add.line(fx, fy, 0, 0, 7, 0, 0x3a2418).setLineWidth(1.6).setOrigin(0).setDepth(6)
  const second = scene.add.line(fx, fy, 0, 0, 0, -10, 0xa83232).setLineWidth(1).setOrigin(0).setDepth(6)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: second, angle: 360, duration: 60000, repeat: -1 })
  }

  scene.add.text(archX, (TOP - 1.7) * TILE, 'Clock Tower', {
    fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)
  scene.add.text(archX, (TOP - 1.1) * TILE, 'walk-through underpass', {
    fontFamily: FONT_BODY, fontSize: '11px', color: '#d4b890', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)

  // detection rect: the tunnel, a little proud of the arch at both ends
  const passageRect = new Phaser.Geom.Rectangle(
    (L - 0.4) * TILE, 37.6 * TILE, (W + 0.8) * TILE, 2.8 * TILE,
  )
  return { passageRect }
}
