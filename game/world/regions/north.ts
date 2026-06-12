/**
 * The North -- everything above the town wall on the map's centre band:
 * The Atelier ("crafts on display"), the Quest Board, and the Cathedral
 * of Whisperleaf-on-the-Hill on its green hill.
 */
import type { WorldCtx } from '../ctx'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

// Hand-curated vigils feed (spec K.4 default). RPG-phrased; refresh by hand.
const VIGILS = [
  'PINNED -- tending the fires at TurnkeyID. the kettle stays on.',
  '[scroll] taught a gate to wait, and try again, before turning a traveler away.',
  '[scroll] raised a small lantern-hall where two hands write one story.',
  '[scroll] re-drew the valley itself -- twice now. every road remembers its name.',
  '[scroll] swept the deep archives. the scrolls breathe easier for it.',
  'the board is dusted weekly. check back, traveler.',
]

export function buildNorth(ctx: WorldCtx): void {
  buildAtelier(ctx)
  buildQuestBoard(ctx)
  buildCathedral(ctx)
}

// ---- The Atelier (portfolio: crafts) ------------------------------------------

function buildAtelier(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 30
  const cy = 10                       // roof row; walls cy+1; peak cy-1

  // 5-wide red house with a chimney
  const ROOF = [64, 65, 65, 65, 66]
  const WALL = [52, 52, 55, 52, 54]
  for (let i = 0; i < 5; i++) {
    ctx.tile(cx + i, cy, ROOF[i], 3)
    ctx.tile(cx + i, cy + 1, WALL[i], 3)
  }
  ctx.tile(cx + 2, cy - 1, 67, 4)
  ctx.blockRect(cx, cy, 5, 2)

  // chimney + smoke
  scene.add.rectangle((cx + 4.2) * TILE, (cy - 0.3) * TILE, 8, 18, 0x6e4a3a).setDepth(4)
  if (!ctx.reduced) {
    scene.add.particles(0, 0, 'tiny-town', {
      frame: 5,
      x: (cx + 4.2) * TILE,
      y: (cy - 0.6) * TILE,
      lifespan: 2600,
      speedY: { min: -16, max: -8 },
      speedX: { min: -3, max: 3 },
      scale: { start: 0.35, end: 0.8 },
      alpha: { start: 0.3, end: 0 },
      tint: 0xe8e8e8,
      frequency: 2200,
    }).setDepth(5)
  }

  const px = (cx + 2.5) * TILE
  scene.add.text(px, (cy + 2) * TILE + 8, 'THE ATELIER', {
    fontFamily: FONT_TITLE, fontSize: '16px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  scene.add.text(px, (cy + 2) * TILE + 26, 'crafts on display', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  if (ctx.visitedBuilding('atelier')) {
    scene.add.text(px, (cy + 2) * TILE + 42, '~ returned ~', {
      fontFamily: FONT_BODY, fontSize: '12px', color: '#8a5a2a', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  const hit = scene.add.zone(px, (cy + 1) * TILE, 5 * TILE, 2 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.enterInterior('AtelierInterior', 'atelier'))
}

// ---- Quest Board ----------------------------------------------------------------

function buildQuestBoard(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 44.5 * TILE
  const py = 11 * TILE

  scene.add.rectangle(px - 26, py + 14, 4, 30, 0x5a3a1c).setDepth(3)
  scene.add.rectangle(px + 26, py + 14, 4, 30, 0x5a3a1c).setDepth(3)
  scene.add.rectangle(px, py, 64, 36, 0x7a5226).setStrokeStyle(2, 0x4a2e14).setDepth(3)
  scene.add.rectangle(px, py - 22, 76, 8, 0x8d6436).setStrokeStyle(1, 0x4a2e14).setDepth(4)
  for (const [dx, dy, w, h] of [[-18, -4, 14, 16], [2, -6, 16, 12], [16, 2, 12, 14], [-4, 8, 14, 10]] as const) {
    scene.add.rectangle(px + dx, py + dy, w, h, 0xf0e6c8).setStrokeStyle(1, 0xb8a87e).setDepth(4)
  }
  scene.add.text(px, py + 30, 'Quest Board', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  ctx.block(43, 11)
  ctx.block(44, 11)
  ctx.block(45, 11)

  const hit = scene.add.zone(px, py + 4, 80, 56).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('Current Vigils', VIGILS))
}

// ---- Cathedral of Whisperleaf-on-the-Hill ------------------------------------------

function buildCathedral(ctx: WorldCtx): void {
  const { scene, TILE } = ctx

  // the hill: a soft lighter-green mound under the building
  scene.add.ellipse(43.5 * TILE, 18.5 * TILE, 12 * TILE, 14 * TILE, 0xa8c878, 0.55).setDepth(0)

  const cx = 40                       // body cols 40-47
  const W = 8
  const topRow = 16                   // body rows 16-23

  // white-stone body
  for (let r = topRow; r <= 23; r++) {
    for (let i = 0; i < W; i++) {
      const f = r === topRow ? (i === 0 ? 96 : i === W - 1 ? 98 : 97)
        : r === 23 ? (i === 0 ? 108 : i === W - 1 ? 110 : 109)
          : (i === 0 ? 99 : i === W - 1 ? 101 : 100)
      ctx.tile(cx + i, r, f, 3).setTint(0xeae6da)
    }
  }
  // gable: a pale triangle over the body, with the rose window
  // (absolute points + origin 0 -- relative points place the shape by its
  // bbox and drift it off-centre)
  const gx = (cx + W / 2) * TILE
  scene.add.triangle(0, 0,
    cx * TILE + 6, topRow * TILE,
    (cx + W) * TILE - 6, topRow * TILE,
    gx, (topRow - 2.6) * TILE,
    0xded8c8).setStrokeStyle(2, 0x9a917e).setOrigin(0).setDepth(4)
  ctx.blockRect(cx, topRow - 2, W, 2)
  // rose window
  scene.add.circle(gx, (topRow + 1.6) * TILE, 17, 0x7a5fb8).setStrokeStyle(3, 0x4a3a78).setDepth(5)
  const rose = scene.add.graphics().setDepth(6)
  rose.lineStyle(1.5, 0xc8b8e8, 0.9)
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    rose.lineBetween(gx, (topRow + 1.6) * TILE, gx + Math.cos(a) * 15, (topRow + 1.6) * TILE + Math.sin(a) * 15)
  }
  rose.strokeCircle(gx, (topRow + 1.6) * TILE, 8)
  // tall door
  ctx.tile(cx + W / 2 - 1, 23, 103, 4)
  ctx.tile(cx + W / 2, 23, 103, 4)
  // twin towers with red caps
  for (const tc of [cx - 1, cx + W]) {
    for (let r = topRow - 2; r <= 23; r++) {
      const f = r === topRow - 2 ? 97 : r === 23 ? 109 : 100
      ctx.tile(tc, r, f, 4).setTint(0xeae6da)
    }
    ctx.tile(tc, topRow - 3, 67, 5)
    for (let r = topRow - 3; r <= 23; r++) ctx.block(tc, r)
  }
  ctx.blockRect(cx, topRow, W, 8)

  scene.add.text(gx, 24.6 * TILE + 6, 'CATHEDRAL', {
    fontFamily: FONT_TITLE, fontSize: '16px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  scene.add.text(gx, 25.2 * TILE + 8, 'of Whisperleaf-on-the-Hill', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  const hit = scene.add.zone(gx, 23 * TILE + 16, 3 * TILE, 1.6 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('The Cathedral', [
    'the doors are open. inside, the choir practices on leaf-fall days -- voices like paper turning.',
    'whisperleaf grows in the cloister garden. the monks say the leaves repeat what they hear, a season late.',
  ]))
}
