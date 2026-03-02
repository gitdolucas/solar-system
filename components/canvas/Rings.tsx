'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TextureErrorBoundary } from './TextureErrorBoundary'

interface RingsProps {
  innerRadius: number
  outerRadius: number
  textura: string
  /** 0–1, base opacity for subtler rings (e.g. Uranus). Default 1 */
  opacity?: number
  /** Tint color multiplied with texture (e.g. '#333' for darker). */
  tint?: string
  /** Intro fade ref — ring opacity is multiplied by this */
  opacityRef?: React.RefObject<number>
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
  baseOpacity,
  tint,
  opacityRef,
}: {
  textura: string
  baseOpacity: number
  tint?: string
  opacityRef?: React.RefObject<number>
}) {
  const texture = useTexture(textura)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (matRef.current) {
      matRef.current.opacity = baseOpacity * (opacityRef?.current ?? 1)
    }
  })
  return (
    <meshBasicMaterial
      ref={matRef}
      map={texture}
      color={tint ?? '#ffffff'}
      transparent
      opacity={0}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  )
}

function RingFallbackMaterial({
  baseOpacity,
  opacityRef,
}: {
  baseOpacity: number
  opacityRef?: React.RefObject<number>
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    if (matRef.current) {
      matRef.current.opacity = baseOpacity * (opacityRef?.current ?? 1)
    }
  })
  return (
    <meshBasicMaterial
      ref={matRef}
      color="#d4c080"
      transparent
      opacity={0}
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
  opacityRef,
}: RingsProps) {
  const geometry = useRingGeometry(innerRadius, outerRadius)

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <TextureErrorBoundary fallback={<RingFallbackMaterial baseOpacity={opacity} opacityRef={opacityRef} />}>
        <Suspense fallback={<RingFallbackMaterial baseOpacity={opacity} opacityRef={opacityRef} />}>
          <RingMaterial textura={textura} baseOpacity={opacity} tint={tint} opacityRef={opacityRef} />
        </Suspense>
      </TextureErrorBoundary>
    </mesh>
  )
}
