/**
 * The Shore -- everything along the map's south band: the stables +
 * paddock below the wall, the stilt house on the slope, the beach with
 * its shells and crab, the Net-Mender, the fishing dock, the wheat
 * fields with their scarecrows east of the river mouth, and the Beacon
 * of Distant Roads (portfolio: contact) standing over its own field.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'
import { hasFinding } from '../save'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export const SAND_TOP = 53
export const SEA_TOP = 56

export interface ShoreRefs {
  /** stand here + SPACE to fish (dock end) */
  dockRect: Phaser.Geom.Rectangle
  /** px point where the bobber lands */
  bobberPoint: { x: number; y: number }
}

export function buildShore(ctx: WorldCtx): ShoreRefs {
  buildSand(ctx)
  buildSea(ctx)
  buildStables(ctx)
  buildStiltHouse(ctx)
  buildFields(ctx)
  buildBeacon(ctx)
  buildShells(ctx)
  buildCrab(ctx)
  buildNetMender(ctx)
  return buildDock(ctx)
}

// ---- sand -------------------------------------------------------------------------

function buildSand(ctx: WorldCtx): void {
  const { COLS } = ctx
  for (let r = SAND_TOP; r < SEA_TOP; r++) {
    for (let c = 0; c < COLS; c++) {
      const n = (r * 31 + c * 17) % 100
      let f = 49                       // tiny-dungeon sandy floor
      if (n < 18) f = 48
      else if (n < 30) f = 50
      ctx.dtile(c, r, f, 0).setOrigin(0, 0)
    }
  }
  // beach grass tufts along the upper edge
  for (let c = 3; c < COLS - 3; c += 5) {
    ctx.tile(c + ((c * 7) % 3) * 0.3, SAND_TOP + 0.15, 17, 1)
  }
}

// ---- sea --------------------------------------------------------------------------

function buildSea(ctx: WorldCtx): void {
  const { scene, TILE, COLS, ROWS } = ctx
  const top = SEA_TOP * TILE
  const height = (ROWS - SEA_TOP) * TILE
  const width = COLS * TILE
  scene.add.rectangle(width / 2, top + height / 2, width, height, 0x3a6a9c).setDepth(1)
  scene.add.rectangle(width / 2, top + height * 0.25, width, height * 0.5, 0x4a7aac, 0.7).setDepth(1)

  // foam line where sea meets sand
  for (let c = 0; c < COLS; c += 2) {
    const foam = scene.add.rectangle(c * TILE + TILE, top + 3, TILE * 1.6, 4, 0xdef0f8, 0.7).setDepth(2)
    if (!ctx.reduced) {
      scene.tweens.add({
        targets: foam, alpha: 0.25, scaleX: 0.7,
        duration: 1400 + (c % 5) * 180, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        delay: (c % 7) * 130,
      })
    }
  }
  // two slow wave bands
  if (!ctx.reduced) {
    for (let i = 0; i < 2; i++) {
      const wy = top + 36 + i * 48
      const band = scene.add.rectangle(width / 2, wy, width, 5, 0x8ab8d8, 0.4).setDepth(2)
      scene.tweens.add({
        targets: band, y: wy + 14, alpha: 0.15,
        duration: 2600 + i * 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 700,
      })
    }
  }

  // collision: the whole sea (the dock re-opens its planks)
  for (let r = SEA_TOP; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) ctx.block(c, r)
  }
}

// ---- stables + paddock below the wall ------------------------------------------------

function buildStables(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 16                       // cols 16-25, rows 49-51
  const W = 10
  for (let i = 0; i < W; i++) {
    ctx.tile(cx + i, 49, i === 0 ? 64 : i === W - 1 ? 66 : 65, 3).setTint(0x9a7a52)
    ctx.tile(cx + i, 50, i === 0 ? 52 : i === W - 1 ? 54 : 52, 3).setTint(0xb89878)
  }
  ctx.blockRect(cx, 49, W, 2)
  // three stall openings with horse heads
  for (let s = 0; s < 3; s++) {
    const sx = (cx + 1.5 + s * 3) * TILE
    const sy = 50.5 * TILE
    scene.add.rectangle(sx, sy - 6, 22, 24, 0x2a1e12).setDepth(4)
    scene.add.ellipse(sx, sy - 8, 14, 12, 0x6e4a26).setDepth(5)
    scene.add.ellipse(sx - 2, sy - 14, 7, 9, 0x6e4a26).setDepth(5)
    scene.add.circle(sx - 4, sy - 15, 1.2, 0x2a1e12).setDepth(6)
  }
  scene.add.text((cx + W / 2) * TILE, 51.6 * TILE + 6, 'The Stables', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  const hit = scene.add.zone((cx + W / 2) * TILE, 50 * TILE, W * TILE, 2 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('The Stables', [
    'three patient heads watch you over the doors. the bay one has decided you are acceptable.',
  ]))

  // paddock fence west of the stables
  for (let c = 4; c <= 13; c++) {
    ctx.tile(c, 49.4, 45, 2)
    ctx.tile(c, 51.6, 45, 2)
  }
  for (const r of [49.4, 50.5, 51.6]) {
    ctx.tile(3.4, r, 69, 2)
    ctx.tile(13.6, r, 69, 2)
  }
  // hay pile
  scene.add.ellipse(8 * TILE, 50.8 * TILE, 30, 16, 0xd8b04a).setStrokeStyle(1, 0x8a6a1e).setDepth(2)
}

// ---- the stilt house on the slope -----------------------------------------------------

function buildStiltHouse(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 43                       // cols 43-45, rows 44-46
  const cy = 44
  for (let i = 0; i < 3; i++) {
    ctx.tile(cx + i, cy, [64, 65, 66][i], 4).setTint(0xe8c890)
    ctx.tile(cx + i, cy + 1, [52, 55, 54][i], 4).setTint(0xf0d8a8)
  }
  // stilts + ladder below the floor line
  for (const dx of [0.25, 1.5, 2.75]) {
    scene.add.rectangle((cx + dx) * TILE, (cy + 2.35) * TILE, 5, 24, 0x6e4a26).setDepth(3)
  }
  const lx = (cx + 1.5) * TILE
  scene.add.rectangle(lx - 6, (cy + 2.4) * TILE, 2, 26, 0x8a5a30).setDepth(3)
  scene.add.rectangle(lx + 6, (cy + 2.4) * TILE, 2, 26, 0x8a5a30).setDepth(3)
  for (let i = 0; i < 3; i++) {
    scene.add.rectangle(lx, (cy + 1.95 + i * 0.3) * TILE, 12, 2, 0x8a5a30).setDepth(3)
  }
  ctx.blockRect(cx, cy, 3, 3)
  scene.add.text((cx + 1.5) * TILE, (cy + 3) * TILE + 4, 'the Stilt House', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  const hit = scene.add.zone((cx + 1.5) * TILE, (cy + 1) * TILE, 3 * TILE, 2.6 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('The Stilt House', [
    'the tide argues with the posts every evening. the posts are winning, so far.',
  ]))
}

// ---- wheat fields + scarecrows ---------------------------------------------------------

function buildFields(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // [c0, r0, w, h] -- west of the river, east of it, and the beacon field
  const plots: [number, number, number, number][] = [
    [50, 44, 5, 4],
    [60, 44, 6, 4],
    [62, 49, 11, 4],
  ]
  for (const [c0, r0, w, h] of plots) {
    for (let r = r0; r < r0 + h; r++) {
      for (let c = c0; c < c0 + w; c++) {
        ctx.tile(c, r, 2, 1).setTint(0xf3d36d)
        ctx.block(c, r)
      }
    }
    scene.add.rectangle((c0 + w / 2) * TILE, (r0 + h / 2) * TILE, w * TILE, h * TILE)
      .setStrokeStyle(2, 0xb8923c, 0.8).setDepth(2)
  }

  // scarecrows
  for (const [c, r] of [[52, 45.5], [62.5, 45.2], [70, 50.5]] as const) {
    const px = c * TILE
    const py = r * TILE
    scene.add.rectangle(px, py + 4, 3, 26, 0x6e4a26).setDepth(3)
    scene.add.rectangle(px, py - 4, 22, 3, 0x6e4a26).setDepth(3)
    scene.add.circle(px, py - 10, 6, 0xd8b04a).setStrokeStyle(1, 0x8a6a1e).setDepth(3)
    scene.add.triangle(px, py - 17, -6, 0, 6, 0, 0, -7, 0x8a5a30).setDepth(3)
    const hit = scene.add.zone(px, py - 4, 30, 36).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => ctx.showDialog('A Scarecrow', [
      'it minds the wheat. it also, you suspect, minds you.',
    ]))
  }
}

// ---- Beacon of Distant Roads (portfolio: contact) ---------------------------------------

function buildBeacon(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const M = 67                        // tower centre col; base cols 66-68

  // approach notch: sand path cut into the beacon field from the south
  for (let r = 49; r <= 52; r++) {
    for (const c of [66, 67, 68]) {
      ctx.dtile(c, r, 49, 1).setOrigin(0, 0)
      ctx.unblock(c, r)
    }
  }

  // base: 3 wide, rows 47-48
  ctx.tile(M - 1, 47, 99, 3); ctx.tile(M, 47, 100, 3); ctx.tile(M + 1, 47, 101, 3)
  ctx.tile(M - 1, 48, 108, 3); ctx.tile(M, 48, 86, 3); ctx.tile(M + 1, 48, 110, 3)
  // neck: 1 wide, rows 44-46, with red bands
  ctx.tile(M, 46, 100, 3).setTint(0xd86a5a)
  ctx.tile(M, 45, 100, 3)
  ctx.tile(M, 44, 100, 3).setTint(0xd86a5a)
  // lantern room at row 43
  const lx = (M + 0.5) * TILE
  const ly = 43.4 * TILE
  scene.add.rectangle(lx, ly, 26, 18, 0x4a3a28).setStrokeStyle(2, 0x2a1e12).setDepth(4)
  scene.add.circle(lx, ly, 6, 0xffd98a).setDepth(5)
  const glow = scene.add.circle(lx, ly, 16, 0xffc24b, 0.25).setDepth(4)
  scene.add.triangle(lx, ly - 14, 0, 8, 22, 0, 11, -6, 0x8d6436).setDepth(4)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: glow, alpha: 0.08, scale: 1.3, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    // revolving beam
    const beam = scene.add.triangle(lx, ly, 0, 0, 160, -18, 160, 18, 0xffe8b0, 0.14).setOrigin(0).setDepth(4)
    scene.tweens.add({ targets: beam, angle: 360, duration: 7000, repeat: -1 })
  }

  ctx.blockRect(M - 1, 47, 3, 2)
  ctx.block(M, 46)
  ctx.block(M, 45)
  ctx.block(M, 44)

  scene.add.text(lx, 49.5 * TILE, 'BEACON', {
    fontFamily: FONT_TITLE, fontSize: '15px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  scene.add.text(lx, 50.1 * TILE + 4, 'of Distant Roads', {
    fontFamily: FONT_BODY, fontSize: '12px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  if (ctx.visitedBuilding('beacon')) {
    scene.add.text(lx, 50.8 * TILE + 6, '~ returned ~', {
      fontFamily: FONT_BODY, fontSize: '12px', color: '#8a5a2a', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  const hit = scene.add.zone(lx, 46 * TILE, 3.4 * TILE, 5.6 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.enterInterior('BeaconOfDistantRoads', 'beacon'))
}

// ---- shells ------------------------------------------------------------------------------

interface ShellDef {
  key: string
  col: number
  row: number
  base: number
  ridge: number
  label: string
  line: string
}

const SHELLS: ShellDef[] = [
  { key: 'shell.1', col: 8, row: 54.3, base: 0xd9a066, ridge: 0x8a5a30, label: 'a striped shell', line: 'you picked up a striped shell. the sea has many of these, and gives them away freely.' },
  { key: 'shell.2', col: 22, row: 55.1, base: 0xe8a8b8, ridge: 0xa86878, label: 'a rose shell', line: 'a rose shell. it is pinker on the inside, like most things.' },
  { key: 'shell.3', col: 35, row: 53.9, base: 0xf0ead8, ridge: 0xb0a890, label: 'a moon-white shell', line: 'a moon-white shell, smooth as a held breath.' },
  { key: 'shell.4', col: 51, row: 54.8, base: 0x88a8c8, ridge: 0x587898, label: 'a dusk-blue shell', line: 'a dusk-blue shell. hold it to your ear: the sea, but politer.' },
  { key: 'shell.5', col: 74, row: 54.2, base: 0xf0d088, ridge: 0xb89848, label: 'a sun-gold shell', line: 'a sun-gold shell. the crab eyed it first; you were faster.' },
]

function buildShells(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  for (const s of SHELLS) {
    if (hasFinding(s.key)) continue
    const px = s.col * TILE
    const py = s.row * TILE
    const g = scene.add.graphics().setDepth(2)
    g.fillStyle(s.base, 1)
    g.slice(px, py + 3, 8, Math.PI, 0, false)
    g.fillPath()
    g.lineStyle(1, s.ridge, 1)
    for (const a of [-0.6, 0, 0.6]) {
      g.lineBetween(px, py + 3, px + Math.sin(a) * 7, py + 3 - Math.cos(a) * 7)
    }
    const hit = scene.add.zone(px, py, 26, 22).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => {
      if (ctx.collect(s.key, s.label)) {
        ctx.showDialog('Findings', [s.line])
        g.destroy()
        hit.destroy()
      }
    })
  }
}

// ---- crab ----------------------------------------------------------------------------------

function buildCrab(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 47 * TILE
  const py = 54.6 * TILE
  const crab = scene.add.image(px, py, 'tiny-dungeon', 110).setScale(1.8).setDepth(3)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: crab, x: px + 38,
      duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onYoyo: () => crab.setFlipX(true),
      onRepeat: () => crab.setFlipX(false),
    })
  }
  const hit = scene.add.zone(px + 19, py, 86, 30).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () =>
    ctx.showDialog('A Crab', ['it sidles. it has nowhere urgent to be, and it is magnificent about it.']))
}

// ---- the net-mender ---------------------------------------------------------------------------

function buildNetMender(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 36 * TILE
  const py = 54.2 * TILE
  scene.add.ellipse(px, py + 18, 26, 8, 0x000000, 0.25).setDepth(2)
  const npc = scene.add.image(px, py, 'tiny-dungeon', 112).setScale(2.6).setDepth(3)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: npc, y: py - 2, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
  }
  // a net spread beside her
  const g = scene.add.graphics().setDepth(2)
  g.lineStyle(1, 0x6e5a3a, 0.8)
  for (let i = 0; i <= 4; i++) {
    g.lineBetween(px + 22, py - 2 + i * 5, px + 54, py - 6 + i * 5)
    g.lineBetween(px + 22 + i * 8, py - 4, px + 26 + i * 8, py + 18)
  }
  const hit = scene.add.zone(px, py, 44, 50).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => {
    if (hasFinding('fish.mythic')) {
      ctx.showDialog('The Net-Mender', [
        'you met the keeper below the dock, then. i can tell -- the water leaves a mark around the eyes.',
        'it shows itself maybe once a generation. carry that gently, traveler.',
      ])
      return
    }
    ctx.showDialog('The Net-Mender', [
      'the nets tear in the same three places every season. the sea is consistent, whatever else they say of her.',
      'cast a line off the dock end if you have the patience. the fish here reward the unhurried.',
    ])
  })
}

// ---- fishing dock ------------------------------------------------------------------------------

function buildDock(ctx: WorldCtx): ShoreRefs {
  const { scene, TILE } = ctx
  // a pier running along the waterline (rows 55-56, cols 38-45), its outer
  // half over the water -- per the map, the angler stands at the east end
  for (let c = 38; c <= 45; c++) {
    ctx.tile(c, 55, 81, 2)
    ctx.tile(c, 56, 81, 2)
    ctx.unblock(c, 55)
    ctx.unblock(c, 56)
  }
  // posts
  for (const [c, r] of [[38, 55.2], [38, 56.7], [45.7, 55.2], [45.7, 56.7], [41.8, 56.7]] as const) {
    scene.add.rectangle(c * TILE + 5, r * TILE, 5, 10, 0x4a2e14).setDepth(3)
  }
  // standing rod prop at the dock end
  const rx = 45.4 * TILE
  const ry = 55.6 * TILE
  scene.add.line(rx, ry, 0, 0, 10, -26, 0x6e4a26).setLineWidth(2).setOrigin(0).setDepth(3)
  scene.add.circle(rx + 1, ry + 2, 2.5, 0x8a8a92).setDepth(3)

  scene.add.text(41.5 * TILE, 57.4 * TILE, 'Fishing Dock', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#def0f8', fontStyle: 'italic',
    stroke: '#1a3048', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  const dockRect = new Phaser.Geom.Rectangle(43 * TILE, 54.8 * TILE, 3 * TILE, 2.4 * TILE)
  const bobberPoint = { x: 47.6 * TILE, y: 57.6 * TILE }
  return { dockRect, bobberPoint }
}
