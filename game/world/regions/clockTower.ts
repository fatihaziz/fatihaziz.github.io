/**
 * Clock Tower + Underpass. Two solid stone pillars carry a clock above a
 * tall dark archway that pierces the south wall at cols 41-43 -- the
 * second way down to the beach. The overworld polls `passageRect` each
 * frame; inside it the camera dims and a chime sounds (spec B.6.6).
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export interface ClockTowerRefs {
  passageRect: Phaser.Geom.Rectangle
  crystals: Phaser.GameObjects.Triangle[]
}

export function buildClockTower(ctx: WorldCtx): ClockTowerRefs {
  const { scene, TILE } = ctx
  const L = 41, M = 42, R = 43        // tower columns
  const TOP = 29                      // cap row; base row TOP+4 sits on the wall line

  // flanking pillars (solid)
  for (let r = TOP; r <= TOP + 4; r++) {
    ctx.tile(L, r, r === TOP ? 96 : r === TOP + 4 ? 108 : 99, 4)
    ctx.tile(R, r, r === TOP ? 98 : r === TOP + 4 ? 110 : 101, 4)
    ctx.block(L, r)
    ctx.block(R, r)
  }
  // the archway -- centre column is open passage top to bottom
  ctx.tile(M, TOP, 113, 4)
  for (let r = TOP + 1; r <= TOP + 4; r++) ctx.tile(M, r, 123, 4)

  // clock face mounted above the arch opening
  const fx = (M + 0.5) * TILE
  const fy = (TOP + 0.45) * TILE
  scene.add.circle(fx, fy, 11, 0xf0e6c8).setStrokeStyle(2, 0x4a3a28).setDepth(5)
  scene.add.line(fx, fy, 0, 0, 0, -7, 0x3a2418).setLineWidth(1.6).setOrigin(0).setDepth(6)
  scene.add.line(fx, fy, 0, 0, 6, 0, 0x3a2418).setLineWidth(1.6).setOrigin(0).setDepth(6)
  const second = scene.add.line(fx, fy, 0, 0, 0, -9, 0xa83232).setLineWidth(1).setOrigin(0).setDepth(6)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: second, angle: 360, duration: 60000, repeat: -1 })
  }

  // glowing crystals set into the passage walls
  const crystals: Phaser.GameObjects.Triangle[] = []
  for (const [cx, cy] of [
    [(L + 0.88) * TILE, (TOP + 1.7) * TILE],
    [(R + 0.12) * TILE, (TOP + 3.1) * TILE],
  ]) {
    const cr = scene.add.triangle(cx, cy, 0, 8, 8, 8, 4, 0, 0x7ae0e8, 0.85).setDepth(5)
    if (!ctx.reduced) {
      scene.tweens.add({
        targets: cr, alpha: 0.35, duration: 1100, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut', delay: crystals.length * 400,
      })
    }
    crystals.push(cr)
  }

  scene.add.text((M + 0.5) * TILE, (TOP - 0.6) * TILE, 'Clock Tower', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)

  // detection rect: centre column, a little proud of the arch at both ends
  const passageRect = new Phaser.Geom.Rectangle(
    M * TILE - 4, (TOP - 0.4) * TILE, TILE + 8, 5.6 * TILE,
  )
  return { passageRect, crystals }
}
