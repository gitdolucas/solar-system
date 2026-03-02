'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Outlines } from '@react-three/drei'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '@/lib/shaders/sun'
import { vertexShader as surfaceVertex, fragmentShader as surfaceFragment } from '@/lib/shaders/sunSurface'
import { TextureErrorBoundary } from './TextureErrorBoundary'
import { useSolarStore } from '@/lib/store/useSolarStore'

const uTimePlasma = { value: 0 }

function SunMaterial() {
  const texture = useTexture('/textures/sun.jpg')
  texture.wrapS = THREE.RepeatWrapping
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        uniforms: {
          uMap: { value: texture },
          uEmissiveIntensity: { value: 1.5 },
          uEmissiveTint: { value: new THREE.Vector3(1, 0.6, 0.1) },
        },
        side: THREE.FrontSide,
      }),
    [texture]
  )
  return <primitive object={material} attach="material" />
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
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const selectBody = useSolarStore((s) => s.selectBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)
  const hoveredBody = useSolarStore((s) => s.hoveredBody)
  const tooltipBody = useSolarStore((s) => s.tooltipBody)
  const isHovered =
    (tooltipBody?.type === 'sun' && tooltipBody?.id === 'sun') ||
    (hoveredBody?.type === 'sun' && hoveredBody?.id === 'sun')

  const plasmaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: uTimePlasma },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
    uTimePlasma.value += delta
  })

  return (
    <group ref={groupRef}>
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

      {/* Outer layer: arcs of plasma (shader), additive, no depth write */}
      <mesh>
        <sphereGeometry args={[5.2, 64, 64]} />
        <primitive object={plasmaMaterial} attach="material" />
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
