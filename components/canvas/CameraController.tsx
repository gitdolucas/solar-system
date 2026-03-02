'use client'

import { useRef, useEffect, useContext } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { PlanetRefsContext } from './Scene'

const SUN_CAM_POSITION = new THREE.Vector3(-50, 35, -50)
const SUN_POSITION = new THREE.Vector3(0, 0, 0)
const SUN_LOOK_AT = SUN_POSITION
// Zoom to sun: close enough to see it clearly
const SUN_ZOOM_POSITION = new THREE.Vector3(0, 4, 18)
const ARRIVAL_THRESHOLD = 0.5
// When hovering sidebar subject: FOV is reduced for a "looking at subject" telephoto effect
const DEFAULT_FOV = 60
const HOVER_FOV = 18
const HOVER_FOV_LERP = 4
const HOVER_ZOOM_BACK_THRESHOLD = 0.5

const PLANET_DISTANCE_MULTIPLIER = 4.5
const MOON_DISTANCE_MULTIPLIER = 7
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const CAMERA_OFFSET_UP_FACTOR = 0.12
const CAMERA_OFFSET_LEFT_FACTOR = 0.12

// For moons, choose what we want centered in the frame.
// 'sun' → moon foreground with Sun directly behind (matches planet framing)
// 'planet' → moon foreground, parent planet midground, Sun in the far background
const MOON_CENTER_MODE: 'sun' | 'planet' = 'sun'

// Reusable temp vector for direction calculations
const _viewDir = new THREE.Vector3()
const _sideDir = new THREE.Vector3()

function computeBodyView(
  bodyWorldPos: THREE.Vector3,
  centerWorldPos: THREE.Vector3,
  radius: number,
  distanceMultiplier: number,
  outCamPos: THREE.Vector3,
  outLookAt: THREE.Vector3
) {
  _viewDir.subVectors(bodyWorldPos, centerWorldPos)
  if (_viewDir.lengthSq() === 0) {
    _viewDir.set(0, 0, 1)
  } else {
    _viewDir.normalize()
  }

  const viewDistance = radius * distanceMultiplier

  // Build a small \"top-left\" offset in world space relative to the view direction:
  // - up: world +Y
  // - left: perpendicular to viewDir and up
  _sideDir.crossVectors(_viewDir, WORLD_UP)
  if (_sideDir.lengthSq() === 0) {
    _sideDir.set(1, 0, 0)
  } else {
    _sideDir.normalize()
  }

  outCamPos
    .copy(bodyWorldPos)
    .addScaledVector(_viewDir, viewDistance)
    .addScaledVector(WORLD_UP, viewDistance * CAMERA_OFFSET_UP_FACTOR)
    .addScaledVector(_sideDir, -viewDistance * CAMERA_OFFSET_LEFT_FACTOR)

  outLookAt.copy(centerWorldPos)
}

export function CameraController() {
  const { camera } = useThree()
  const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const refsMap = useContext(PlanetRefsContext)

  const isAnimating = useRef(false)
  const targetCamPos = useRef(SUN_CAM_POSITION.clone())
  const targetLookAt = useRef(SUN_LOOK_AT.clone())

  const camOffset = useRef(new THREE.Vector3())
  const isTrackingBody = useRef(false)

  // Reusable vectors — never allocate inside useFrame
  const _worldPos = useRef(new THREE.Vector3())
  const _prevBodyPos = useRef(new THREE.Vector3())
  const _camDiff = useRef(new THREE.Vector3())

  // Hover: store start target so we can restore look-at when hover ends
  const hoverStartTarget = useRef(new THREE.Vector3())
  const prevHoveredId = useRef<string | null>(null)
  const hoverZoomBack = useRef(false)

  // React hook only for useEffect dependency — useFrame reads getState() directly
  const selectedBodySnapshot = useSolarStore((s) => s.selectedBody)

  useEffect(() => {
    const selectedBody = useSolarStore.getState().selectedBody
    isAnimating.current = true
    isTrackingBody.current = false

    if (!selectedBody) {
      targetCamPos.current.copy(SUN_CAM_POSITION)
      targetLookAt.current.copy(SUN_LOOK_AT)
      hoverZoomBack.current = false
      prevHoveredId.current = null
      return
    }

    if (selectedBody.type === 'sun') {
      targetCamPos.current.copy(SUN_ZOOM_POSITION)
      targetLookAt.current.copy(SUN_LOOK_AT)
      return
    }

    if (selectedBody.type === 'planet') {
      const planet = PLANETS.find((p) => p.id === selectedBody.id)
      if (!planet) return
      const approxPlanetPos = new THREE.Vector3(planet.orbitRadius, 0, 0)
      computeBodyView(
        approxPlanetPos,
        SUN_POSITION,
        planet.size,
        PLANET_DISTANCE_MULTIPLIER,
        targetCamPos.current,
        targetLookAt.current
      )
      return
    }

    if (selectedBody.type === 'moon') {
      const moon = MOONS.find((m) => m.id === selectedBody.id)
      if (!moon) return
      const parentPlanet = PLANETS.find((p) => p.id === moon.parentId)
      const baseX = parentPlanet ? parentPlanet.orbitRadius : 0
      const approxMoonPos = new THREE.Vector3(baseX + moon.orbitRadius, 0, 0)

      const centerForMoon =
        MOON_CENTER_MODE === 'planet' && parentPlanet
          ? new THREE.Vector3(parentPlanet.orbitRadius, 0, 0)
          : SUN_POSITION

      computeBodyView(
        approxMoonPos,
        centerForMoon,
        moon.size,
        MOON_DISTANCE_MULTIPLIER,
        targetCamPos.current,
        targetLookAt.current
      )
    }
  }, [selectedBodySnapshot])

  useFrame((_, delta) => {
    // Always read fresh state — avoids stale closure bugs when selection changes rapidly
    const { selectedBody, hoveredBody } = useSolarStore.getState()

    cameraRef.current = camera as THREE.PerspectiveCamera
    const lerpFactor = 1 - Math.exp(-4 * delta)
    const cam = cameraRef.current
    const fovLerp = 1 - Math.exp(-HOVER_FOV_LERP * delta)

    // --- MODE 1: animating toward a new target ---
    if (isAnimating.current) {
      // Restore FOV to default when user clicked a menu option (was in hover narrow FOV)
      cam.fov = THREE.MathUtils.lerp(cam.fov, DEFAULT_FOV, fovLerp)
      cam.updateProjectionMatrix()

      // Keep target updated to live body position while flying in
      if (selectedBody && selectedBody.type !== 'sun') {
        const bodyRef = refsMap.get(selectedBody.id)
        if (bodyRef?.current) {
          bodyRef.current.getWorldPosition(_worldPos.current)

          let radius: number
          let distanceMultiplier: number
          const centerPos = SUN_POSITION
          if (selectedBody.type === 'planet') {
            const planet = PLANETS.find((p) => p.id === selectedBody.id)
            radius = planet ? planet.size : 2.4
            distanceMultiplier = PLANET_DISTANCE_MULTIPLIER
          } else {
            const moon = MOONS.find((m) => m.id === selectedBody.id)
            radius = moon ? moon.size : 0.4
            distanceMultiplier = MOON_DISTANCE_MULTIPLIER

            if (MOON_CENTER_MODE === 'planet' && moon) {
              const parentPlanet = PLANETS.find((p) => p.id === moon.parentId)
              if (parentPlanet) {
                const parentRef = refsMap.get(parentPlanet.id)
                if (parentRef?.current) {
                  parentRef.current.getWorldPosition(centerPos)
                } else {
                  centerPos.set(parentPlanet.orbitRadius, 0, 0)
                }
              }
            }
          }

          computeBodyView(
            _worldPos.current,
            centerPos,
            radius,
            distanceMultiplier,
            targetCamPos.current,
            targetLookAt.current
          )
        }
      }

      cam.position.lerp(targetCamPos.current, lerpFactor)

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, lerpFactor)
        controlsRef.current.update()
      }

      // Arrival check
      _camDiff.current.subVectors(cam.position, targetCamPos.current)
      if (_camDiff.current.length() < ARRIVAL_THRESHOLD) {
        cam.position.copy(targetCamPos.current)
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current)
          controlsRef.current.update()
        }
        isAnimating.current = false

        // Start tracking if arrived at a moving body (planet or moon)
        if (selectedBody && selectedBody.type !== 'sun') {
          const bodyRef = refsMap.get(selectedBody.id)
          if (bodyRef?.current) {
            bodyRef.current.getWorldPosition(_worldPos.current)
            camOffset.current.subVectors(cam.position, _worldPos.current)
            _prevBodyPos.current.copy(_worldPos.current)
          } else {
            camOffset.current.subVectors(cam.position, targetLookAt.current)
            _prevBodyPos.current.copy(targetLookAt.current)
          }
          isTrackingBody.current = true
        }
      }
      return
    }

    // --- MODE 2: tracking a planet/moon after arrival ---
    if (isTrackingBody.current && selectedBody && selectedBody.type !== 'sun') {
      const bodyRef = refsMap.get(selectedBody.id)
      if (bodyRef?.current && controlsRef.current) {
        bodyRef.current.getWorldPosition(_worldPos.current)

        const dx = _worldPos.current.x - _prevBodyPos.current.x
        const dy = _worldPos.current.y - _prevBodyPos.current.y
        const dz = _worldPos.current.z - _prevBodyPos.current.z

        cam.position.x += dx
        cam.position.y += dy
        cam.position.z += dz

        // Save planet position now — before _worldPos may be overwritten below
        _prevBodyPos.current.copy(_worldPos.current)

        // When hovering a moon while tracking its parent planet:
        // only steer look-at + FOV toward moon; camera position stays locked to planet
        const hoveringMoonOfSelectedPlanet =
          hoveredBody?.type === 'moon' && selectedBody.type === 'planet'

        if (hoveringMoonOfSelectedPlanet) {
          if (!prevHoveredId.current) {
            hoverStartTarget.current.copy(controlsRef.current.target)
            hoverZoomBack.current = false
          }
          prevHoveredId.current = hoveredBody!.id

          const moonRef = refsMap.get(hoveredBody!.id)
          if (moonRef?.current) {
            moonRef.current.getWorldPosition(_worldPos.current)
            controlsRef.current.target.lerp(_worldPos.current, lerpFactor)
          }
          cam.fov = THREE.MathUtils.lerp(cam.fov, HOVER_FOV, fovLerp)
        } else {
          if (prevHoveredId.current) hoverZoomBack.current = true
          prevHoveredId.current = null

          // Restore look-at to the tracked planet (already in _prevBodyPos)
          controlsRef.current.target.copy(_prevBodyPos.current)

          cam.fov = THREE.MathUtils.lerp(cam.fov, DEFAULT_FOV, fovLerp)
        }

        cam.updateProjectionMatrix()
        controlsRef.current.update()
      }
    }

    // --- MODE 3: free orbit (sun selected or nothing selected, not animating) ---
    // When hovering sidebar: look at body + drastically reduce FOV (telephoto "looking at subject")
    if (!isAnimating.current && !isTrackingBody.current && controlsRef.current) {
      if (hoveredBody) {
        // Entering hover: store current look-at so we can restore when hover ends
        if (!prevHoveredId.current) {
          hoverStartTarget.current.copy(controlsRef.current.target)
          hoverZoomBack.current = false
        }
        prevHoveredId.current = hoveredBody.id

        const target = controlsRef.current.target
        if (hoveredBody.type === 'sun') {
          target.lerp(SUN_LOOK_AT, lerpFactor)
        } else {
          const bodyRef = refsMap.get(hoveredBody.id)
          if (bodyRef?.current) {
            bodyRef.current.getWorldPosition(_worldPos.current)
            target.lerp(_worldPos.current, lerpFactor)
          }
        }

        // Reduce FOV only while hovering (no selection). On click, restore to default FOV.
        const targetFov = selectedBody ? DEFAULT_FOV : HOVER_FOV
        cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, fovLerp)
        cam.updateProjectionMatrix()
        controlsRef.current.update()
      } else {
        if (prevHoveredId.current) hoverZoomBack.current = true
        prevHoveredId.current = null

        // Restore FOV and optionally restore look-at target
        cam.fov = THREE.MathUtils.lerp(cam.fov, DEFAULT_FOV, fovLerp)
        cam.updateProjectionMatrix()

        if (!selectedBody) {
          // No selection (e.g. user clicked back): always look at the sun
          controlsRef.current.target.lerp(SUN_LOOK_AT, lerpFactor)
          controlsRef.current.update()
        } else if (hoverZoomBack.current) {
          // Hover ended while in overview: restore look-at to pre-hover target
          controlsRef.current.target.lerp(hoverStartTarget.current, lerpFactor)
          controlsRef.current.update()
          _camDiff.current.subVectors(controlsRef.current.target, hoverStartTarget.current)
          if (_camDiff.current.length() < HOVER_ZOOM_BACK_THRESHOLD) {
            controlsRef.current.target.copy(hoverStartTarget.current)
            hoverZoomBack.current = false
          }
        }
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      minDistance={1.5}
      maxDistance={300}
      zoomSpeed={0.8}
      rotateSpeed={0.5}
    />
  )
}
