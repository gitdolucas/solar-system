'use client'

import { useRef, memo, useContext, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Outlines } from '@react-three/drei'
import * as THREE from 'three'
import type { PlanetData, MoonData } from '@/lib/types'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { Moon } from './Moon'
import { Rings } from './Rings'
import { OrbitLine } from './OrbitLine'
import { PlanetRefsContext } from './Scene'
import { TextureErrorBoundary } from './TextureErrorBoundary'

interface PlanetProps {
  data: PlanetData
  moons: MoonData[]
}

function PlanetMaterial({ textura }: { textura: string }) {
  const texture = useTexture(textura)
  return <meshStandardMaterial map={texture} roughness={0.85} metalness={0} />
}

function PlanetFallbackMaterial({ cor }: { cor: string }) {
  return <meshStandardMaterial color={cor} roughness={0.85} metalness={0} />
}

export const Planet = memo(function Planet({ data, moons }: PlanetProps) {
  const orbitGroupRef = useRef<THREE.Group>(null)
  const selfGroupRef = useRef<THREE.Group>(null)

  const selectedBody = useSolarStore((s) => s.selectedBody)
  const selectBody = useSolarStore((s) => s.selectBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)
  const hoveredBody = useSolarStore((s) => s.hoveredBody)
  const tooltipBody = useSolarStore((s) => s.tooltipBody)

  const isHovered =
    (tooltipBody?.type === 'planet' && tooltipBody?.id === data.id) ||
    (hoveredBody?.type === 'planet' && hoveredBody?.id === data.id)
  const isSelected =
    (selectedBody?.type === 'planet' && selectedBody.id === data.id) ||
    (selectedBody?.type === 'moon' && moons.some((m) => m.id === selectedBody.id))

  const refsMap = useContext(PlanetRefsContext)
  useEffect(() => {
    if (selfGroupRef.current) {
      refsMap.set(data.id, selfGroupRef as React.RefObject<THREE.Group>)
    }
    return () => { refsMap.delete(data.id) }
  }, [data.id, refsMap])

  useFrame((_, delta) => {
    const { simulationSpeed, orbitMode } = useSolarStore.getState()
    const dt = delta * simulationSpeed
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += data.orbitSpeed * dt * 0.04
      // Smoothly lerp orbital inclination when mode changes
      const targetInclination = orbitMode === 'ludico' ? (data.orbitInclination ?? 0) : 0
      orbitGroupRef.current.rotation.x +=
        (targetInclination - orbitGroupRef.current.rotation.x) * (1 - Math.exp(-4 * delta))
    }
    if (selfGroupRef.current) {
      selfGroupRef.current.rotation.y += data.selfRotationSpeed * dt * 0.3
    }
  })

  return (
    <>
      <group ref={orbitGroupRef}>
        <OrbitLine radius={data.orbitRadius} selected={isSelected} hovered={isHovered} />
        <group ref={selfGroupRef} position={[data.orbitRadius, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            rotation={[0, 0, data.tilt]}
            onClick={(e) => {
              e.stopPropagation()
              selectBody('planet', data.id)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              setTooltipBody({ type: 'planet', id: data.id })
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'default'
              setTooltipBody(null)
            }}
          >
            <sphereGeometry args={[data.size, 64, 64]} />
            <TextureErrorBoundary fallback={<PlanetFallbackMaterial cor={data.cor} />}>
              <Suspense fallback={<PlanetFallbackMaterial cor={data.cor} />}>
                <PlanetMaterial textura={data.textura} />
              </Suspense>
            </TextureErrorBoundary>
            {isHovered && (
              <Outlines color="#fff" thickness={0.04} screenspace opacity={1} />
            )}
          </mesh>

          {data.hasRings && data.ringTexture && (
            <group rotation={[0, 0, data.tilt]}>
              <Rings
                innerRadius={data.ringInnerRadius!}
                outerRadius={data.ringOuterRadius!}
                textura={data.ringTexture}
                opacity={data.ringOpacity}
                tint={data.ringTint}
              />
            </group>
          )}

          {moons.map((moon) => (
            <Moon key={moon.id} data={moon} visible={isSelected} />
          ))}
        </group>
      </group>
    </>
  )
})
