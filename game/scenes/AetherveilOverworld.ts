import Phaser from 'phaser'

/**
 * J.0 placeholder for the Aetherveil overworld scene.
 * Renders a stylised title screen confirming Phaser booted, plus any
 * sample assets loaded by Boot. In J.1 this becomes the actual valley
 * tilemap with player + Mayor + buildings.
 */
export default class AetherveilOverworld extends Phaser.Scene {
  constructor() {
    super('AetherveilOverworld')
  }

  create() {
    const w = Number(this.game.config.width)
    const h = Number(this.game.config.height)

    this.cameras.main.setBackgroundColor('#9ec370')

    // Title
    this.add.text(w / 2, h / 2 - 200, 'AETHERVEIL', {
      fontFamily: 'monospace',
      fontSize: '88px',
      color: '#3a2418',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(w / 2, h / 2 - 130, 'a valley of craftsmen and dreamers', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#5a3826',
      fontStyle: 'italic',
    }).setOrigin(0.5)

    // J.0 status panel
    const lines = [
      'Phase J.0 -- foundation booted',
      '',
      'Phaser 3 mounted at /aetherveil',
      'atlas pipeline ready',
      'scene registry: Boot -> AetherveilOverworld',
      '',
      'next /grind: J.1 (overworld tilemap + Mayor Halden)',
    ]
    lines.forEach((line, i) => {
      this.add.text(w / 2, h / 2 - 30 + i * 26, line, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#3a2418',
      }).setOrigin(0.5)
    })

    // Show loaded samples (if any)
    let sx = w / 2 - 80
    if (this.textures.exists('sample-tile')) {
      this.add.image(sx, h / 2 + 200, 'sample-tile').setScale(5)
      this.add.text(sx, h / 2 + 260, 'tile sample', {
        fontFamily: 'monospace', fontSize: '12px', color: '#3a6b3d',
      }).setOrigin(0.5)
      sx += 160
    }
    if (this.textures.exists('sample-button')) {
      this.add.image(sx, h / 2 + 200, 'sample-button').setScale(2)
      this.add.text(sx, h / 2 + 260, 'ui sample', {
        fontFamily: 'monospace', fontSize: '12px', color: '#3a6b3d',
      }).setOrigin(0.5)
    }

    // Footer
    this.add.text(w / 2, h - 40, 'built on Phaser 3 + Nuxt 3 + Kenney CC0',
      { fontFamily: 'monospace', fontSize: '12px', color: '#5a3826' }
    ).setOrigin(0.5)

    // Simple input demo: ARROW keys / WASD move a marker around to prove
    // the input pipeline works for J.1.
    const marker = this.add.circle(w / 2, h - 100, 8, 0x5a3826)
    const cursors = this.input.keyboard?.createCursorKeys()
    const wasd = this.input.keyboard?.addKeys('W,A,S,D') as Record<string, Phaser.Input.Keyboard.Key>
    this.events.on('update', () => {
      if (!cursors) return
      const speed = 4
      if (cursors.left.isDown || wasd?.A?.isDown) marker.x -= speed
      if (cursors.right.isDown || wasd?.D?.isDown) marker.x += speed
      if (cursors.up.isDown || wasd?.W?.isDown) marker.y -= speed
      if (cursors.down.isDown || wasd?.S?.isDown) marker.y += speed
    })
    this.add.text(w / 2, h - 70, 'arrow keys / WASD move the dot above', {
      fontFamily: 'monospace', fontSize: '11px', color: '#5a3826',
    }).setOrigin(0.5)
  }
}
