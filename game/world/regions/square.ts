/**
 * Town Square + the south front -- the walled plaza from the design map:
 * bell tower, bazaar stalls, the well, Mayor Halden; then the Hearthlight
 * Inn (portfolio: the road's chapters), the Great Gate through the south
 * wall, the windmill by the spawn crossroads, the signpost, and the
 * lantern posts. Returns the lantern glows for the sunset system.
 */
import type Phaser from 'phaser'
import type { WorldCtx } from '../ctx'
import { sfxChime } from '../audio'

const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export interface SquareRefs {
  lanternGlows: Phaser.GameObjects.Arc[]
}

export function buildSquare(ctx: WorldCtx): SquareRefs {
  buildPlaza(ctx)
  buildBellTower(ctx)
  buildStalls(ctx)
  buildWell(ctx)
  buildMayor(ctx)
  buildInn(ctx)
  buildGreatGate(ctx)
  buildWindmill(ctx)
  buildSignpost(ctx)
  return { lanternGlows: buildLanterns(ctx) }
}

// ---- plaza pavement ---------------------------------------------------------------

function buildPlaza(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  for (let r = 28; r <= 37; r++) {
    for (let c = 27; c <= 39; c++) {
      ctx.tile(c, r, 43, 1)
    }
  }
  scene.add.text(33 * TILE, 32.5 * TILE, 'TOWN SQUARE', {
    fontFamily: FONT_TITLE, fontSize: '18px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)
}

// ---- bell tower ---------------------------------------------------------------------

function buildBellTower(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 31                       // cols 31-33
  const top = 27

  ctx.tile(cx + 1, top - 1, 67, 5).setTint(0xc25b4a)
  for (let i = 0; i < 3; i++) {
    ctx.tile(cx + i, top, i === 0 ? 96 : i === 2 ? 98 : 97, 4)
    ctx.tile(cx + i, top + 1, i === 0 ? 99 : i === 2 ? 101 : 100, 4)
    ctx.tile(cx + i, top + 2, i === 0 ? 99 : i === 2 ? 101 : 100, 4)
    ctx.tile(cx + i, top + 3, i === 0 ? 108 : i === 2 ? 110 : 109, 4)
  }
  ctx.blockRect(cx, top, 3, 4)

  // the bell, hanging in the open band
  const bx = (cx + 1.5) * TILE
  const by = (top + 1.45) * TILE
  scene.add.rectangle(bx, by - 11, 16, 4, 0x4a3a28).setDepth(5)
  const bell = scene.add.triangle(bx, by, -8, 8, 8, 8, 0, -8, 0xd8b04a).setStrokeStyle(2, 0x8a6a1e).setDepth(5)
  scene.add.circle(bx, by + 9, 2.5, 0x6a4a16).setDepth(5)

  scene.add.text(bx, (top + 4) * TILE + 6, 'Bell Tower', {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  const hit = scene.add.zone(bx, (top + 1.5) * TILE, 3 * TILE, 4 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => {
    sfxChime()
    if (!ctx.reduced) {
      scene.tweens.add({
        targets: bell, angle: { from: -14, to: 14 },
        duration: 260, yoyo: true, repeat: 3,
        onComplete: () => bell.setAngle(0),
      })
    }
    ctx.showDialog('The Bell Tower', ['the bell rings the hours, and once -- years ago -- something else. nobody talks about the something else.'])
  })
}

// ---- bazaar stalls ---------------------------------------------------------------------

interface StallDef {
  col: number
  row: number
  name: string
  keeperFrame: number
  line: string
  drawItem(g: Phaser.GameObjects.Graphics, px: number, py: number): void
}

function buildStalls(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const stalls: StallDef[] = [
    {
      col: 37, row: 30, name: 'Whisperleaf Seeds', keeperFrame: 88,
      line: 'these seeds grow what you tend them with. the keeper smiles knowingly.',
      drawItem(g, px, py) {
        // three glass jars with glowing seeds
        for (let i = -1; i <= 1; i++) {
          g.fillStyle(0xcfe8ef, 0.55)
          g.fillRoundedRect(px + i * 13 - 5, py - 12, 10, 13, 2)
          g.fillStyle(0x9fe07a, 1)
          g.fillCircle(px + i * 13, py - 5, 2.2)
          g.fillStyle(0xd6ff9e, 1)
          g.fillCircle(px + i * 13 - 2, py - 8, 1.4)
        }
      },
    },
    {
      col: 37, row: 34.5, name: 'Soft Crystals', keeperFrame: 109,
      line: 'the crystal hums at your approach. it remembers attention.',
      drawItem(g, px, py) {
        const pts: [number, number, number, number][] = [[-8, 0x9b8df2, 8, 5], [2, 0xc3b9ff, 10, 6], [10, 0x7a6ae0, 7, 4]]
        for (const [dx, color, h, w] of pts) {
          g.fillStyle(color, 0.95)
          g.fillTriangle(px + dx - w / 2, py - 2, px + dx + w / 2, py - 2, px + dx, py - 2 - h)
        }
        g.fillStyle(0xffffff, 0.5)
        g.fillCircle(px + 2, py - 7, 1.4)
      },
    },
  ]

  scene.add.text(37 * TILE + TILE / 2, 28.3 * TILE, 'Bazaar', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  for (const s of stalls) {
    const px = s.col * TILE + TILE / 2
    const py = s.row * TILE + TILE / 2
    // counter: two wooden plank tiles side by side
    ctx.tile(s.col - 0.5, s.row, 81, 3)
    ctx.tile(s.col + 0.5, s.row, 81, 3)
    // awning: small striped roof floating above
    scene.add.rectangle(px, py - 26, TILE * 2.1, 10, 0xc25b4a)
      .setStrokeStyle(1, 0x6e2e24).setDepth(4)
    scene.add.rectangle(px, py - 21, TILE * 2.1, 3, 0xe8e0c8).setDepth(4)
    // legs
    scene.add.rectangle(px - TILE * 0.9, py - 8, 3, 28, 0x6e4a26).setDepth(3)
    scene.add.rectangle(px + TILE * 0.9, py - 8, 3, 28, 0x6e4a26).setDepth(3)
    // display item
    const g = scene.add.graphics().setDepth(4)
    s.drawItem(g, px, py - 2)
    // silent keeper behind the counter (waves on click)
    const keeper = ctx.dtile(s.col, s.row - 1, s.keeperFrame, 4)
    keeper.setOrigin(0.5, 0.6).setPosition(px, py - TILE * 0.9)
    // label
    scene.add.text(px, py + 16, s.name, {
      fontFamily: FONT_BODY, fontSize: '13px', color: '#3a2418', fontStyle: '500',
    }).setOrigin(0.5).setResolution(3).setDepth(5)

    ctx.block(s.col, s.row)
    ctx.block(s.col - 1, s.row)
    ctx.block(s.col + 1, s.row)

    const hit = scene.add.zone(px, py - 10, TILE * 2.2, TILE * 2)
      .setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () => {
      if (!ctx.reduced) {
        ctx.scene.tweens.add({
          targets: keeper, angle: { from: -8, to: 8 },
          duration: 160, yoyo: true, repeat: 2,
          onComplete: () => keeper.setAngle(0),
        })
      }
      ctx.showDialog(s.name, [s.line])
    })
  }
}

// ---- the well -----------------------------------------------------------------------

function buildWell(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 30.5 * TILE
  const py = 36 * TILE

  scene.add.circle(px, py, 16, 0x8d8d95).setStrokeStyle(3, 0x55555e).setDepth(3)
  scene.add.circle(px, py, 9, 0x2c4a74).setDepth(3)
  // crossbar + bucket
  scene.add.rectangle(px - 14, py - 8, 3, 22, 0x6e4a26).setDepth(4)
  scene.add.rectangle(px + 14, py - 8, 3, 22, 0x6e4a26).setDepth(4)
  scene.add.rectangle(px, py - 18, 34, 4, 0x8a5a30).setDepth(4)
  scene.add.line(px, py - 16, 0, 0, 0, 10, 0x4a3a28).setLineWidth(1.5).setOrigin(0).setDepth(4)
  scene.add.rectangle(px, py - 4, 8, 6, 0x6e4a26).setStrokeStyle(1, 0x4a2e14).setDepth(4)

  ctx.block(30, 36)
  ctx.block(31, 36)

  const hit = scene.add.zone(px, py, 44, 40).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () =>
    ctx.showDialog('The Well', ['a copper coin rests at the bottom. you decide not to disturb it.']))
}

// ---- Mayor Halden ----------------------------------------------------------------------

function buildMayor(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const px = 28.5 * TILE
  const py = 33 * TILE
  scene.add.ellipse(px, py + 26, 32, 9, 0x000000, 0.30).setDepth(5)
  const mayor = scene.add.sprite(px, py, 'tiny-dungeon', 84).setScale(3).setDepth(6)
  if (!ctx.reduced) {
    scene.tweens.add({
      targets: mayor, y: py - 3,
      duration: 1400, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    })
  }
  const hit = scene.add.zone(px, py, 52, 56).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => (scene as any).openMayorDialog())
  scene.add.text(px, py - 36, 'Mayor Halden', {
    fontFamily: FONT_BODY, fontSize: '15px', color: '#f5e5c5', fontStyle: '600',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setDepth(7)
}

// ---- Hearthlight Inn (portfolio: the road's chapters) -----------------------------------

function buildInn(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const cx = 25                       // cols 25-32
  const cy = 41                       // roof row

  const W = 8
  for (let i = 0; i < W; i++) {
    ctx.tile(cx + i, cy, i === 0 ? 64 : i === W - 1 ? 66 : 65, 3)
    let f: number
    if (i === 2) f = 55
    else if (i === 0) f = 52
    else if (i === W - 1) f = 54
    else f = 52
    ctx.tile(cx + i, cy + 1, f, 3)
  }
  ctx.tile(cx + 2, cy - 1, 67, 4)
  ctx.tile(cx + 5, cy - 1, 67, 4)
  ctx.blockRect(cx, cy, W, 2)

  // hanging INN sign
  const sx = (cx - 0.3) * TILE
  const sy = (cy + 0.9) * TILE
  scene.add.rectangle(sx, sy - 10, 3, 14, 0x4a3a28).setDepth(4)
  scene.add.rectangle(sx, sy, 26, 14, 0xe8dcc0).setStrokeStyle(1, 0x6e4a26).setDepth(4)
  scene.add.text(sx, sy, 'INN', {
    fontFamily: FONT_TITLE, fontSize: '9px', color: '#3a2418', fontStyle: '700',
  }).setOrigin(0.5).setResolution(4).setDepth(5)

  const px = (cx + W / 2) * TILE
  scene.add.text(px, (cy + 2) * TILE + 8, 'HEARTHLIGHT INN', {
    fontFamily: FONT_TITLE, fontSize: '16px', color: '#3a2418', fontStyle: '600',
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  scene.add.text(px, (cy + 2) * TILE + 26, "the road's chapters", {
    fontFamily: FONT_BODY, fontSize: '13px', color: '#6a4a2a', fontStyle: 'italic',
  }).setOrigin(0.5).setResolution(3).setDepth(5)
  if (ctx.visitedBuilding('inn')) {
    scene.add.text(px, (cy + 2) * TILE + 42, '~ returned ~', {
      fontFamily: FONT_BODY, fontSize: '12px', color: '#8a5a2a', fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3).setDepth(5)
  }

  const hit = scene.add.zone(px, (cy + 1) * TILE, W * TILE, 2 * TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.enterInterior('HearthlightInn', 'inn'))
}

// ---- the Great Gate ----------------------------------------------------------------------

function buildGreatGate(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // the south wall leaves cols 29-32 open; the gate dresses the opening
  for (const c of [29, 30, 31, 32]) {
    ctx.tile(c, 47, 75, 3)
  }
  ctx.tile(28, 46, 97, 3); ctx.block(28, 46)
  ctx.tile(33, 46, 97, 3); ctx.block(33, 46)

  scene.add.text(30.5 * TILE + TILE / 2, 48.6 * TILE + 6, 'GREAT GATE', {
    fontFamily: FONT_TITLE, fontSize: '14px', color: '#f5e5c5', fontStyle: '600',
    stroke: '#3a2418', strokeThickness: 4,
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(2).setDepth(5)
}

// ---- the windmill -----------------------------------------------------------------------

function buildWindmill(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const baseCol = 37                  // cols 37-39
  const baseRow = 41
  ctx.tile(baseCol, baseRow, 99, 3); ctx.tile(baseCol + 1, baseRow, 100, 3); ctx.tile(baseCol + 2, baseRow, 101, 3)
  ctx.tile(baseCol, baseRow + 1, 99, 3); ctx.tile(baseCol + 1, baseRow + 1, 100, 3); ctx.tile(baseCol + 2, baseRow + 1, 101, 3)
  ctx.tile(baseCol, baseRow + 2, 108, 3); ctx.tile(baseCol + 1, baseRow + 2, 86, 3); ctx.tile(baseCol + 2, baseRow + 2, 110, 3)
  ctx.blockRect(baseCol, baseRow, 3, 3)

  // rotating blades -- 4 elongated triangles in a container above the tower
  const hubX = (baseCol + 1.5) * TILE
  const hubY = baseRow * TILE - 6
  const blades = scene.add.container(hubX, hubY).setDepth(4)
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    const blade = scene.add.triangle(
      0, 0,
      0, 0,
      Math.cos(a) * 44 + Math.cos(a + Math.PI / 2) * 7, Math.sin(a) * 44 + Math.sin(a + Math.PI / 2) * 7,
      Math.cos(a) * 44 - Math.cos(a + Math.PI / 2) * 7, Math.sin(a) * 44 - Math.sin(a + Math.PI / 2) * 7,
      0xe8dcc0,
    ).setStrokeStyle(1, 0x6e5a3a).setOrigin(0)
    blades.add(blade)
  }
  scene.add.circle(hubX, hubY, 4, 0x4a2e14).setDepth(5)
  if (!ctx.reduced) {
    scene.tweens.add({ targets: blades, angle: 360, duration: 9000, repeat: -1 })
  }

  scene.add.text(hubX, (baseRow + 3) * TILE + 4, 'The Windmill', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  const doorHit = scene.add.zone((baseCol + 1.5) * TILE, (baseRow + 2.5) * TILE, TILE, TILE)
    .setInteractive({ useHandCursor: true })
  doorHit.on('pointerdown', () =>
    ctx.showDialog('The Windmill', ['the miller is asleep. flour dust drifts in shafts of light.']))
  const bladeHit = scene.add.zone(hubX, hubY, 96, 60).setInteractive({ useHandCursor: true })
  bladeHit.on('pointerdown', () =>
    ctx.showDialog('The Windmill', ['round and round, like the stories inside.']))
}

// ---- signpost at the crossroads -------------------------------------------------------------

function buildSignpost(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const col = 43
  const row = 36.6
  ctx.tile(col, row, 83, 3)
  ctx.block(43, 37)
  scene.add.text((col + 0.5) * TILE, (row - 0.5) * TILE, 'AETHERVEIL', {
    fontFamily: FONT_TITLE, fontSize: '12px', color: '#f5e5c5', fontStyle: '600',
    stroke: '#3a2418', strokeThickness: 3,
  }).setOrigin(0.5).setResolution(3).setLetterSpacing(1).setDepth(5)
  const hit = scene.add.zone((col + 0.5) * TILE, (row + 0.5) * TILE, TILE, TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () =>
    ctx.showDialog('Signpost', ['AETHERVEIL -- pop. quiet, mostly.\nnorth: the wall, the hill, the falls. south: the shore.']))
}

// ---- lantern posts ----------------------------------------------------------------------

function buildLanterns(ctx: WorldCtx): Phaser.GameObjects.Arc[] {
  const { scene, TILE } = ctx
  const posts: [number, number][] = [[27, 28.6], [39, 28.6], [27, 37.4], [34, 41.5], [44, 40.5]]
  const glows: Phaser.GameObjects.Arc[] = []
  for (const [c, r] of posts) {
    const px = c * TILE + TILE / 2
    const py = r * TILE + TILE / 2
    scene.add.rectangle(px, py + 6, 3, 26, 0x3a2e22).setDepth(3)
    scene.add.rectangle(px, py - 8, 10, 12, 0x4a3a28).setStrokeStyle(1, 0x2a1e12).setDepth(3)
    scene.add.circle(px, py - 8, 3.2, 0xffd98a, 0.95).setDepth(4)
    const glow = scene.add.circle(px, py - 8, 14, 0xffc24b, 0.10).setDepth(4)
    glows.push(glow)
    const hit = scene.add.zone(px, py, 24, 44).setInteractive({ useHandCursor: true })
    hit.on('pointerdown', () =>
      ctx.showDialog('Lantern Post', ['the lantern keeper knows when to come.']))
  }
  return glows
}
