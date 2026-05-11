import Phaser from 'phaser'

/**
 * J.0 Boot scene. Shows a "Loading Aetherveil..." text and a progress bar
 * while preloading any registered assets, then transitions to the overworld.
 *
 * In J.0 we register a few sample Kenney atlases just to validate the
 * pipeline; the full tilemap arrives in J.1.
 */
export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    const w = Number(this.game.config.width)
    const h = Number(this.game.config.height)

    // Title
    this.add.text(w / 2, h / 2 - 80, 'AETHERVEIL', {
      fontFamily: 'monospace',
      fontSize: '56px',
      color: '#3a2418',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(w / 2, h / 2 - 30, 'preparing the valley...', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#5a3826',
    }).setOrigin(0.5)

    // Progress bar frame
    const frame = this.add.graphics()
    frame.lineStyle(2, 0x5a3826, 1)
    frame.strokeRect(w / 2 - 220, h / 2 + 20, 440, 28)

    const bar = this.add.graphics()
    const pctText = this.add.text(w / 2, h / 2 + 70, '0%', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#5a3826',
    }).setOrigin(0.5)

    this.load.on('progress', (val: number) => {
      bar.clear()
      bar.fillStyle(0xa98758)
      bar.fillRect(w / 2 - 216, h / 2 + 24, 432 * val, 20)
      pctText.setText(`${Math.round(val * 100)}%`)
    })

    // Sample preload — one tile from Tiny Town to validate atlas pipeline.
    // If the file is missing the scene still boots; we just show a warning.
    this.load.image(
      'sample-tile',
      '/atlases/tiny-town/Tiles/tile_0046.png'
    )

    // Also load Tiny Town's packed tilemap (used for tilemap rendering in J.1)
    this.load.image(
      'tiny-town-tilemap',
      '/atlases/tiny-town/Tilemap/tilemap_packed.png'
    )

    // UI pack sample
    this.load.image(
      'sample-button',
      '/atlases/ui-pack-rpg/PNG/buttonLong_beige.png'
    )
  }

  create() {
    this.time.delayedCall(400, () => {
      this.scene.start('AetherveilOverworld')
    })
  }
}
