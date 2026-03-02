'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '@/lib/shaders/asteroidBelt'
import { useSolarStore } from '@/lib/store/useSolarStore'

export interface AsteroidBeltProps {
  innerRadius: number
  outerRadius: number
  count: number
  color: string
  sizeMin?: number
  sizeMax?: number
  thickness?: number
  /** Orbit speed, same scale as planets (positive = counter-clockwise). Default 0.2 */
  orbitSpeed?: number
  /** Multiplier for particle size (e.g. use >1 for farther belts so they don't look tiny). Default 1 */
  sizeScale?: number
}

export function AsteroidBelt({
  innerRadius,
  outerRadius,
  count,
  color,
  sizeMin = 0.35,
  sizeMax = 1.0,
  thickness = 0.4,
  orbitSpeed = 0.2,
  sizeScale = 1,
}: AsteroidBeltProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const orbitGroupRef = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = innerRadius + Math.random() * (outerRadius - innerRadius)
      const y = thickness * (Math.random() - 0.5)
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * r
      phases[i] = Math.random() * Math.PI * 2
      sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin)
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.computeBoundingSphere()
    return geo
  }, [innerRadius, outerRadius, count, thickness, sizeMin, sizeMax])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseSize: { value: 5.4 * sizeScale },
      uScale: { value: 90 },
      uMaxSize: { value: 15.0 * sizeScale },
      uColor: { value: new THREE.Color(color) },
    }),
    [color, sizeScale]
  )

  useFrame((_, delta) => {
    const speed = useSolarStore.getState().simulationSpeed
    const dt = delta * speed
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += orbitSpeed * dt * 0.04
    }
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value += dt
  })

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: true,
        depthTest: true,
      }),
    [uniforms]
  )

  return (
    <group ref={orbitGroupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  )
}
