/**
 * The South Shore -- sand strip, animated sea, five collectible shells,
 * a sidling crab, the fishing dock, the Net-Mender, and the Beacon of
 * Distant Roads rebuilt as a proper lighthouse on the shore.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../ctx'
import { hasFinding } from '../save'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export const SAND_TOP = 40
export const SEA_TOP = 44

export interface BeachRefs {
  /** stand here + SPACE to fish (dock end) */
  dockRect: Phaser.Geom.Rectangle
  /** px point where the bobber lands */
  bobberPoint: { x: number; y: number }
}

export function buildBeach(ctx: WorldCtx): BeachRefs {
  buildSand(ctx)
  buildSea(ctx)
  buildShells(ctx)
  buildCrab(ctx)
  buildNetMender(ctx)
  buildLighthouse(ctx)
  return buildDock(ctx)
}

// ---- sand -------------------------------------------------------------------

function buildSand(ctx: WorldCtx): void {
  const { COLS } = ctx
  for (let r = SAND_TOP; r < SEA_TOP; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      const n = (r * 31 + c * 17) % 100
      let f = 49                       // tiny-dungeon sandy floor
      if (n < 18) f = 48
      else if (n < 30) f = 50
      ctx.dtile(c, r, f, 0).setOrigin(0, 0)
    }
  }
  // beach grass tufts along the upper edge
  for (let c = 3; c < COLS - 3; c += 4) {
    ctx.tile(c + ((c * 7) % 3) * 0.3, SAND_TOP + 0.15, 17, 1)
  }
}

// ---- sea --------------------------------------------------------------------

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

  // collision: the whole sea (the dock module re-opens its planks)
  for (let r = SEA_TOP; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) ctx.block(c, r)
  }
}

// ---- shells -----------------------------------------------------------------

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
  { key: 'shell.1', col: 8, row: 41.5, base: 0xd9a066, ridge: 0x8a5a30, label: 'a striped shell', line: 'you picked up a striped shell. the sea has many of these, and gives them away freely.' },
  { key: 'shell.2', col: 15, row: 42.4, base: 0xe8a8b8, ridge: 0xa86878, label: 'a rose shell', line: 'a rose shell. it is pinker on the inside, like most things.' },
  { key: 'shell.3', col: 33, row: 41.2, base: 0xf0ead8, ridge: 0xb0a890, label: 'a moon-white shell', line: 'a moon-white shell, smooth as a held breath.' },
  { key: 'shell.4', col: 44, row: 42.6, base: 0x88a8c8, ridge: 0x587898, label: 'a dusk-blue shell', line: 'a dusk-blue shell. hold it to your ear: the sea, but politer.' },
  { key: 'shell.5', col: 56, row: 41.6, base: 0xf0d088, ridge: 0xb89848, label: 'a sun-gold shell', line: 'a sun-gold shell. the crab eyed it first; you were faster.' },
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

// ---- crab --------------------------------------------------------------------

function buildCrab(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 37 * TILE
  const py = 42.3 * TILE
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

// ---- the net-mender -------------------------------------------------------------

function buildNetMender(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 30 * TILE
  const py = 41.3 * TILE
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

// ---- lighthouse: Beacon of Distant Roads ------------------------------------------

function buildLighthouse(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const L = 50, M = 51, R = 52

  // base: 3 wide, rows 39-40
  ctx.tile(L, 39, 99, 3); ctx.tile(M, 39, 100, 3); ctx.tile(R, 39, 101, 3)
  ctx.tile(L, 40, 108, 3); ctx.tile(M, 40, 86, 3); ctx.tile(R, 40, 110, 3)
  // neck: 1 wide, rows 37-38, with a red band
  ctx.tile(M, 38, 100, 3)
  const band = ctx.tile(M, 37, 100, 3)
  band.setTint(0xd86a5a)
  // lantern room at row 36
  const lx = (M + 0.5) * TILE
  const ly = 36.4 * TILE
  scene.add.rectangle(lx, ly, 26, 18, 0x4a3a28).setStrokeStyle(2, 0x2a1e12).setDepth(4)
  scene.add.circle(lx, ly, 6, 0xffd98a).setDepth(5)
  const glow = scene.add.circle(lx, ly, 16, 0xffc24b, 0.25).setDepth(4)
  scene.add.triangle(lx, ly - 14, 0, 8, 22, 0, 11, -6, 0x8d6436).setDepth(4)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: glow, alpha: 0.08, scale: 1.3, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    // revolving beam
    const beam = scene.add.triangle(lx, ly, 0, 0, 150, -17, 150, 17, 0xffe8b0, 0.14).setOrigin(0).setDepth(4)
    scene.tweens.add({ targets: beam, angle: 360, duration: 7000, repeat: -1 })
  }

  ctx.blockRect(L, 39, 3, 2)
  ctx.block(M, 38)
  ctx.block(M, 37)

  const label = scene.add.text(lx, 41.6 * TILE + 6, 'Beacon of Distant Roads', {
    fontFamily: FONT_BODY, fontSize: '15px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  if (ctx.visitedBuilding('beacon')) {
    scene.add.text(label.x, label.y + 17, '~ returned ~', {
      fontFamily: FONT_BODY, fontSize: '12px', color: '#8a5a2a', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  const hit = scene.add.zone(lx, 38.5 * TILE, 3.4 * TILE, 5.4 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.enterInterior('BeaconOfDistantRoads', 'beacon'))
}

// ---- fishing dock -------------------------------------------------------------------

function buildDock(ctx: WorldCtx): BeachRefs {
  const { scene, TILE } = ctx
  const L = 25, R = 26
  // planks from the sand (row 41) out over the water (row 45)
  for (let r = 41; r <= 45; r++) {
    ctx.tile(L, r, 81, 2)
    ctx.tile(R, r, 81, 2)
    ctx.unblock(L, r)
    ctx.unblock(R, r)
  }
  // posts at the corners
  for (const [c, r] of [[L, 41.2], [R + 0.7, 41.2], [L, 45.6], [R + 0.7, 45.6]] as const) {
    scene.add.rectangle(c * TILE + 5, r * TILE, 5, 10, 0x4a2e14).setDepth(3)
  }
  // standing rod prop at the dock end
  const rx = (R + 0.55) * TILE
  const ry = 44.4 * TILE
  scene.add.line(rx, ry, 0, 0, 10, -26, 0x6e4a26).setLineWidth(2).setOrigin(0).setDepth(3)
  scene.add.circle(rx + 1, ry + 2, 2.5, 0x8a8a92).setDepth(3)

  scene.add.text((L + 1) * TILE, 46.6 * TILE, 'Fishing Dock', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#def0f8', fontStyle: 'italic',
    stroke: '#1a3048', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  const dockRect = new Phaser.Geom.Rectangle(L * TILE - 6, 43.4 * TILE, 2 * TILE + 12, 2.4 * TILE)
  const bobberPoint = { x: (L + 1) * TILE + 44, y: 46.3 * TILE }
  return { dockRect, bobberPoint }
}
