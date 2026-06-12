/**
 * WorldCtx -- the contract region builders get from AetherveilOverworld.
 * Keeps region modules free of scene-class imports (no circular deps).
 */
import type Phaser from 'phaser'

export interface WorldCtx {
  scene: Phaser.Scene
  TILE: number
  COLS: number
  ROWS: number
  reduced: boolean                      // prefers-reduced-motion
  /** place one tiny-town frame at tile coords */
  tile(col: number, row: number, frame: number, depth?: number): Phaser.GameObjects.Image
  /** place one tiny-dungeon frame at tile coords */
  dtile(col: number, row: number, frame: number, depth?: number): Phaser.GameObjects.Image
  /** mark a tile as unwalkable */
  block(col: number, row: number): void
  blockRect(col: number, row: number, w: number, h: number): void
  unblock(col: number, row: number): void
  /** open the shared bottom dialog box */
  showDialog(speaker: string, beats: string[]): void
  /** collectible bookkeeping (saves + HUD + ping); true when newly collected */
  collect(key: string, label: string): boolean
  /** player world position (px) for proximity checks */
  playerPos(): { x: number; y: number }
  /** fade out + enter a building interior scene */
  enterInterior(sceneKey: string, buildingKey: string): void
  /** has the visitor been inside this building before */
  visitedBuilding(buildingKey: string): boolean
  /** freeze/unfreeze the player while a custom modal is up */
  modalOpen(open: boolean): void
}
