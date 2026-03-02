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

const SUN_CAM_POSITION = new THREE.Vector3(-35, 35, -50)
const SUN_LOOK_AT = new THREE.Vector3(0, 0, 0)
// Zoom to sun: close enough to see it clearly
const SUN_ZOOM_POSITION = new THREE.Vector3(0, 4, 18)
const ARRIVAL_THRESHOLD = 0.5
// When hovering sidebar subject: FOV is reduced for a "looking at subject" telephoto effect
const DEFAULT_FOV = 60
const HOVER_FOV = 18
const HOVER_FOV_LERP = 4
const HOVER_ZOOM_BACK_THRESHOLD = 0.5

export function CameraController() {
  const { camera } = useThree()
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
  const prevHoveredBody = useRef<typeof hoveredBody>(null)
  const hoverZoomBack = useRef(false)

  const selectedBody = useSolarStore((s) => s.selectedBody)
  const hoveredBody = useSolarStore((s) => s.hoveredBody)

  useEffect(() => {
    isAnimating.current = true
    isTrackingBody.current = false

    if (!selectedBody) {
      // Return to default overview; clear hover state so we look at sun, not old hover target
      targetCamPos.current.copy(SUN_CAM_POSITION)
      targetLookAt.current.copy(SUN_LOOK_AT)
      hoverZoomBack.current = false
      prevHoveredBody.current = null
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
      const viewDistance = planet.size * 5
      targetCamPos.current.set(planet.orbitRadius, viewDistance * 0.4, viewDistance)
      targetLookAt.current.set(planet.orbitRadius, 0, 0)
      return
    }

    if (selectedBody.type === 'moon') {
      const moon = MOONS.find((m) => m.id === selectedBody.id)
      if (!moon) return
      const viewDistance = moon.size * 8
      // Initial estimate — overwritten next frame by live world position
      const parentPlanet = PLANETS.find((p) => p.id === moon.parentId)
      const baseX = parentPlanet ? parentPlanet.orbitRadius : 0
      targetCamPos.current.set(baseX + moon.orbitRadius, viewDistance * 0.4, viewDistance)
      targetLookAt.current.set(baseX + moon.orbitRadius, 0, 0)
    }
  }, [selectedBody])

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.exp(-4 * delta)
    const perspCam = camera as THREE.PerspectiveCamera
    const fovLerp = 1 - Math.exp(-HOVER_FOV_LERP * delta)

    // --- MODE 1: animating toward a new target ---
    if (isAnimating.current) {
      // Restore FOV to default when user clicked a menu option (was in hover narrow FOV)
      perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, DEFAULT_FOV, fovLerp)
      perspCam.updateProjectionMatrix()

      // Keep target updated to live body position while flying in
      if (selectedBody && selectedBody.type !== 'sun') {
        const bodyRef = refsMap.get(selectedBody.id)
        if (bodyRef?.current) {
          bodyRef.current.getWorldPosition(_worldPos.current)

          let viewDistance: number
          if (selectedBody.type === 'planet') {
            const planet = PLANETS.find((p) => p.id === selectedBody.id)
            viewDistance = planet ? planet.size * 5 : 12
          } else {
            const moon = MOONS.find((m) => m.id === selectedBody.id)
            viewDistance = moon ? moon.size * 8 : 3
          }

          targetLookAt.current.copy(_worldPos.current)
          targetCamPos.current.set(
            _worldPos.current.x,
            _worldPos.current.y + viewDistance * 0.4,
            _worldPos.current.z + viewDistance
          )
        }
      }

      camera.position.lerp(targetCamPos.current, lerpFactor)

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, lerpFactor)
        controlsRef.current.update()
      }

      // Arrival check
      _camDiff.current.subVectors(camera.position, targetCamPos.current)
      if (_camDiff.current.length() < ARRIVAL_THRESHOLD) {
        camera.position.copy(targetCamPos.current)
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current)
          controlsRef.current.update()
        }
        isAnimating.current = false

        // Start tracking if arrived at a moving body (planet or moon)
        if (selectedBody && selectedBody.type !== 'sun') {
          camOffset.current.subVectors(camera.position, targetLookAt.current)
          _prevBodyPos.current.copy(targetLookAt.current)
          isTrackingBody.current = true
        }
      }
      return
    }

    // --- MODE 2: tracking a planet/moon after arrival ---
    if (isTrackingBody.current && selectedBody && selectedBody.type !== 'sun') {
      perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, DEFAULT_FOV, fovLerp)
      perspCam.updateProjectionMatrix()

      const bodyRef = refsMap.get(selectedBody.id)
      if (bodyRef?.current && controlsRef.current) {
        bodyRef.current.getWorldPosition(_worldPos.current)

        const dx = _worldPos.current.x - _prevBodyPos.current.x
        const dy = _worldPos.current.y - _prevBodyPos.current.y
        const dz = _worldPos.current.z - _prevBodyPos.current.z

        camera.position.x += dx
        camera.position.y += dy
        camera.position.z += dz
        controlsRef.current.target.copy(_worldPos.current)
        controlsRef.current.update()

        _prevBodyPos.current.copy(_worldPos.current)
      }
    }

    // --- MODE 3: free orbit (sun selected or nothing selected, not animating) ---
    // When hovering sidebar: look at body + drastically reduce FOV (telephoto "looking at subject")
    if (!isAnimating.current && !isTrackingBody.current && controlsRef.current) {
      if (hoveredBody) {
        // Entering hover: store current look-at so we can restore when hover ends
        if (!prevHoveredBody.current) {
          hoverStartTarget.current.copy(controlsRef.current.target)
          hoverZoomBack.current = false
        }
        prevHoveredBody.current = hoveredBody

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
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov, fovLerp)
        perspCam.updateProjectionMatrix()
        controlsRef.current.update()
      } else {
        if (prevHoveredBody.current) hoverZoomBack.current = true
        prevHoveredBody.current = null

        // Restore FOV and optionally restore look-at target
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, DEFAULT_FOV, fovLerp)
        perspCam.updateProjectionMatrix()

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
