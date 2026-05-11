/**
 * Static config for the 5 building routes.
 * Per spec §C and §D.4 (click-to-enter waypoints).
 */

export interface CameraWaypoint {
  pos: [number, number, number]
  look: [number, number, number]
  fov?: number
}

export interface SceneRoute {
  id: 'workbench' | 'armory' | 'codex' | 'hearth' | 'beacon'
  route: string
  label: string
  blurb: string
  position: [number, number, number]
  entryWaypoint: CameraWaypoint
}

const sceneRoutes: SceneRoute[] = [
  {
    id: 'workbench',
    route: '/workbench',
    label: 'Workbench',
    blurb: 'Projects',
    position: [-20, 0, -10],
    entryWaypoint: { pos: [-22, 4, -4], look: [-20, 2, -10], fov: 50 },
  },
  {
    id: 'armory',
    route: '/armory',
    label: 'Armory',
    blurb: 'Skills',
    position: [10, 0, -20],
    entryWaypoint: { pos: [10, 4, -14], look: [10, 2, -20], fov: 50 },
  },
  {
    id: 'codex',
    route: '/codex',
    label: 'Codex',
    blurb: 'Writings',
    position: [22, 0, 0],
    entryWaypoint: { pos: [22, 4, 6], look: [22, 2, 0], fov: 50 },
  },
  {
    id: 'hearth',
    route: '/hearth',
    label: 'Hearth',
    blurb: 'About',
    position: [5, 0, 15],
    entryWaypoint: { pos: [5, 4, 21], look: [5, 2, 15], fov: 50 },
  },
  {
    id: 'beacon',
    route: '/beacon',
    label: 'Beacon',
    blurb: 'Contact',
    position: [-15, 0, 12],
    entryWaypoint: { pos: [-15, 4, 18], look: [-15, 8, 12], fov: 50 },
  },
]

export const HERO_HOME: CameraWaypoint = {
  pos: [40, 30, 50],
  look: [0, 5, 0],
  fov: 50,
}

export function useSceneRoutes() {
  return {
    scenes: sceneRoutes,
    heroHome: HERO_HOME,
    findByRoute(path: string) {
      return sceneRoutes.find((s) => s.route === path)
    },
  }
}
