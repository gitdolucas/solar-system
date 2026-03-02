'use client'

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export function LandscapePrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => {
      const isNarrow = typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
      const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth
      setShow(isNarrow && isPortrait)
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'auto',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #060b22 0%, #020313 50%, #000000 100%)',
      }}
    >
      {/* Soft starfield / scanline layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08) 0, transparent 55%), radial-gradient(circle at 80% 70%, rgba(245,166,35,0.12) 0, transparent 60%), repeating-linear-gradient(180deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)',
          mixBlendMode: 'screen',
          opacity: 0.4,
        }}
      />

      {/* Horizon glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '-40%',
          width: '180%',
          height: '80%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(circle at 50% 0%, rgba(245,166,35,0.55) 0%, rgba(245,166,35,0.15) 35%, rgba(0,0,0,0) 70%)',
          opacity: 0.9,
          filter: 'blur(10px)',
        }}
      />

      {/* Content card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: 'min(360px, 100%)',
            borderRadius: 18,
            border: '1px solid rgba(100, 180, 255, 0.35)',
            background:
              'linear-gradient(135deg, rgba(4,10,28,0.94) 0%, rgba(2,6,18,0.98) 60%, rgba(10,22,45,0.96) 100%)',
            boxShadow:
              '0 18px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(10,40,80,0.8), 0 0 40px rgba(245,166,35,0.3)',
            padding: '18px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            backdropFilter: 'blur(18px)',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(12, 32, 80, 0.85)',
              border: '1px solid rgba(100, 180, 255, 0.5)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#f5a623',
                boxShadow: '0 0 8px rgba(245,166,35,0.9)',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(173, 206, 255, 0.9)',
              }}
            >
              MODO RECOMENDADO
            </span>
          </div>

          {/* Phone + orbit animation */}
          <div
            style={{
              position: 'relative',
              width: 96,
              height: 64,
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            {/* Orbit arc */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '55%',
                width: 120,
                height: 52,
                transform: 'translateX(-50%)',
                borderRadius: '999px',
                border: '1px dashed rgba(100,180,255,0.4)',
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                filter: 'drop-shadow(0 0 12px rgba(100,180,255,0.6))',
                opacity: 0.5,
              }}
            />

            {/* Tiny sun */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '55%',
                width: 18,
                height: 18,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 30% 20%, #fff9dd 0%, #ffd46a 35%, #f5a623 60%, rgba(245,166,35,0) 100%)',
                boxShadow: '0 0 20px rgba(245,166,35,0.8)',
              }}
            />

            {/* Phone orbiting */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '55%',
                transformOrigin: '-36px 0px',
                animation: 'orbit-phone 4.8s ease-in-out infinite',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 30,
                  borderRadius: 10,
                  border: '1.5px solid rgba(173, 206, 255, 0.95)',
                  background:
                    'linear-gradient(135deg, rgba(2,10,28,0.9) 0%, rgba(8,26,64,0.9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.85), 0 0 16px rgba(80,140,255,0.7)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 14,
                    borderRadius: 999,
                    border: '1px solid rgba(100,180,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: 8,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(173, 206, 255, 0.9)',
                  }}
                >
                  16:9
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-ubuntu)',
                fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)',
                color: '#e8f4ff',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Para explorar melhor as{' '}
              <span style={{ color: '#f5a623', fontWeight: 500 }}>órbitas</span> e os{' '}
              <span style={{ color: '#f5a623', fontWeight: 500 }}>detalhes</span> do sistema
              solar, use seu dispositivo em{' '}
              <span style={{ color: '#f5a623', fontWeight: 600 }}>modo paisagem</span>.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ubuntu)',
                fontSize: '0.78rem',
                color: 'rgba(143, 163, 184, 0.95)',
                marginTop: 10,
                marginBottom: 0,
              }}
            >
              Gire o aparelho para a horizontal — a experiência fica mais ampla e confortável.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ubuntu)',
                fontSize: '0.72rem',
                color: 'rgba(143, 163, 184, 0.75)',
                marginTop: 12,
                marginBottom: 0,
                fontStyle: 'italic',
              }}
            >
              A experiência é <strong style={{ color: 'rgba(245, 166, 35, 0.95)' }}>muito melhor no computador</strong>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-phone {
          0% {
            transform: rotate(-32deg) translateY(0);
          }
          45% {
            transform: rotate(12deg) translateY(-2px);
          }
          60% {
            transform: rotate(12deg) translateY(-2px);
          }
          100% {
            transform: rotate(-32deg) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
