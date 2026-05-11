/**
 * Phaser game config for Aetherveil.
 * Imports scenes registered in load order: Boot -> AetherveilOverworld.
 */
import Phaser from 'phaser'
import Boot from './scenes/Boot'
import AetherveilOverworld from './scenes/AetherveilOverworld'

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1600,
    height: 1000,
    // J.0 text-heavy title screen wants smooth antialiased fonts. We'll
    // re-enable pixelArt in J.1 when the tilemap arrives and use
    // BitmapText / DOM-overlay for crisp typography.
    pixelArt: false,
    antialias: true,
    roundPixels: false,
    backgroundColor: '#9ec370',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [Boot, AetherveilOverworld],
  }
}
