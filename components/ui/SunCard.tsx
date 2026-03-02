'use client'

import type { SunData } from '@/lib/types'
import { useSidebarDense } from '@/lib/context/SidebarDenseContext'

const SUN_COLOR = '#f5a623'
const SUN_GLOW = 'rgba(245,166,35,0.4)'

interface StatRowProps {
  label: string
  value: string
  icon: string
  dense?: boolean
}

function StatRow({ label, value, icon, dense }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: dense ? '8px' : '12px',
        padding: dense ? '8px 10px' : '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${SUN_COLOR}20`,
        borderLeft: `2px solid ${SUN_COLOR}60`,
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          background: `linear-gradient(90deg, ${SUN_COLOR}08 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />
      <span style={{ fontSize: dense ? '14px' : '16px', flexShrink: 0, marginTop: '1px', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: dense ? '8px' : '9px',
            color: `${SUN_COLOR}80`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: dense ? '13px' : '15px',
            fontWeight: 500,
            color: '#eaf2ff',
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

interface SunCardProps {
  sun: SunData
}

export function SunCard({ sun }: SunCardProps) {
  const dense = useSidebarDense()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? '14px' : '24px' }}>

      {/* Header */}
      <div>
        {/* Section tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: dense ? '6px' : '8px', marginBottom: dense ? '8px' : '14px' }}>
          <div style={{ width: dense ? '12px' : '16px', height: '1px', background: `${SUN_COLOR}60` }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: dense ? '9px' : '10px',
              color: `${SUN_COLOR}80`,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ESTRELA CENTRAL
          </span>
          <div style={{ flex: 1, height: '1px', background: `${SUN_COLOR}20` }} />
          {/* Flare dots */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: i === 0 ? SUN_COLOR : `${SUN_COLOR}40`,
                  boxShadow: i === 0 ? `0 0 6px ${SUN_COLOR}` : 'none',
                  animation: i === 0 ? 'sun-pulse 3s ease-in-out infinite' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: `${SUN_COLOR}70`,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {sun.apelido}
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-pacifico)',
            fontSize: dense ? '30px' : '42px',
            lineHeight: 1,
            color: SUN_COLOR,
            textShadow: `0 0 40px ${SUN_GLOW}, 0 0 80px rgba(245,166,35,0.15)`,
            marginBottom: '0',
          }}
        >
          {sun.nome}
        </h1>

        <div
          style={{
            marginTop: '10px',
            height: '1px',
            background: `linear-gradient(90deg, ${SUN_COLOR}60 0%, ${SUN_COLOR}20 40%, transparent 100%)`,
          }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: 'rgba(100,180,255,0.4)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            DADOS ESTELARES
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
        </div>

        <StatRow icon="📏" label="Diâmetro" value={sun.diametro} dense={dense} />
        <StatRow icon="⚖️" label="Massa" value={sun.massa} dense={dense} />
        <StatRow icon="🌡️" label="Temperatura" value={sun.temperatura} dense={dense} />
        <StatRow icon="🕰️" label="Idade" value={sun.idade} dense={dense} />
      </div>

      {/* Curiosidades */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: 'rgba(100,180,255,0.4)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            CURIOSIDADES
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sun.curiosidades.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${SUN_COLOR}20`,
                  border: `1px solid ${SUN_COLOR}40`,
                  marginTop: '1px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: SUN_COLOR,
                  }}
                >
                  {i + 1}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-ubuntu)',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: 'rgba(210,230,255,0.8)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {c.texto}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sun-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px ${SUN_COLOR}; }
          50% { opacity: 0.5; box-shadow: 0 0 12px ${SUN_COLOR}; }
        }
      `}</style>
    </div>
  )
}
