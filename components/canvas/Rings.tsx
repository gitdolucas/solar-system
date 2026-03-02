'use client'

import { useMemo, Suspense } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TextureErrorBoundary } from './TextureErrorBoundary'

interface RingsProps {
  innerRadius: number
  outerRadius: number
  textura: string
  /** 0–1, for subtler/darker rings (e.g. Uranus). Default 1 */
  opacity?: number
  /** Tint color multiplied with texture (e.g. '#333' for darker). */
  tint?: string
}

function useRingGeometry(innerRadius: number, outerRadius: number) {
  return useMemo(() => {
    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const uv = geo.attributes.uv as THREE.BufferAttribute
    const v3 = new THREE.Vector3()

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i)
      const u = (v3.length() - innerRadius) / (outerRadius - innerRadius)
      uv.setXY(i, u, uv.getY(i))
    }
    return geo
  }, [innerRadius, outerRadius])
}

function RingMaterial({
  textura,
  opacity = 1,
  tint,
}: {
  textura: string
  opacity?: number
  tint?: string
}) {
  const texture = useTexture(textura)
  return (
    <meshBasicMaterial
      map={texture}
      color={tint ?? '#ffffff'}
      transparent
      opacity={opacity}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  )
}

function RingFallbackMaterial() {
  return (
    <meshBasicMaterial
      color="#d4c080"
      transparent
      opacity={0.7}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  )
}

export function Rings({
  innerRadius,
  outerRadius,
  textura,
  opacity = 1,
  tint,
}: RingsProps) {
  const geometry = useRingGeometry(innerRadius, outerRadius)

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <TextureErrorBoundary fallback={<RingFallbackMaterial />}>
        <Suspense fallback={<RingFallbackMaterial />}>
          <RingMaterial textura={textura} opacity={opacity} tint={tint} />
        </Suspense>
      </TextureErrorBoundary>
    </mesh>
  )
}
