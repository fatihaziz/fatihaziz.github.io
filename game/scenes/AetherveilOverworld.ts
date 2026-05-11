import Phaser from 'phaser'

/**
 * J.0 placeholder for the Aetherveil overworld scene.
 * Renders an elegant title screen confirming Phaser booted, plus any
 * sample assets loaded by Boot. In J.1 this becomes the actual valley
 * tilemap with player + Mayor + buildings.
 *
 * Typography: Cinzel for the title (Roman caps, elven feel),
 * Cormorant Garamond for body (Frieren/Himmel vibe).
 */
const FONT_TITLE = '"Cinzel", "Georgia", serif'
const FONT_BODY = '"Cormorant Garamond", "Georgia", serif'

export default class AetherveilOverworld extends Phaser.Scene {
  constructor() {
    super('AetherveilOverworld')
  }

  create() {
    const w = Number(this.game.config.width)
    const h = Number(this.game.config.height)

    this.cameras.main.setBackgroundColor('#9ec370')

    // Title
    this.add.text(w / 2, h / 2 - 240, 'AETHERVEIL', {
      fontFamily: FONT_TITLE,
      fontSize: '96px',
      color: '#3a2418',
      fontStyle: '700',
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(4)

    this.add.text(w / 2, h / 2 - 150, 'a valley of craftsmen and dreamers', {
      fontFamily: FONT_BODY,
      fontSize: '32px',
      color: '#5a3826',
      fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3)

    // Decorative divider (subtle horizontal rule)
    const dg = this.add.graphics()
    dg.lineStyle(1.5, 0x5a3826, 0.6)
    dg.lineBetween(w / 2 - 200, h / 2 - 110, w / 2 + 200, h / 2 - 110)
    dg.fillStyle(0x5a3826, 0.7)
    dg.fillCircle(w / 2, h / 2 - 110, 3)

    // J.0 status panel
    const heading = this.add.text(w / 2, h / 2 - 70, 'PHASE  J.0  —  FOUNDATION  BOOTED', {
      fontFamily: FONT_TITLE,
      fontSize: '22px',
      color: '#3a2418',
      fontStyle: '600',
    }).setOrigin(0.5).setResolution(3).setLetterSpacing(2)

    const lines = [
      'Phaser 3 mounted at /aetherveil',
      'atlas pipeline ready  ·  scene registry: Boot → AetherveilOverworld',
      '',
      'next /grind:  J.1 — overworld tilemap + Mayor Halden',
    ]
    lines.forEach((line, i) => {
      this.add.text(w / 2, h / 2 - 20 + i * 32, line, {
        fontFamily: FONT_BODY,
        fontSize: '22px',
        color: '#3a2418',
      }).setOrigin(0.5).setResolution(3)
    })

    // Show loaded samples (if any)
    let sx = w / 2 - 80
    if (this.textures.exists('sample-tile')) {
      this.add.image(sx, h / 2 + 200, 'sample-tile').setScale(5)
      this.add.text(sx, h / 2 + 260, 'tile sample', {
        fontFamily: FONT_BODY,
        fontSize: '16px',
        color: '#3a6b3d',
      }).setOrigin(0.5).setResolution(3)
      sx += 160
    }
    if (this.textures.exists('sample-button')) {
      this.add.image(sx, h / 2 + 200, 'sample-button').setScale(2)
      this.add.text(sx, h / 2 + 260, 'ui sample', {
        fontFamily: FONT_BODY,
        fontSize: '16px',
        color: '#3a6b3d',
      }).setOrigin(0.5).setResolution(3)
    }

    // Footer
    this.add.text(w / 2, h - 50, 'Built on Phaser 3  ·  Nuxt 3  ·  Kenney CC0 atlases', {
      fontFamily: FONT_BODY,
      fontSize: '16px',
      color: '#5a3826',
      fontStyle: 'italic',
    }).setOrigin(0.5).setResolution(3)

    // Simple input demo: marker moves with arrow keys / WASD.
    const marker = this.add.circle(w / 2, h - 120, 8, 0x5a3826)
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
    this.add.text(w / 2, h - 88, 'arrow keys / WASD — move the marker', {
      fontFamily: FONT_BODY,
      fontSize: '15px',
      color: '#5a3826',
    }).setOrigin(0.5).setResolution(3)
  }
}
