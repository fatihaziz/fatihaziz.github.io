/**
 * Town Square extras -- three market stalls with silent keepers, the Quest
 * Board ("Current Vigils"), the windmill south of the wall, lantern posts,
 * and the spawn signpost. Returns the lantern glow discs so the overworld
 * can brighten them when the sunset overlay rises.
 */
import type Phaser from 'phaser'
import type { WorldCtx } from '../ctx'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

// Hand-curated vigils feed (spec K.4 default). RPG-phrased; refresh by hand.
const VIGILS = [
  'PINNED -- tending the fires at TurnkeyID. the kettle stays on.',
  '[scroll] taught a gate to wait, and try again, before turning a traveler away.',
  '[scroll] raised a small lantern-hall where two hands write one story.',
  '[scroll] re-drew the valley itself -- every road now remembers its name.',
  '[scroll] swept the deep archives. the scrolls breathe easier for it.',
  'the board is dusted weekly. check back, traveler.',
]

interface StallDef {
  col: number
  row: number
  name: string
  keeperFrame: number
  line: string
  drawItem(g: Phaser.GameObjects.Graphics, px: number, py: number): void
}

export interface SquareRefs {
  lanternGlows: Phaser.GameObjects.Arc[]
}

export function buildSquare(ctx: WorldCtx): SquareRefs {
  buildStalls(ctx)
  buildQuestBoard(ctx)
  buildWindmill(ctx)
  buildSignpost(ctx)
  const lanternGlows = buildLanterns(ctx)
  return { lanternGlows }
}

// ---- market stalls ----------------------------------------------------------

function buildStalls(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const stalls: StallDef[] = [
    {
      col: 21, row: 15, name: 'Whisperleaf Seeds', keeperFrame: 88,
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
      col: 21, row: 21, name: 'Threaded Charms', keeperFrame: 97,
      line: 'a child traveled far to gather these. each is a knot of intent.',
      drawItem(g, px, py) {
        // a basket of bracelets
        g.fillStyle(0xa97a3e, 1)
        g.fillEllipse(px, py - 5, 30, 12)
        g.fillStyle(0x7a5226, 1)
        g.fillEllipse(px, py - 7, 26, 8)
        const colors = [0xd95763, 0x6abe30, 0x5b6ee1, 0xf7d36b]
        colors.forEach((c, i) => {
          g.lineStyle(1.6, c, 1)
          g.strokeCircle(px - 9 + i * 6, py - 8, 3)
        })
      },
    },
    {
      col: 28, row: 21, name: 'Soft Crystals', keeperFrame: 109,
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

  for (const s of stalls) {
    const px = s.col * TILE + TILE / 2
    const py = s.row * TILE + TILE / 2
    // counter: two wooden plank tiles side by side
    ctx.tile(s.col - 0.5, s.row, 81, 3)
    ctx.tile(s.col + 0.5, s.row, 81, 3)
    // awning: small red roof strip floating above
    const awn = scene.add.rectangle(px, py - 26, TILE * 2.1, 10, 0xc25b4a)
      .setStrokeStyle(1, 0x6e2e24).setDepth(4)
    scene.add.rectangle(px, py - 21, TILE * 2.1, 3, 0xe8e0c8).setDepth(4)
    // legs
    scene.add.rectangle(px - TILE * 0.9, py - 8, 3, 28, 0x6e4a26).setDepth(3)
    scene.add.rectangle(px + TILE * 0.9, py - 8, 3, 28, 0x6e4a26).setDepth(3)
    void awn
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

// ---- quest board --------------------------------------------------------------

function buildQuestBoard(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const col = 22.5
  const row = 13.6
  const px = col * TILE
  const py = row * TILE

  // posts + board + tiny roof shelter
  scene.add.rectangle(px - 26, py + 14, 4, 30, 0x5a3a1c).setDepth(3)
  scene.add.rectangle(px + 26, py + 14, 4, 30, 0x5a3a1c).setDepth(3)
  scene.add.rectangle(px, py, 64, 36, 0x7a5226).setStrokeStyle(2, 0x4a2e14).setDepth(3)
  scene.add.rectangle(px, py - 22, 76, 8, 0x8d6436).setStrokeStyle(1, 0x4a2e14).setDepth(4)
  // pinned papers
  for (const [dx, dy, w, h] of [[-18, -4, 14, 16], [2, -6, 16, 12], [16, 2, 12, 14], [-4, 8, 14, 10]] as const) {
    scene.add.rectangle(px + dx, py + dy, w, h, 0xf0e6c8).setStrokeStyle(1, 0xb8a87e).setDepth(4)
  }
  scene.add.text(px, py + 30, 'Quest Board', {
    fontFamily: FONT_BODY, fontSize: '14px', color: '#3a2418', fontStyle: '500',
  }).setOrigin(0.5).setResolution(3).setDepth(5)

  ctx.block(Math.floor(col - 1), Math.round(row))
  ctx.block(Math.floor(col), Math.round(row))
  ctx.block(Math.floor(col + 1), Math.round(row))

  const hit = scene.add.zone(px, py + 4, 80, 56).setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () => ctx.showDialog('Current Vigils', VIGILS))
}

// ---- windmill -----------------------------------------------------------------

function buildWindmill(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  // Stone tower south of the wall, east of the southgate path: cols 32-34.
  const baseCol = 32
  const baseRow = 34
  // tapered stone tower (3 rows): use tiny-town stone wall band frames
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

  // miller's door (click) + blades (click)
  const doorHit = scene.add.zone((baseCol + 1.5) * TILE, (baseRow + 2.5) * TILE, TILE, TILE)
    .setInteractive({ useHandCursor: true })
  doorHit.on('pointerdown', () =>
    ctx.showDialog('The Windmill', ['the miller is asleep. flour dust drifts in shafts of light.']))
  const bladeHit = scene.add.zone(hubX, hubY, 96, 60).setInteractive({ useHandCursor: true })
  bladeHit.on('pointerdown', () =>
    ctx.showDialog('The Windmill', ['round and round, like the stories inside.']))
}

// ---- signpost at spawn ----------------------------------------------------------

function buildSignpost(ctx: WorldCtx): void {
  const { scene, TILE } = ctx
  const col = 27
  const row = 38
  ctx.tile(col, row, 83, 3)
  ctx.block(col, row)
  const hit = scene.add.zone(col * TILE + TILE / 2, row * TILE + TILE / 2, TILE, TILE)
    .setInteractive({ useHandCursor: true })
  hit.on('pointerdown', () =>
    ctx.showDialog('Signpost', ['AETHERVEIL -- pop. quiet, mostly.']))
}

// ---- lantern posts ---------------------------------------------------------------

function buildLanterns(ctx: WorldCtx): Phaser.GameObjects.Arc[] {
  const { scene, TILE } = ctx
  const posts: [number, number][] = [[20, 14], [29, 14], [20, 22], [29, 22], [23, 34]]
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
