'use client'

import React, { createContext, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
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
  const setBackgroundMusicPlaying = useSolarStore((s) => s.setBackgroundMusicPlaying)
  const setBackgroundMusicVolume = useSolarStore((s) => s.setBackgroundMusicVolume)

  const [{ Speed, Multiplier }] = useControls('Simulation', () => ({
    Speed: { value: 1, min: 0, max: 10, step: 0.1 },
    Multiplier: {
      value: '×1',
      options: ['×0.1', '×1', '×10', '×100'],
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
    [setBackgroundMusicPlaying]
  )
  const Volume = musicControls.Volume

  // Push combined value into store every render (no re-render cost inside useFrame)
  const multiplierMap: Record<string, number> = { '×0.1': 0.1, '×1': 1, '×10': 10, '×100': 100 }
  setSimulationSpeed(Speed * (multiplierMap[Multiplier] ?? 1))
  setBackgroundMusicVolume(Volume)

  return (
    <>
      <Stars radius={300} depth={40} count={6000} factor={4} fade saturation={0.7} />

      {/* Ambient: just enough to show dark sides, not enough to wash out shadows */}
      <ambientLight intensity={0.35} />

      <Sun />

      <AsteroidBelt innerRadius={37} outerRadius={49} count={60000} color="#8b7355" orbitSpeed={0.25} />
      <AsteroidBelt innerRadius={152} outerRadius={210} count={40000} color="#6b5d4f" orbitSpeed={0.02} sizeScale={3.5} />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          moons={MOONS.filter((m) => m.parentId === planet.id)}
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
        camera={{ position: [-35, 35, -50], fov: 60, near: 0.1, far: 1000 }}
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
