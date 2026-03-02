'use client'

import { useRef, memo, useContext, useEffect, Suspense, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Outlines } from '@react-three/drei'
import * as THREE from 'three'
import type { MoonData } from '@/lib/types'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { getNoiseTexture } from '@/lib/utils/noiseTexture'
import { TextureErrorBoundary } from './TextureErrorBoundary'
import { PlanetRefsContext } from './Scene'

const PLACEHOLDER_TEXTURE = '/textures/placeholder.png'

function isPlaceholderTexture(textura: string) {
  return textura === PLACEHOLDER_TEXTURE || textura.includes('placeholder')
}

interface MoonProps {
  data: MoonData
  visible: boolean
}

function MoonMaterial({ textura }: { textura: string }) {
  const texture = useTexture(textura)
  return <meshStandardMaterial map={texture} roughness={1} metalness={0} />
}

/** Procedural noise + base color; uses meshStandardMaterial for lighting. */
function MoonNoiseMaterial({ cor }: { cor: string }) {
  const noiseMap = useMemo(() => getNoiseTexture(), [])
  return (
    <meshStandardMaterial
      map={noiseMap}
      color={cor}
      roughness={0.9}
      metalness={0}
    />
  )
}

function MoonFallbackMaterial({ cor }: { cor: string }) {
  const noiseMap = useMemo(() => getNoiseTexture(), [])
  return (
    <meshStandardMaterial
      map={noiseMap}
      color={cor}
      roughness={0.9}
      metalness={0}
    />
  )
}

export const Moon = memo(function Moon({ data, visible }: MoonProps) {
  const orbitRef = useRef<THREE.Group>(null)
  const meshGroupRef = useRef<THREE.Group>(null)

  const selectBody = useSolarStore((s) => s.selectBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)
  const hoveredBody = useSolarStore((s) => s.hoveredBody)
  const tooltipBody = useSolarStore((s) => s.tooltipBody)
  const selectedBody = useSolarStore((s) => s.selectedBody)
  const refsMap = useContext(PlanetRefsContext)
  const isThisMoonSelected = selectedBody?.type === 'moon' && selectedBody.id === data.id
  const isHovered =
    !isThisMoonSelected &&
    ((tooltipBody?.type === 'moon' && tooltipBody?.id === data.id) ||
     (hoveredBody?.type === 'moon' && hoveredBody?.id === data.id))

  useEffect(() => {
    if (meshGroupRef.current) {
      refsMap.set(data.id, meshGroupRef as React.RefObject<THREE.Group>)
    }
    return () => { refsMap.delete(data.id) }
  }, [data.id, refsMap])

  useFrame((_, delta) => {
    const speed = useSolarStore.getState().simulationSpeed
    if (orbitRef.current) {
      orbitRef.current.rotation.y += data.orbitSpeed * delta * speed * 0.08
    }
  })

  return (
    <group ref={orbitRef} visible={visible}>
      <group ref={meshGroupRef} position={[data.orbitRadius, 0, 0]}>
        <mesh
          rotation={[0, 0, data.tilt]}
          castShadow
          receiveShadow
          onClick={(e) => {
            if (isThisMoonSelected) return // let click pass through to planet behind
            e.stopPropagation()
            selectBody('moon', data.id)
          }}
          onPointerOver={(e) => {
            if (isThisMoonSelected) return
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
            setTooltipBody({ type: 'moon', id: data.id })
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'default'
            setTooltipBody(null)
          }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          {isPlaceholderTexture(data.textura) ? (
            <MoonNoiseMaterial cor={data.cor} />
          ) : (
            <TextureErrorBoundary fallback={<MoonFallbackMaterial cor={data.cor} />}>
              <Suspense fallback={<MoonFallbackMaterial cor={data.cor} />}>
                <MoonMaterial textura={data.textura} />
              </Suspense>
            </TextureErrorBoundary>
          )}
          {isHovered && (
            <Outlines color="#fff" thickness={0.04} screenspace opacity={1} />
          )}
        </mesh>
      </group>
    </group>
  )
})
