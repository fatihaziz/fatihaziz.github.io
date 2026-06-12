/**
 * The river -- born at the waterfall pool, running south past the Forge,
 * bending south-east through the fields and widening into the sea. Two
 * crossings: the north bridge on the keep road and the Stone Bridge on
 * the forge road. All water is procedural (the Kenney sheet has no water
 * tiles) -- layered rectangles + tweens.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export interface RiverRefs {
  stoneBridgeRect: Phaser.Geom.Rectangle
}

// Straight segments: [colStart, colEnd, rowStart, rowEnd] inclusive tiles.
const SEGMENTS: [number, number, number, number][] = [
  [54, 56, 15, 30],     // pool -> forge latitude
  [55, 57, 31, 42],     // drift east past the forge road
  [56, 58, 43, 48],     // through the wheat fields
  [57, 60, 49, 58],     // the widening mouth, into the sea
]

const NORTH_BRIDGE_ROWS = [19, 20]   // keep road
const STONE_BRIDGE_ROWS = [28, 29]   // forge road

export function buildRiver(ctx: WorldCtx): RiverRefs {
  const { scene, TILE } = ctx

  for (const [c0, c1, r0, r1] of SEGMENTS) {
    const x = c0 * TILE
    const w = (c1 - c0 + 1) * TILE
    const y = r0 * TILE
    const h = (r1 - r0 + 1) * TILE
    scene.add.rectangle(x + w / 2, y + h / 2, w, h, 0x5d9ed1).setDepth(1)
    scene.add.rectangle(x + w / 2, y + h / 2, Math.max(10, w - 12), h, 0x6fadd9).setDepth(1)
    // banks
    scene.add.rectangle(x + 1, y + h / 2, 3, h, 0x4a7a4e).setDepth(2)
    scene.add.rectangle(x + w - 1, y + h / 2, 3, h, 0x4a7a4e).setDepth(2)
    // collision (bridge rows stay open -- the decks cover them)
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) {
        if (NORTH_BRIDGE_ROWS.includes(r) || STONE_BRIDGE_ROWS.includes(r)) continue
        ctx.block(c, r)
      }
    }
    // drifting current dashes
    if (!ctx.reduced) {
      const n = Math.max(3, Math.floor(h / TILE / 4))
      for (let i = 0; i < n; i++) {
        const dx = x + 8 + ((i * 37) % (w - 16))
        const dy = y + ((i * 173) % Math.max(40, h - 60))
        const dash = scene.add.rectangle(dx, dy, 3, 14, 0xc8e4f5, 0.6).setDepth(2)
        scene.tweens.add({
          targets: dash,
          y: dy + 220,
          duration: 5200 + i * 300,
          repeat: -1,
          onRepeat: () => { dash.y = dy },
        })
      }
    }
  }

  buildDeck(ctx, 53, 57, NORTH_BRIDGE_ROWS, 'North Bridge')
  const stoneBridgeRect = buildDeck(ctx, 53, 57, STONE_BRIDGE_ROWS, 'Stone Bridge')
  return { stoneBridgeRect }
}

/** a stone deck + wooden rails across the river; returns the deck rect */
function buildDeck(ctx: WorldCtx, c0: number, c1: number, rows: number[], label: string): Phaser.Geom.Rectangle {
  const { scene, TILE } = ctx
  for (const r of rows) {
    for (let c = c0; c <= c1; c++) {
      ctx.tile(c, r, r === rows[0] ? 97 : 109, 2)
      ctx.unblock(c, r)
    }
  }
  for (let c = c0; c <= c1; c++) {
    ctx.tile(c, rows[0] - 0.45, 45, 3)
    ctx.tile(c, rows[rows.length - 1] + 0.45, 69, 3)
  }
  scene.add.text((c0 + (c1 - c0) / 2 + 0.5) * TILE, (rows[0] - 1) * TILE + 6, label, {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)

  return new Phaser.Geom.Rectangle(c0 * TILE, rows[0] * TILE, (c1 - c0 + 1) * TILE, rows.length * TILE)
}
