/**
 * Cinematic on-rails camera per spec §D.
 * Catmull-Rom position spline + SLERP look-at orientation.
 * Single shared instance via module-scope refs.
 */
import { ref, shallowRef } from 'vue'
import {
  CatmullRomCurve3,
  Quaternion,
  Vector3,
  type PerspectiveCamera,
} from 'three'
import type { CameraWaypoint } from './useSceneRoutes'

const camera = shallowRef<PerspectiveCamera | null>(null)
const waypoints = ref<CameraWaypoint[]>([])
const isFlying = ref(false)

let positionCurve: CatmullRomCurve3 | null = null
let lookCurve: CatmullRomCurve3 | null = null

function rebuildCurves() {
  if (waypoints.value.length < 2) {
    positionCurve = null
    lookCurve = null
    return
  }
  const positions = waypoints.value.map(
    (w) => new Vector3(w.pos[0], w.pos[1], w.pos[2]),
  )
  const looks = waypoints.value.map(
    (w) => new Vector3(w.look[0], w.look[1], w.look[2]),
  )
  positionCurve = new CatmullRomCurve3(positions, false, 'catmullrom', 0.4)
  lookCurve = new CatmullRomCurve3(looks, false, 'catmullrom', 0.4)
}

function applyWaypoint(w: CameraWaypoint) {
  if (!camera.value) return
  camera.value.position.set(w.pos[0], w.pos[1], w.pos[2])
  camera.value.lookAt(w.look[0], w.look[1], w.look[2])
  if (w.fov !== undefined) {
    camera.value.fov = w.fov
    camera.value.updateProjectionMatrix()
  }
}

function setCamera(cam: PerspectiveCamera | null) {
  camera.value = cam
  if (cam && waypoints.value.length > 0) {
    applyWaypoint(waypoints.value[0])
  }
}

function setPath(path: CameraWaypoint[]) {
  waypoints.value = path
  rebuildCurves()
  if (camera.value && path.length > 0) {
    applyWaypoint(path[0])
  }
}

const tmpPos = new Vector3()
const tmpLook = new Vector3()

function setProgress(t: number) {
  if (!camera.value || !positionCurve || !lookCurve) return
  if (isFlying.value) return
  const clamped = Math.min(1, Math.max(0, t))
  positionCurve.getPoint(clamped, tmpPos)
  lookCurve.getPoint(clamped, tmpLook)
  camera.value.position.copy(tmpPos)
  camera.value.lookAt(tmpLook)
  const fovStart = waypoints.value[0]?.fov ?? 50
  const fovEnd =
    waypoints.value[waypoints.value.length - 1]?.fov ?? fovStart
  camera.value.fov = fovStart + (fovEnd - fovStart) * clamped
  camera.value.updateProjectionMatrix()
}

function flyTo(target: CameraWaypoint, ms = 1800): Promise<void> {
  return new Promise((resolve) => {
    if (!camera.value) return resolve()
    isFlying.value = true
    const cam = camera.value
    const startPos = cam.position.clone()
    const startQuat = cam.quaternion.clone()
    const startFov = cam.fov
    const endPos = new Vector3(target.pos[0], target.pos[1], target.pos[2])
    const endFov = target.fov ?? startFov

    const lookMatrix = cam.matrixWorld.clone()
    cam.position.copy(endPos)
    cam.lookAt(target.look[0], target.look[1], target.look[2])
    const endQuat = cam.quaternion.clone()
    cam.position.copy(startPos)
    cam.quaternion.copy(startQuat)
    cam.matrixWorld.copy(lookMatrix)

    const start = performance.now()
    function step(now: number) {
      const u = Math.min(1, (now - start) / ms)
      // ease-in-out cubic
      const eased = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
      cam.position.lerpVectors(startPos, endPos, eased)
      const q = new Quaternion().slerpQuaternions(startQuat, endQuat, eased)
      cam.quaternion.copy(q)
      cam.fov = startFov + (endFov - startFov) * eased
      cam.updateProjectionMatrix()
      if (u < 1) {
        requestAnimationFrame(step)
      } else {
        isFlying.value = false
        resolve()
      }
    }
    requestAnimationFrame(step)
  })
}

export function useCameraRig() {
  return {
    camera,
    isFlying,
    setCamera,
    setPath,
    setProgress,
    flyTo,
  }
}
