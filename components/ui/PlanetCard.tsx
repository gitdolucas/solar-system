'use client'

import type { PlanetData } from '@/lib/types'
import { MOONS } from '@/lib/data/moons'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { useSidebarDense } from '@/lib/context/SidebarDenseContext'

interface StatRowProps {
  label: string
  value: string
  icon: string
  accentColor: string
  dense?: boolean
}

function StatRow({ label, value, icon, accentColor, dense }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: dense ? '8px' : '12px',
        padding: dense ? '8px 10px' : '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${accentColor}20`,
        borderLeft: `2px solid ${accentColor}60`,
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40%',
          height: '100%',
          background: `linear-gradient(90deg, ${accentColor}08 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      <span style={{ fontSize: dense ? '14px' : '16px', flexShrink: 0, marginTop: '1px', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: dense ? '8px' : '9px',
            color: `${accentColor}80`,
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

interface PlanetCardProps {
  planet: PlanetData
}

export function PlanetCard({ planet }: PlanetCardProps) {
  const selectBody = useSolarStore((s) => s.selectBody)
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)
  const dense = useSidebarDense()
  const planetMoons = MOONS.filter((m) => planet.moons.includes(m.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? '14px' : '24px' }}>

      {/* Header */}
      <div>
        {/* Section tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: dense ? '6px' : '8px', marginBottom: dense ? '8px' : '14px' }}>
          <div style={{ width: dense ? '12px' : '16px', height: '1px', background: `${planet.cor}60` }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: dense ? '9px' : '10px',
              color: `${planet.cor}80`,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            PLANETA
          </span>
          <div style={{ flex: 1, height: '1px', background: `${planet.cor}20` }} />

          {/* Orbital indicator dots */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: i === 0 ? planet.cor : `${planet.cor}40`,
                  boxShadow: i === 0 ? `0 0 6px ${planet.cor}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Alias */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: `${planet.cor}70`,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {planet.apelido}
        </p>

        {/* Planet name */}
        <h1
          style={{
            fontFamily: 'var(--font-pacifico)',
            fontSize: dense ? '30px' : '42px',
            lineHeight: 1,
            color: planet.cor,
            textShadow: `0 0 40px ${planet.cor}50, 0 0 80px ${planet.cor}20`,
            marginBottom: '0',
          }}
        >
          {planet.nome}
        </h1>

        {/* Decorative underline */}
        <div
          style={{
            marginTop: '10px',
            height: '1px',
            background: `linear-gradient(90deg, ${planet.cor}60 0%, ${planet.cor}20 40%, transparent 100%)`,
          }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: dense ? '4px' : '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: dense ? '6px' : '8px', marginBottom: dense ? '6px' : '8px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: 'rgba(100,180,255,0.4)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            DADOS ORBITAIS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
        </div>
        <StatRow icon="☀️" label="Distância do Sol" value={planet.distanciaDaSol} accentColor={planet.cor} dense={dense} />
        <StatRow icon="🌍" label="Tamanho relativo" value={planet.tamanhoRelativo} accentColor={planet.cor} dense={dense} />
        <StatRow icon="🌡️" label="Temperatura" value={planet.temperatura} accentColor={planet.cor} dense={dense} />
      </div>

      {/* Curiosidades */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: dense ? '6px' : '8px', marginBottom: dense ? '8px' : '12px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: dense ? '8px' : '9px',
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
          {planet.curiosidades.map((c, i) => (
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
              {/* Number badge */}
              <div
                style={{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${planet.cor}20`,
                  border: `1px solid ${planet.cor}40`,
                  marginTop: '1px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: planet.cor,
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

      {/* Moon list */}
      {planetMoons.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '12px', height: '1px', background: 'rgba(180,200,255,0.3)' }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(180,200,255,0.45)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              SATÉLITES
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(180,200,255,0.08)' }} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(180,200,255,0.25)',
                letterSpacing: '0.1em',
              }}
            >
              {planetMoons.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {planetMoons.map((moon, index) => (
              <button
                key={moon.id}
                onClick={() => selectBody('moon', moon.id)}
                onMouseEnter={() => {
                  setHoveredBody({ type: 'moon', id: moon.id })
                  setTooltipBody({ type: 'moon', id: moon.id })
                }}
                onMouseLeave={() => {
                  setHoveredBody(null)
                  setTooltipBody(null)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  const btn = e.currentTarget
                  btn.style.background = `${moon.cor}0f`
                  btn.style.border = `1px solid ${moon.cor}40`
                }}
                onMouseOut={(e) => {
                  const btn = e.currentTarget
                  btn.style.background = 'transparent'
                  btn.style.border = '1px solid transparent'
                }}
              >
                {/* Index */}
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    color: 'rgba(180,200,255,0.2)',
                    letterSpacing: '0.06em',
                    width: '16px',
                    flexShrink: 0,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Moon color dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: moon.cor,
                    boxShadow: `0 0 6px ${moon.cor}70`,
                    flexShrink: 0,
                  }}
                />

                {/* Name */}
                <span
                  style={{
                    fontFamily: 'var(--font-ubuntu)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#ccdff0',
                    flex: 1,
                  }}
                >
                  {moon.nome}
                </span>

                {/* Alias */}
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    color: 'rgba(180,200,255,0.3)',
                    letterSpacing: '0.05em',
                    maxWidth: '80px',
                    textAlign: 'right',
                    lineHeight: 1.3,
                  }}
                >
                  {moon.apelido}
                </span>

                {/* Arrow */}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{ color: 'rgba(180,200,255,0.25)', flexShrink: 0 }}
                >
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
