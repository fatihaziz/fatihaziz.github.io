/**
 * Waterfall Cascade (NE), the river running south to the sea, the Stone
 * Bridge on the east road, and the small east-bank meadow with its bench.
 * All water is procedural (the Kenney sheet has no water tiles) -- layered
 * rectangles + tweens, same language as the town fountain.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export const RIVER_COLS = [56, 57]
export const RIVER_TOP = 8            // pool ends, river begins
export const RIVER_BOTTOM = 43        // meets the sea
export const BRIDGE_ROWS = [17, 18, 19]

export interface WaterfallRefs {
  bridgeRect: Phaser.Geom.Rectangle
}

export function buildWaterfall(ctx: WorldCtx): WaterfallRefs {
  buildCliffAndCascade(ctx)
  buildPool(ctx)
  buildRiver(ctx)
  const bridgeRect = buildBridge(ctx)
  buildEastMeadow(ctx)
  return { bridgeRect }
}

// ---- cliff + falling water ---------------------------------------------------

function buildCliffAndCascade(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // Cliff face: cols 53-60, rows 1-4 (stone bands, crenellated top).
  for (let c = 53; c <= 60; c++) {
    ctx.tile(c, 1, c === 53 ? 96 : c === 60 ? 98 : 97, 2)
    ctx.tile(c, 2, c === 53 ? 99 : c === 60 ? 101 : 100, 2)
    ctx.tile(c, 3, c === 53 ? 99 : c === 60 ? 101 : 100, 2)
    ctx.tile(c, 4, c === 53 ? 108 : c === 60 ? 110 : 109, 2)
  }
  ctx.blockRect(53, 1, 8, 4)

  // Cascade channel over cols 56-57: a vertical blue sheet + falling streaks.
  const fx = 56 * TILE
  const fw = 2 * TILE
  scene.add.rectangle(fx + fw / 2, 3 * TILE, fw - 6, 4 * TILE, 0x7fb9e5, 0.9).setDepth(3)
  scene.add.rectangle(fx + fw / 2, 3 * TILE, fw - 18, 4 * TILE, 0xa8d4ef, 0.55).setDepth(3)
  if (!ctx.reduced) {
    for (let i = 0; i < 5; i++) {
      const sx = fx + 8 + (i * (fw - 16)) / 4
      const streak = scene.add.rectangle(sx, 1 * TILE + 10, 3, 18, 0xffffff, 0.8).setDepth(4)
      scene.tweens.add({
        targets: streak,
        y: 5 * TILE,
        alpha: 0.1,
        duration: 700 + i * 90,
        repeat: -1,
        delay: i * 140,
        onRepeat: () => { streak.y = 1 * TILE + 10; streak.alpha = 0.8 },
      })
    }
  }
  scene.add.text(57 * TILE, 0.5 * TILE, 'Waterfall Cascade', {
    fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)
}

// ---- pool ---------------------------------------------------------------------

function buildPool(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 56.5 * TILE + TILE / 2
  const py = 6.5 * TILE
  // pool basin cols 55-58, rows 5-7
  const g = scene.add.graphics().setDepth(2)
  g.fillStyle(0x5d9ed1, 1)
  g.fillRoundedRect(55 * TILE, 5 * TILE, 4 * TILE, 3 * TILE, 14)
  g.fillStyle(0x7fb9e5, 0.85)
  g.fillRoundedRect(55 * TILE + 6, 5 * TILE + 6, 4 * TILE - 12, 3 * TILE - 12, 12)
  ctx.blockRect(55, 5, 4, 3)

  // foam where the fall lands
  const foam = scene.add.ellipse(px, 5.4 * TILE, 52, 14, 0xffffff, 0.65).setDepth(3)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: foam, scaleX: 1.25, alpha: 0.3,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })
    // mist wisps -- soft white puffs drifting up (round bush frame, tinted)
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: { min: 55 * TILE + 8, max: 59 * TILE - 8 },
      y: { min: 5 * TILE, max: 6 * TILE },
      lifespan: 2600,
      speedY: { min: -14, max: -6 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.5, end: 0.9 },
      alpha: { start: 0.22, end: 0 },
      tint: 0xffffff,
      frequency: 420,
    }).setDepth(4)
  }

  // ambient click on the pool
  const poolHit = scene.add.zone(px, py, 4 * TILE, 3 * TILE).setInteractive({ useHandCursor: true })
  poolHit.on('pointerdown', () => {
    ctx.showDialog('The Waterfall Pool', ['the water sings the same three notes it has sung for a hundred years.'])
  })

  // hidden coin -- a glint that blinks every ~4 s at the pool's south lip
  const coin = scene.add.image(57.6 * TILE, 7.4 * TILE, 'tiny-town', 93)
    .setScale(1.2).setDepth(5).setAlpha(0)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: coin, alpha: { from: 0, to: 1 },
      duration: 420, hold: 500, yoyo: true, repeat: -1, repeatDelay: 3200,
    })
  } else {
    coin.setAlpha(0.8)
  }
  const coinHit = scene.add.zone(57.6 * TILE, 7.4 * TILE, 30, 30).setInteractive({ useHandCursor: true })
  coinHit.on('pointerdown', () => {
    if (ctx.collect('coin.pool', 'an old copper coin')) {
      ctx.showDialog('Findings', ['an old copper coin. its face is worn smooth.'])
      coin.destroy()
      coinHit.destroy()
    }
  })
}

// ---- river ---------------------------------------------------------------------

function buildRiver(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const left = RIVER_COLS[0] * TILE
  const width = RIVER_COLS.length * TILE
  const top = RIVER_TOP * TILE
  const height = (RIVER_BOTTOM - RIVER_TOP + 1) * TILE

  scene.add.rectangle(left + width / 2, top + height / 2, width, height, 0x5d9ed1).setDepth(1)
  scene.add.rectangle(left + width / 2, top + height / 2, width - 10, height, 0x6fadd9).setDepth(1)
  // banks
  scene.add.rectangle(left + 1, top + height / 2, 3, height, 0x4a7a4e).setDepth(2)
  scene.add.rectangle(left + width - 1, top + height / 2, 3, height, 0x4a7a4e).setDepth(2)

  // collision (bridge rows stay open -- the bridge deck covers them)
  for (const c of RIVER_COLS) {
    for (let r = RIVER_TOP; r <= RIVER_BOTTOM; r++) {
      if (BRIDGE_ROWS.includes(r)) continue
      ctx.block(c, r)
    }
  }

  // drifting current dashes
  if (!ctx.reduced) {
    for (let i = 0; i < 10; i++) {
      const dx = left + 8 + ((i * 37) % (width - 16))
      const dy = top + ((i * 173) % (height - 40))
      const dash = scene.add.rectangle(dx, dy, 3, 14, 0xc8e4f5, 0.6).setDepth(2)
      scene.tweens.add({
        targets: dash,
        y: dy + 260,
        duration: 5200 + i * 300,
        repeat: -1,
        onRepeat: () => { dash.y = dy },
      })
    }
  }
}

// ---- stone bridge ----------------------------------------------------------------

function buildBridge(ctx: WorldCtx): Phaser.Geom.Rectangle {
  const { scene, TILE } = ctx
  // Deck: stone slabs spanning cols 55-58 on rows 17-19.
  for (let r = 17; r <= 19; r++) {
    for (let c = 55; c <= 58; c++) {
      ctx.tile(c, r, r === 17 ? 97 : r === 19 ? 109 : 109, 2)
    }
  }
  // Railings (wooden fence runs) above and below the deck.
  for (let c = 55; c <= 58; c++) {
    ctx.tile(c, 16.55, 45, 3)
    ctx.tile(c, 19.45, 69, 3)
  }
  scene.add.text(57 * TILE, 16 * TILE - 6, 'Stone Bridge', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)

  return new Phaser.Geom.Rectangle(55 * TILE, 17 * TILE, 4 * TILE, 3 * TILE)
}

// ---- east-bank meadow --------------------------------------------------------------

function buildEastMeadow(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // wildflowers + a few trees on the far bank
  const flowers: [number, number][] = [[59.5, 10], [61, 12], [60, 15], [62, 9], [59.8, 21], [61.4, 23], [60.2, 26]]
  for (const [c, r] of flowers) ctx.tile(c, r, 2, 1)
  const trees: [number, number][] = [[61.5, 6], [59.5, 28], [61.8, 27]]
  for (const [c, r] of trees) {
    ctx.tile(c, r, 4, 2)
    ctx.block(Math.round(c), r)
  }
  ctx.tile(60.4, 19, 29, 1) // mushrooms
  ctx.tile(59.2, 13.5, 17, 1) // sprouts

  // the bench that faces the falls
  const bx = 60 * TILE
  const by = 11.5 * TILE
  scene.add.rectangle(bx, by, 40, 8, 0x8a5a30).setStrokeStyle(1, 0x4a2e14).setDepth(2)
  scene.add.rectangle(bx - 16, by + 7, 4, 10, 0x6e4a26).setDepth(2)
  scene.add.rectangle(bx + 16, by + 7, 4, 10, 0x6e4a26).setDepth(2)
  ctx.block(60, 11)
  const hit = scene.add.zone(bx, by, 48, 26).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () =>
    ctx.showDialog('A Weathered Bench', ['the bench faces the falls exactly. someone measured this view, once, and meant it.']))
}
