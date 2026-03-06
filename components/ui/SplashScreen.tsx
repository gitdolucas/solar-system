'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useSolarStore } from '@/lib/store/useSolarStore'

const FACTS = [
  'O Sol contém 99,86% de toda a massa do Sistema Solar.',
  'A luz do Sol leva ~8 minutos para chegar à Terra.',
  'Júpiter é maior que todos os outros planetas juntos.',
  'Saturno flutuaria na água — sua densidade é menor que a da água.',
  'Um dia em Vênus dura mais que um ano em Vênus.',
  'A Grande Mancha Vermelha de Júpiter existe há mais de 350 anos.',
  'Netuno tem os ventos mais rápidos do Sistema Solar: ~2.100 km/h.',
  'Existem mais de 200 luas orbitando os planetas do Sistema Solar.',
]

// Orbit ring definitions [radius, speed_deg_per_sec, size, color]
const ORBITS = [
  { r: 52,  speed: 4.15, size: 3,  color: '#b5b5b5', delay: 0 },
  { r: 68,  speed: 1.62, size: 4,  color: '#e8c07a', delay: 0.4 },
  { r: 86,  speed: 1.00, size: 5,  color: '#4b9cd3', delay: 0.8 },
  { r: 102, speed: 0.53, size: 4,  color: '#c1440e', delay: 1.2 },
  { r: 126, speed: 0.084,size: 9,  color: '#c88b3a', delay: 1.8 },
  { r: 150, speed: 0.034,size: 7,  color: '#d4a574', delay: 2.2 },
  { r: 170, speed: 0.012,size: 6,  color: '#7de8e8', delay: 2.6 },
  { r: 188, speed: 0.006,size: 5,  color: '#4b6cb7', delay: 3.0 },
]

function SolarDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2

    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 1000

      ctx.clearRect(0, 0, W, H)

      // Draw orbit rings
      ORBITS.forEach(({ r }) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Sun glow
      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
      sunGlow.addColorStop(0, 'rgba(255,220,80,1)')
      sunGlow.addColorStop(0.4, 'rgba(245,166,35,0.9)')
      sunGlow.addColorStop(0.7, 'rgba(245,120,20,0.4)')
      sunGlow.addColorStop(1, 'rgba(245,80,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 28, 0, Math.PI * 2)
      ctx.fillStyle = sunGlow
      ctx.fill()

      // Sun core
      ctx.beginPath()
      ctx.arc(cx, cy, 14, 0, Math.PI * 2)
      ctx.fillStyle = '#fff7c0'
      ctx.fill()

      // Draw planets
      ORBITS.forEach(({ r, speed, size, color, delay }) => {
        const age = Math.max(0, t - delay)
        const angle = (age * speed * Math.PI) / 180
        const px = cx + r * Math.cos(angle)
        const py = cy + r * Math.sin(angle)

        // Planet glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5)
        glow.addColorStop(0, color + 'cc')
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(px, py, size * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Planet
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={420}
      style={{ opacity: 0.9 }}
    />
  )
}

export function SplashScreen({
  texturesLoading,
  onDismiss,
}: {
  texturesLoading: boolean
  onDismiss?: () => void
}) {
  const dismissSplash = useSolarStore((s) => s.dismissSplash)
  const setBackgroundMusicPlaying = useSolarStore((s) => s.setBackgroundMusicPlaying)

  const [factIndex, setFactIndex] = useState(0)
  const [factVisible, setFactVisible] = useState(true)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)
  const [exiting, setExiting] = useState(false)

  // Cycle facts
  useEffect(() => {
    const id = setInterval(() => {
      setFactVisible(false)
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % FACTS.length)
        setFactVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (exiting) return
      setRipple({ x: e.clientX, y: e.clientY })
      setExiting(true)
      setBackgroundMusicPlaying(true)
      setTimeout(() => {
        onDismiss?.() ?? dismissSplash()
      }, 900)
    },
    [exiting, dismissSplash, setBackgroundMusicPlaying, onDismiss]
  )

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0d1633 0%, #060a18 55%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: exiting ? 'splash-fade-out 0.9s ease-in forwards' : 'splash-fade-in 1.2s ease-out forwards',
        userSelect: 'none',
      }}
    >
      {/* Star field */}
      <StarField />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Solar diagram */}
        <div style={{
          animation: 'diagram-float 6s ease-in-out infinite',
          filter: 'drop-shadow(0 0 60px rgba(245,166,35,0.25))',
          marginBottom: -12,
        }}>
          <SolarDiagram />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{
            fontFamily: 'var(--font-pacifico)',
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: '#fff',
            margin: 0,
            lineHeight: 1.1,
            textShadow: '0 0 60px rgba(245,166,35,0.7), 0 0 120px rgba(245,100,20,0.4)',
            letterSpacing: '-0.01em',
          }}>
            Sistema Solar
          </h1>
          <p style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: '#8fa3b8',
            margin: '8px 0 0',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 300,
          }}>
            Explore o universo em 3D
          </p>
        </div>

        {/* Divider */}
        <div style={{
          width: 1,
          height: 32,
          background: 'linear-gradient(to bottom, rgba(245,166,35,0.5), transparent)',
          margin: '16px 0',
        }} />

        {/* Fact carousel */}
        <div style={{
          width: 'min(480px, 90vw)',
          textAlign: 'center',
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}>
          <p style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: 'clamp(0.8rem, 1.8vw, 0.92rem)',
            color: '#c8d8e8',
            margin: 0,
            lineHeight: 1.6,
            opacity: factVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
            fontWeight: 300,
          }}>
            <span style={{ color: '#f5a623', fontWeight: 500 }}>Sabia que? </span>
            {FACTS[factIndex]}
          </p>
        </div>

        {/* CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          animation: 'cta-pulse 2.5s ease-in-out infinite',
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1.5px solid rgba(245,166,35,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              border: '1px solid rgba(245,166,35,0.2)',
              animation: 'ring-expand 2.5s ease-out infinite',
            }} />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="6,3 15,9 6,15" fill="#f5a623" />
            </svg>
          </div>
          <p style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: '0.78rem',
            color: 'rgba(245,166,35,0.7)',
            margin: 0,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}>
            Clique para iniciar
          </p>
        </div>

        {/* Dedication */}
        <p style={{
          fontFamily: 'var(--font-pacifico)',
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: 'rgba(255,255,255,0.6)',
          margin: '32px 0 0',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}>
          Com amor, de papai para Ícaro.
        </p>
      </div>

      {/* Loading indicator bottom — only shown while textures are actually loading */}
      {texturesLoading && (
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: 0.4,
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#f5a623',
            animation: 'dot-pulse 1.4s ease-in-out infinite',
          }} />
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#f5a623',
            animation: 'dot-pulse 1.4s ease-in-out 0.2s infinite',
          }} />
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#f5a623',
            animation: 'dot-pulse 1.4s ease-in-out 0.4s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: '0.68rem',
            color: '#8fa3b8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginLeft: 4,
          }}>
            Carregando texturas
          </span>
        </div>
      )}

      {/* Ripple effect on click */}
      {ripple && (
        <div
          style={{
            position: 'fixed',
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(245,166,35,0.3)',
            animation: 'ripple-expand 0.9s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      <style>{`
        @keyframes splash-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes splash-fade-out {
          0%   { opacity: 1; transform: scale(1); }
          60%  { opacity: 0.4; }
          100% { opacity: 0; transform: scale(1.04); }
        }
        @keyframes diagram-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes cta-pulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50%       { opacity: 0.65; transform: translateY(3px); }
        }
        @keyframes ring-expand {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1); opacity: 1; }
        }
        @keyframes ripple-expand {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(120); opacity: 0; }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: var(--star-base-opacity); }
          50%       { opacity: calc(var(--star-base-opacity) * 0.3); }
        }
      `}</style>
    </div>
  )
}

// Simple deterministic pseudo-random generator based on an index.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Purely decorative static star field — deterministic across server and client.
// All numeric style values use fixed decimal places to avoid hydration mismatch
// (server and client can serialize floats differently).
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => {
        const rand = (offset: number) => pseudoRandom(i * 7.13 + offset)
        return {
          x: (rand(0) * 100).toFixed(4),
          y: (rand(1) * 100).toFixed(4),
          size: (rand(2) * 1.6 + 0.4).toFixed(4),
          opacity: (rand(3) * 0.5 + 0.15).toFixed(6),
          duration: (rand(4) * 4 + 3).toFixed(5),
          delay: (rand(5) * 5).toFixed(6),
        }
      }),
    []
  )

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: '#fff',
            // @ts-expect-error CSS custom property
            '--star-base-opacity': s.opacity,
            opacity: s.opacity,
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
