'use client'

import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Outlines } from '@react-three/drei'
import * as THREE from 'three'
import { TextureErrorBoundary } from './TextureErrorBoundary'
import { useSolarStore } from '@/lib/store/useSolarStore'

function SunMaterial() {
  const texture = useTexture('/textures/sun.jpg')
  return (
    <meshStandardMaterial
      map={texture}
      emissive={new THREE.Color(1, 0.6, 0.1)}
      emissiveMap={texture}
      emissiveIntensity={1.5}
      roughness={1}
      metalness={0}
    />
  )
}

function SunFallbackMaterial() {
  return (
    <meshStandardMaterial
      color="#f5a623"
      emissive={new THREE.Color(1, 0.5, 0.05)}
      emissiveIntensity={1.5}
      roughness={1}
      metalness={0}
    />
  )
}

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const selectBody = useSolarStore((s) => s.selectBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)
  const hoveredBody = useSolarStore((s) => s.hoveredBody)
  const tooltipBody = useSolarStore((s) => s.tooltipBody)
  const isHovered =
    (tooltipBody?.type === 'sun' && tooltipBody?.id === 'sun') ||
    (hoveredBody?.type === 'sun' && hoveredBody?.id === 'sun')

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group>
      {/* Point light — sole shadow-casting source, low decay to reach distant planets */}
      <pointLight
        intensity={4}
        distance={800}
        decay={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={800}
      />

      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); selectBody('sun', 'sun') }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setTooltipBody({ type: 'sun', id: 'sun' })
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'default'
          setTooltipBody(null)
        }}
      >
        <sphereGeometry args={[5, 64, 64]} />
        <TextureErrorBoundary fallback={<SunFallbackMaterial />}>
          <Suspense fallback={<SunFallbackMaterial />}>
            <SunMaterial />
          </Suspense>
        </TextureErrorBoundary>
        {isHovered && (
          <Outlines color="#fff" thickness={0.04} screenspace opacity={1} />
        )}
      </mesh>

      {/* Glow halo — outer sphere with additive blending */}
      <mesh>
        <sphereGeometry args={[6.5, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(1, 0.6, 0.1)}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
