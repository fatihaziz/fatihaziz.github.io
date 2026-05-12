/**
 * Phaser game config for Aetherveil.
 * Scenes load in registration order; the first scene is started by Phaser
 * automatically. Building-interior scenes are reachable only via
 * scene.start() from the overworld.
 */
import Phaser from 'phaser'
import Boot from './scenes/Boot'
import AetherveilOverworld from './scenes/AetherveilOverworld'
import AtelierInterior from './scenes/AtelierInterior'
import VaultsOfWhisperleaf from './scenes/VaultsOfWhisperleaf'
import EmbersForge from './scenes/EmbersForge'
import HearthlightInn from './scenes/HearthlightInn'

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1600,
    height: 1000,
    // J.1b enables pixelArt so Tiny Town tiles render with nearest-neighbor
    // scaling (no bilinear blur on scale-2 sprites). Text still renders
    // crisply because each Text uses setResolution(3) which rasterises the
    // glyphs at 3x layout size.
    pixelArt: true,
    antialias: false,
    roundPixels: true,
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
    scene: [Boot, AetherveilOverworld, AtelierInterior, VaultsOfWhisperleaf, EmbersForge, HearthlightInn],
  }
}
