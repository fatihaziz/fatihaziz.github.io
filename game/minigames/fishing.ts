/**
 * Fishing minigame (spec B.7.3). Stand on the dock end, SPACE (or click
 * the water) to cast. After 3-6 s the bobber dunks and an alert pops --
 * the visitor has 1.5 s to strike. Weighted catch table, mythic entry
 * feeds the findings list and the Net-Mender's dialog.
 */
import Phaser from 'phaser'
import type { WorldCtx } from '../world/ctx'
import { recordCatch } from '../world/save'
import { sfxSplash, sfxBite, sfxCatch } from '../world/audio'

const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

interface Species {
  key: string
  name: string
  weight: number
  tint: number
  caption: string
}

const SPECIES: Species[] = [
  { key: 'minnow', name: 'a minnow', weight: 32, tint: 0xa8c8d8, caption: 'a tiny minnow. not much, but the line did its work.' },
  { key: 'seaBream', name: 'a sea-bream', weight: 28, tint: 0xd8a8a0, caption: 'a respectable sea-bream. marlowe at the inn will know what to do with it.' },
  { key: 'silverEel', name: 'a silver eel', weight: 18, tint: 0xc8c8d4, caption: 'a silver eel. they say one of these once led a fleet home.' },
  { key: 'ribbonFish', name: 'a ribbon-fish', weight: 12, tint: 0xe8d8f0, caption: 'a ribbon-fish. they unfurl when held to the light.' },
  { key: 'moonMackerel', name: 'a moon-mackerel', weight: 8, tint: 0x9fd8e8, caption: 'a moon-mackerel. rare. worth a second cast another day.' },
  { key: 'keeperOfTheDock', name: 'the keeper of the dock', weight: 2, tint: 0x7a8a9a, caption: 'something old and grey looks up at you. it nods, and slips back beneath. you have its blessing.' },
]

function rollSpecies(): Species {
  const total = SPECIES.reduce((a, s) => a + s.weight, 0)
  let r = Math.random() * total
  for (const s of SPECIES) {
    r -= s.weight
    if (r <= 0) return s
  }
  return SPECIES[0]
}

type FishState = 'idle' | 'waiting' | 'bite'

export class FishingMinigame {
  private state: FishState = 'idle'
  private bobber?: Phaser.GameObjects.Arc
  private lineG?: Phaser.GameObjects.Graphics
  private exclaim?: Phaser.GameObjects.Text
  private biteTimer?: Phaser.Time.TimerEvent
  private windowTimer?: Phaser.Time.TimerEvent
  private bobTween?: Phaser.Tweens.Tween

  constructor(
    private ctx: WorldCtx,
    private dockRect: Phaser.Geom.Rectangle,
    private bobberPoint: { x: number; y: number },
  ) {}

  get active(): boolean {
    return this.state !== 'idle'
  }

  playerAtDock(): boolean {
    const p = this.ctx.playerPos()
    return Phaser.Geom.Rectangle.Contains(this.dockRect, p.x, p.y)
  }

  /** SPACE / click while standing at the dock end */
  start(): void {
    if (this.state !== 'idle') return
    const { scene } = this.ctx
    this.state = 'waiting'
    sfxSplash()

    this.bobber = scene.add.circle(this.bobberPoint.x, this.bobberPoint.y, 5, 0xd95763)
      .setStrokeStyle(1.5, 0xf0e6c8).setDepth(6)
    this.lineG = scene.add.graphics().setDepth(5)
    this.redrawLine()

    this.bobTween = scene.tweens.add({
      targets: this.bobber, y: this.bobberPoint.y + 3,
      duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    })

    const wait = 3000 + Math.random() * 3000
    this.biteTimer = scene.time.delayedCall(wait, () => this.bite())
  }

  private redrawLine(): void {
    if (!this.lineG || !this.bobber) return
    const p = this.ctx.playerPos()
    this.lineG.clear()
    this.lineG.lineStyle(1, 0xe8e0c8, 0.8)
    this.lineG.lineBetween(p.x + 8, p.y - 6, this.bobber.x, this.bobber.y - 3)
  }

  private bite(): void {
    if (this.state !== 'waiting') return
    const { scene } = this.ctx
    this.state = 'bite'
    sfxBite()
    // bobber dunks
    this.bobTween?.remove()
    if (this.bobber) {
      scene.tweens.add({ targets: this.bobber, y: this.bobberPoint.y + 9, duration: 110, yoyo: true, repeat: 3 })
    }
    const p = this.ctx.playerPos()
    this.exclaim = scene.add.text(p.x, p.y - 44, '!', {
      fontFamily: FONT_BODY, fontSize: '34px', color: '#ffc24b', fontStyle: '700',
      stroke: '#3a2418', strokeThickness: 5,
    }).setOrigin(0.5).setResolution(3).setDepth(7)
    scene.tweens.add({ targets: this.exclaim, y: p.y - 56, duration: 140, ease: 'Back.easeOut' })

    this.windowTimer = scene.time.delayedCall(1500, () => this.fail())
  }

  /** SPACE / click during play */
  onAction(): void {
    if (this.state === 'waiting') {
      // reeled in too early
      this.cleanup()
      this.ctx.showDialog('The Dock', ['nothing yet. the fish reward the unhurried.'])
    } else if (this.state === 'bite') {
      this.success()
    }
  }

  cancel(): void {
    if (this.state === 'idle') return
    this.cleanup()
  }

  private success(): void {
    const { scene } = this.ctx
    const s = rollSpecies()
    this.cleanup()
    sfxCatch()
    recordCatch(s.key)

    // catch sprite pops above the player and fades
    const p = this.ctx.playerPos()
    const fish = scene.add.image(p.x, p.y - 30, 'tiny-dungeon', 124)
      .setScale(2.2).setTint(s.tint).setDepth(7)
    scene.tweens.add({
      targets: fish, y: p.y - 64, alpha: 0, angle: 24,
      duration: 1500, ease: 'Sine.easeOut',
      onComplete: () => fish.destroy(),
    })

    const beats = [s.caption]
    if (s.key === 'keeperOfTheDock') {
      this.ctx.collect('fish.mythic', 'the blessing of the dock-keeper')
      beats.push('the net-mender on the shore would want to hear of this.')
    }
    this.ctx.showDialog('Caught: ' + s.name, beats)
  }

  private fail(): void {
    if (this.state !== 'bite') return
    this.cleanup()
    this.ctx.showDialog('The Dock', ['the line goes slack. the fish thought better of it. try again.'])
  }

  private cleanup(): void {
    this.state = 'idle'
    this.biteTimer?.remove()
    this.windowTimer?.remove()
    this.bobTween?.remove()
    this.bobber?.destroy()
    this.lineG?.destroy()
    this.exclaim?.destroy()
    this.bobber = undefined
    this.lineG = undefined
    this.exclaim = undefined
  }

  update(): void {
    if (this.state !== 'idle') this.redrawLine()
  }
}
