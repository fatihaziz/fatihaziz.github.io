/**
 * The North-East -- Waterfall Cascade (river's source, hidden coin),
 * Aetherveil Keep on its lawn ("ancestral seat"), and the Embers' Forge
 * on the keep road (portfolio: weapons of trade).
 */
import type { WorldCtx } from '../ctx'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export function buildKeep(ctx: WorldCtx): void {
  buildCliffAndCascade(ctx)
  buildPool(ctx)
  buildCastle(ctx)
  buildForge(ctx)
  buildPathLanterns(ctx)
}

// ---- cliff + falling water -----------------------------------------------------

function buildCliffAndCascade(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // Cliff face: cols 53-61, rows 2-10 (tall stone bands, crenellated top).
  for (let c = 53; c <= 61; c++) {
    ctx.tile(c, 2, c === 53 ? 96 : c === 61 ? 98 : 97, 2)
    for (let r = 3; r <= 9; r++) {
      ctx.tile(c, r, c === 53 ? 99 : c === 61 ? 101 : 100, 2)
    }
    ctx.tile(c, 10, c === 53 ? 108 : c === 61 ? 110 : 109, 2)
  }
  ctx.blockRect(53, 2, 9, 9)

  // Cascade channel over cols 56-58: a vertical blue sheet + falling streaks.
  const fx = 56 * TILE
  const fw = 3 * TILE
  scene.add.rectangle(fx + fw / 2, 6.5 * TILE, fw - 8, 9 * TILE, 0x7fb9e5, 0.92).setDepth(3)
  scene.add.rectangle(fx + fw / 2, 6.5 * TILE, fw - 26, 9 * TILE, 0xa8d4ef, 0.55).setDepth(3)
  if (!ctx.reduced) {
    for (let i = 0; i < 6; i++) {
      const sx = fx + 8 + (i * (fw - 16)) / 5
      const streak = scene.add.rectangle(sx, 2 * TILE + 10, 3, 20, 0xffffff, 0.8).setDepth(4)
      scene.tweens.add({
        targets: streak,
        y: 11 * TILE,
        alpha: 0.1,
        duration: 800 + i * 90,
        repeat: -1,
        delay: i * 140,
        onRepeat: () => { streak.y = 2 * TILE + 10; streak.alpha = 0.8 },
      })
    }
  }
  scene.add.text(57.5 * TILE, 1.5 * TILE, 'Waterfall Cascade', {
    fontFamily: FONT_BODY, fontSize: '16px', color: '#f5e5c5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)
  scene.add.text(57.5 * TILE, 2.2 * TILE, "river's source . hidden coin", {
    fontFamily: FONT_BODY, fontSize: '11px', color: '#d8e8f5', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)
}

// ---- plunge pool -----------------------------------------------------------------

function buildPool(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 57 * TILE
  const py = 12.8 * TILE
  // pool basin cols 54-60, rows 11-14
  const g = scene.add.graphics().setDepth(2)
  g.fillStyle(0x5d9ed1, 1)
  g.fillRoundedRect(54 * TILE, 11 * TILE, 6 * TILE, 3.6 * TILE, 16)
  g.fillStyle(0x7fb9e5, 0.85)
  g.fillRoundedRect(54 * TILE + 7, 11 * TILE + 7, 6 * TILE - 14, 3.6 * TILE - 14, 13)
  ctx.blockRect(54, 11, 6, 4)

  // lily pads
  for (const [lc, lr] of [[54.7, 13.6], [59.2, 11.6]] as const) {
    scene.add.ellipse(lc * TILE, lr * TILE, 14, 9, 0x5a9a4e).setStrokeStyle(1, 0x3a6a36).setDepth(3)
  }

  // foam where the fall lands
  const foam = scene.add.ellipse(px, 11.4 * TILE, 60, 15, 0xffffff, 0.65).setDepth(3)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: foam, scaleX: 1.25, alpha: 0.3,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: { min: 54 * TILE + 8, max: 60 * TILE - 8 },
      y: { min: 11 * TILE, max: 12 * TILE },
      lifespan: 2600,
      speedY: { min: -14, max: -6 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.5, end: 0.9 },
      alpha: { start: 0.22, end: 0 },
      tint: 0xffffff,
      frequency: 420,
    }).setDepth(4)
  }

  const poolHit = scene.add.zone(px, py, 6 * TILE, 3 * TILE).setInteractive({ useHandCursor: true })
  poolHit.on('pointerdown', () => {
    ctx.showDialog('The Waterfall Pool', ['the water sings the same three notes it has sung for a hundred years.'])
  })

  // hidden coin -- a glint that blinks every ~4 s at the pool's south lip
  const coin = scene.add.image(58.8 * TILE, 14.1 * TILE, 'tiny-town', 93)
    .setScale(1.2).setDepth(5).setAlpha(0)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: coin, alpha: { from: 0, to: 1 },
      duration: 420, hold: 500, yoyo: true, repeat: -1, repeatDelay: 3200,
    })
  } else {
    coin.setAlpha(0.8)
  }
  const coinHit = scene.add.zone(58.8 * TILE, 14.1 * TILE, 30, 30).setInteractive({ useHandCursor: true })
  coinHit.on('pointerdown', () => {
    if (ctx.collect('coin.pool', 'an old copper coin')) {
      ctx.showDialog('Findings', ['an old copper coin. its face is worn smooth.'])
      coin.destroy()
      coinHit.destroy()
    }
  })
}

// ---- Aetherveil Keep ---------------------------------------------------------------

function buildCastle(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 64                       // body cols 64-76
  const W = 13
  const cy = 12                       // crenellation row; lawn around

  // lawn ellipse under the keep
  scene.add.ellipse((cx + W / 2) * TILE, 15.5 * TILE, 17 * TILE, 10 * TILE, 0xa8c878, 0.5).setDepth(0)

  // central keep block above the wall body
  const peakCx = cx + Math.floor(W / 2) - 1
  ctx.tile(peakCx + 1, cy - 3, 67, 5)
  for (let i = 0; i < 3; i++) {
    ctx.tile(peakCx + i, cy - 2, i === 0 ? 96 : i === 2 ? 98 : 97, 5)
    ctx.tile(peakCx + i, cy - 1, i === 0 ? 120 : i === 2 ? 122 : 121, 5)
  }
  // main body: crenellation, arrow slits, wall with the gate, base
  for (let i = 0; i < W; i++) {
    ctx.tile(cx + i, cy, i === 0 ? 96 : i === W - 1 ? 98 : 97, 4)
    ctx.tile(cx + i, cy + 1, i === 0 ? 120 : i === W - 1 ? 122 : 121, 4)
  }
  const gateCol = Math.floor(W / 2)
  for (let i = 0; i < W; i++) {
    let f: number
    if (i === gateCol) f = 103
    else if (i === 0) f = 99
    else if (i === W - 1) f = 101
    else f = 100
    ctx.tile(cx + i, cy + 2, f, 4)
  }
  for (let i = 0; i < W; i++) {
    ctx.tile(cx + i, cy + 3, i === 0 ? 108 : i === W - 1 ? 110 : 109, 4)
  }
  // corner towers with pennants
  for (const tc of [cx - 1, cx + W]) {
    ctx.tile(tc, cy - 2, 67, 5)
    ctx.tile(tc, cy - 1, 97, 5)
    ctx.tile(tc, cy, 121, 5)
    ctx.tile(tc, cy + 1, 100, 5)
    ctx.tile(tc, cy + 2, 100, 5)
    ctx.tile(tc, cy + 3, 109, 5)
    const px = tc * TILE + TILE / 2
    const py = (cy - 2) * TILE + 4
    const pennant = scene.add.triangle(px + 8, py, 0, -6, 18, -2, 0, 10, 0xa83232)
      .setStrokeStyle(1, 0x5a1818).setDepth(6).setOrigin(0, 0.5)
    if (!ctx.reduced) {
      scene.tweens.add({
        targets: pennant, scaleX: 0.55,
        duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })
    }
  }
  ctx.blockRect(cx - 1, cy - 3, W + 2, 7)

  scene.add.text((cx + gateCol + 0.5) * TILE, (cy - 4) * TILE + 6, 'Aetherveil Keep', {
    fontFamily: FONT_TITLE, fontSize: '18px', color: '#f5e5c5', fontStyle: '600',
    stroke: '#3a2418', strokeThickness: 4,
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(6)
  scene.add.text((cx + gateCol + 0.5) * TILE, (cy - 3.3) * TILE + 6, 'ancestral seat', {
    fontFamily: FONT_BODY, fontSize: '12px', color: '#e8d8b8', fontStyle: 'italic',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(6)

  const hit = scene.add.zone((cx + gateCol + 0.5) * TILE, (cy + 2.5) * TILE, 2 * TILE, 2 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('Aetherveil Keep', [
    'the gate is barred, but kindly -- the way a grandmother bars a pantry.',
    'the family that raised these walls has thinned to a name and a steward. the steward waves from the wall on fair mornings.',
  ]))
}

// ---- Embers' Forge (portfolio: weapons of trade) -------------------------------------

function buildForge(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 58                       // cols 58-63, east of the river
  const cy = 24                       // roof row

  const ROOF = [64, 65, 65, 65, 65, 66]
  const WALL = [52, 52, 55, 52, 52, 54]
  for (let i = 0; i < 6; i++) {
    ctx.tile(cx + i, cy, ROOF[i], 3).setTint(0x9a7a6a)      // soot-dark roof
    ctx.tile(cx + i, cy + 1, WALL[i], 3).setTint(0xc8a890)
  }
  ctx.tile(cx + 2, cy - 1, 67, 4).setTint(0x9a7a6a)
  ctx.blockRect(cx, cy, 6, 2)

  // glowing window
  const glowWin = scene.add.rectangle((cx + 4.5) * TILE, (cy + 1.45) * TILE, 18, 14, 0xff9a3c, 0.95)
    .setStrokeStyle(2, 0x6e2e14).setDepth(4)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: glowWin, fillAlpha: 0.55,
      duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })
  }
  // chimney smoke
  scene.add.rectangle((cx + 0.8) * TILE, (cy - 0.4) * TILE, 9, 20, 0x5a4a42).setDepth(4)
  if (!ctx.reduced) {
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: (cx + 0.8) * TILE,
      y: (cy - 0.8) * TILE,
      lifespan: 2400,
      speedY: { min: -18, max: -10 },
      speedX: { min: -4, max: 4 },
      scale: { start: 0.4, end: 0.9 },
      alpha: { start: 0.4, end: 0 },
      tint: 0x6a6a72,
      frequency: 1400,
    }).setDepth(5)
  }

  // anvil + ore cart in the yard
  const ax = (cx + 6.8) * TILE
  const ay = (cy + 1.4) * TILE
  scene.add.rectangle(ax, ay, 22, 7, 0x4a4a52).setDepth(3)
  scene.add.rectangle(ax, ay + 6, 10, 8, 0x3a3a42).setDepth(3)
  const cartX = (cx + 6.5) * TILE
  const cartY = (cy - 0.8) * TILE
  scene.add.rectangle(cartX, cartY, 34, 14, 0x6e4a26).setStrokeStyle(1, 0x4a2e14).setDepth(3)
  scene.add.circle(cartX - 10, cartY + 9, 5, 0x3a3a42).setDepth(3)
  scene.add.circle(cartX + 10, cartY + 9, 5, 0x3a3a42).setDepth(3)
  for (const [ox, oy] of [[-8, -5], [0, -7], [8, -5]] as const) {
    scene.add.circle(cartX + ox, cartY + oy, 4, 0x8a8a92).setDepth(4)
  }
  ctx.block(cx + 6, cy + 1)

  const px = (cx + 3) * TILE
  scene.add.text(px, (cy + 2) * TILE + 8, "EMBERS' FORGE", {
    fontFamily: FONT_TITLE, fontSize: '16px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  scene.add.text(px, (cy + 2) * TILE + 26, 'weapons of trade', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  if (ctx.visitedBuilding('forge')) {
    scene.add.text(px, (cy + 2) * TILE + 42, '~ returned ~', {
      fontFamily: FONT_BODY, fontSize: '12px', color: '#8a5a2a', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  const hit = scene.add.zone(px, (cy + 1) * TILE, 6 * TILE, 2 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.enterInterior('EmbersForge', 'forge'))
}

// ---- lanterns on the keep road -----------------------------------------------------

function buildPathLanterns(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  for (const [c, r] of [[63, 18.4], [68, 18.4]] as const) {
    const px = c * TILE + TILE / 2
    const py = r * TILE + TILE / 2
    scene.add.rectangle(px, py + 6, 3, 26, 0x3a2e22).setDepth(3)
    scene.add.rectangle(px, py - 8, 10, 12, 0x4a3a28).setStrokeStyle(1, 0x2a1e12).setDepth(3)
    scene.add.circle(px, py - 8, 3.2, 0xffd98a, 0.95).setDepth(4)
    scene.add.circle(px, py - 8, 14, 0xffc24b, 0.10).setDepth(4)
  }
}
