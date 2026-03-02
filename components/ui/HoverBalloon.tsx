'use client'

import { useState, useEffect } from 'react'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { SUN } from '@/lib/data/sun'

const DOT_R = 3
const STEP = 12
const HORIZONTAL = 36
const LINE_Y = -STEP // SVG: negative y = up

function getHoverLabel(type: 'sun' | 'planet' | 'moon', id: string): string | null {
  if (type === 'sun') return SUN.nome
  if (type === 'planet') return PLANETS.find((p) => p.id === id)?.nome ?? null
  if (type === 'moon') return MOONS.find((m) => m.id === id)?.nome ?? null
  return null
}

export function HoverBalloon() {
  const tooltipBody = useSolarStore((s) => s.tooltipBody)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!tooltipBody) return null

  const label = getHoverLabel(tooltipBody.type, tooltipBody.id)
  if (!label) return null

  return (
    <div
      role="tooltip"
      aria-live="polite"
      className="pointer-events-none fixed z-50 transition-opacity duration-100"
      style={{
        left: position.x,
        top: position.y,
        width: 0,
        height: 0,
      }}
    >
      {/* Dot at cursor */}
      <div
        style={{
          position: 'absolute',
          left: -DOT_R,
          top: -DOT_R,
          width: DOT_R * 2,
          height: DOT_R * 2,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
        }}
      />
      {/* 45° step + horizontal line; SVG placed so path (0,0) = cursor */}
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: LINE_Y,
          width: STEP + HORIZONTAL,
          height: -LINE_Y,
          overflow: 'visible',
        }}
        viewBox={`0 ${LINE_Y} ${STEP + HORIZONTAL} ${-LINE_Y}`}
      >
        <path
          d={`M 0 0 L ${STEP} ${LINE_Y} L ${STEP + HORIZONTAL} ${LINE_Y}`}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Label balloon at end of horizontal segment */}
      <div
        style={{
          position: 'absolute',
          left: STEP + HORIZONTAL,
          top: LINE_Y,
          transform: 'translateY(-50%)',
          background: 'rgba(15, 18, 35, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          borderRadius: 6,
          padding: '6px 10px',
          fontFamily: 'var(--font-ubuntu)',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.95)',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
