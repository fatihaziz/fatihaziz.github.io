import Phaser from 'phaser'

/**
 * J.0 Boot scene. Shows a "Loading Aetherveil..." title + progress bar
 * while preloading any registered assets, then transitions to the overworld.
 *
 * Typography: Cinzel for the title (Roman/elven caps), Cormorant Garamond
 * for body text (elegant serif, Frieren/Himmel vibe).
 */
const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    const w = Number(this.game.config.width)
    const h = Number(this.game.config.height)

    // Title
    this.add.text(w / 2, h / 2 - 90, 'AETHERVEIL', {
      fontFamily: FONT_TITLE,
      fontSize: '64px',
      color: '#3a2418',
      fontStyle: '700',
    }).setOrigin(0.5).setResolution(3)

    this.add.text(w / 2, h / 2 - 30, 'preparing the valley...', {
      fontFamily: FONT_BODY,
      fontSize: '24px',
      color: '#5a3826',
      fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3)

    // Progress bar frame
    const frame = this.add.graphics()
    frame.lineStyle(2, 0x5a3826, 1)
    frame.strokeRect(w / 2 - 220, h / 2 + 30, 440, 24)

    const bar = this.add.graphics()
    const pctText = this.add.text(w / 2, h / 2 + 78, '0%', {
      fontFamily: FONT_BODY,
      fontSize: '18px',
      color: '#5a3826',
    }).setOrigin(0.5).setResolution(3)

    this.load.on('progress', (val: number) => {
      bar.clear()
      bar.fillStyle(0xa98758)
      bar.fillRect(w / 2 - 216, h / 2 + 34, 432 * val, 16)
      pctText.setText(`${Math.round(val * 100)}%`)
    })

    // Sample preload — validates atlas pipeline.
    this.load.image('sample-tile', '/atlases/tiny-town/Tiles/tile_0046.png')
    this.load.image('sample-button', '/atlases/ui-pack-rpg/PNG/buttonLong_beige.png')

    // Tiny Town tilemap as 16x16 spritesheet -- main world tiles (132 frames).
    this.load.spritesheet(
      'tiny-town',
      '/atlases/tiny-town/Tilemap/tilemap_packed.png',
      { frameWidth: 16, frameHeight: 16 },
    )

    // Tiny Dungeon tilemap as 16x16 spritesheet -- characters live here.
    // Frame indices of interest:
    //   84 = purple-hat wizard (Mayor Halden)
    //   87 = white-hair elf,  88 = villager
    //   99 = princess-purple, 100 = white-hair elf girl (player, Frieren-coded)
    //   109 = monk-yellow, 112 = green-cap bandit
    this.load.spritesheet(
      'tiny-dungeon',
      '/atlases/tiny-dungeon/Tilemap/tilemap_packed.png',
      { frameWidth: 16, frameHeight: 16 },
    )
  }

  create() {
    // Allow direct-jump to interior scenes via ?scene=atelier for screenshot
    // iteration. Defaults to the overworld for normal play.
    let target = 'AetherveilOverworld'
    try {
      if (typeof window !== 'undefined') {
        const s = new URLSearchParams(window.location.search).get('scene')
        if (s === 'atelier') target = 'AtelierInterior'
        else if (s === 'vaults') target = 'VaultsOfWhisperleaf'
        else if (s === 'forge') target = 'EmbersForge'
        else if (s === 'inn') target = 'HearthlightInn'
      }
    } catch { /* ignore */ }
    this.time.delayedCall(400, () => {
      this.scene.start(target)
    })
  }
}
