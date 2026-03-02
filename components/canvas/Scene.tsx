'use client'

import React, { createContext, Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useControls, button } from 'leva'
import { Sun } from './Sun'
import { AsteroidBelt } from './AsteroidBelt'
import { Planet } from './Planet'
import { CameraController } from './CameraController'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { attribution } from '@/public/audio/background-music-attribution'
import { introClockRef, INTRO_PHASE_DURATION } from '@/lib/hooks/useIntroFade'

// Planets with orbitRadius < INNER_BELT_INNER get introPhase 1; others get phase 3
const INNER_BELT_INNER = 37
// Lúdico switch fires once the outer belt phase (4) has started fading
const LUDICO_SWITCH_TIME = 5 * INTRO_PHASE_DURATION

// Shared context: maps planet id → group ref for live world-position tracking
export const PlanetRefsContext = createContext<Map<string, React.RefObject<THREE.Group>>>(
  new Map()
)

function usePlanetRefsMap() {
  const [map] = React.useState(() => new Map<string, React.RefObject<THREE.Group>>())
  return map
}

function SceneContent() {
  const setSimulationSpeed = useSolarStore((s) => s.setSimulationSpeed)
  const setOrbitMode = useSolarStore((s) => s.setOrbitMode)
  const setBackgroundMusicPlaying = useSolarStore((s) => s.setBackgroundMusicPlaying)
  const setBackgroundMusicVolume = useSolarStore((s) => s.setBackgroundMusicVolume)
  const setIntroComplete = useSolarStore((s) => s.setIntroComplete)

  const [{ Velocidade, Modo }, setLevaControls] = useControls('Simulação', () => ({
    Velocidade: {
      value: 'Devagar',
      options: ['Parado', 'Devagar', 'Normal', 'Rápido', 'Super Rápido'],
    },
    Modo: {
      value: 'Real',
      options: ['Real', 'Lúdico'],
      label: 'Órbitas',
    },
  }))

  const [musicControls] = useControls(
    'Background Music',
    () => ({
      'Play / Pause': button(() => {
        const playing = useSolarStore.getState().backgroundMusicPlaying
        setBackgroundMusicPlaying(!playing)
      }),
      Volume: { value: 0.1, min: 0, max: 1, step: 0.01 },
      Attribution: {
        value: attribution.trim().replace(/\n/g, ' · '),
        disabled: true,
      },
    }),
    { collapsed: true },
    [setBackgroundMusicPlaying]
  )
  const Volume = musicControls.Volume

  // Push selected speed into store every render (no re-render cost inside useFrame)
  const speedMap: Record<string, number> = {
    Parado: 0,
    Devagar: 0.25,
    Normal: 1,
    Rápido: 3,
    'Super Rápido': 8,
  }
  setSimulationSpeed(speedMap[Velocidade] ?? 1)
  setOrbitMode(Modo === 'Lúdico' ? 'ludico' : 'real')
  setBackgroundMusicVolume(Volume)

  const splashDismissed = useSolarStore((s) => s.splashDismissed)

  // Tick the shared intro clock only after the splash is dismissed
  const introSwitchedRef = useRef(false)
  useFrame((_, delta) => {
    if (!splashDismissed) return
    introClockRef.elapsed += delta
    if (introSwitchedRef.current) return
    if (introClockRef.elapsed >= LUDICO_SWITCH_TIME) {
      introSwitchedRef.current = true
      setLevaControls({ Modo: 'Lúdico' })
      setIntroComplete()
    }
  })

  return (
    <>
      <Stars radius={300} depth={40} count={6000} factor={4} fade saturation={0.7} />

      {/* Ambient: just enough to show dark sides, not enough to wash out shadows */}
      <ambientLight intensity={0.35} />

      {/* Phase 0: Sun */}
      <Sun />

      {/* Phase 2: inner asteroid belt */}
      <AsteroidBelt innerRadius={37} outerRadius={49} count={60000} color="#8b7355" orbitSpeed={0.25} ludicInclination={0.44} introPhase={2} />
      {/* Phase 4: outer asteroid belt */}
      <AsteroidBelt innerRadius={152} outerRadius={210} count={40000} color="#6b5d4f" orbitSpeed={0.02} sizeScale={3.5} ludicInclination={-0.61} introPhase={4} />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          moons={MOONS.filter((m) => m.parentId === planet.id)}
          introPhase={planet.orbitRadius < INNER_BELT_INNER ? 1 : 3}
        />
      ))}

      <CameraController />

      <Preload all />
    </>
  )
}

export function Scene() {
  const planetRefsMap = usePlanetRefsMap()

  return (
    <PlanetRefsContext.Provider value={planetRefsMap}>
      <Canvas
        shadows="soft"
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{ position: [-50, 35, -50], fov: 60, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%' }}
        onPointerMissed={() => {
          // Reset cursor if clicking empty space
          document.body.style.cursor = 'default'
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </PlanetRefsContext.Provider>
  )
}
