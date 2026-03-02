'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitLineProps {
  radius: number
  segments?: number
  selected?: boolean
  hovered?: boolean
}

export function OrbitLine({ radius, segments = 128, selected = false, hovered = false }: OrbitLineProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
    }
    return pts
  }, [radius, segments])

  const lineWidth = selected ? 2.0 : hovered ? 1.2 : 0.5
  const opacity = selected ? 0.55 : hovered ? 0.3 : 0.07
  const color = selected ? '#a0c8ff' : '#ffffff'

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  )
}
