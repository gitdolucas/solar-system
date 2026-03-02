'use client'

import { PLANETS } from '@/lib/data/planets'
import { useSolarStore } from '@/lib/store/useSolarStore'

export function SystemInfo() {
  const selectBody = useSolarStore((s) => s.selectBody)
  const setHoveredBody = useSolarStore((s) => s.setHoveredBody)
  const setTooltipBody = useSolarStore((s) => s.setTooltipBody)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero section */}
      <div>
        {/* Section tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '16px', height: '1px', background: 'rgba(100,180,255,0.4)' }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(100,180,255,0.5)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            SISTEMA SOLAR
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.12)' }} />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-pacifico)',
            fontSize: '38px',
            lineHeight: 1.1,
            color: '#f0f8ff',
            marginBottom: '12px',
            textShadow: '0 0 40px rgba(100,180,255,0.2)',
          }}
        >
          Nosso Lar<br />
          <span style={{ color: '#f5a623', textShadow: '0 0 30px rgba(245,166,35,0.3)' }}>no Universo</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(180,210,240,0.7)',
          }}
        >
          Formado pelo Sol e tudo que orbita ao redor dele. Clique em um planeta para explorar!
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
        }}
      >
        {[
          { value: '8', label: 'Planetas' },
          { value: '4,5B', label: 'Anos' },
          { value: '1', label: 'Estrela' },
        ].map(({ value, label }) => (
          <div
            key={label}
            style={{
              padding: '12px 10px',
              background: 'rgba(100,180,255,0.04)',
              border: '1px solid rgba(100,180,255,0.1)',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '20px',
                fontWeight: 700,
                color: '#7ec8e3',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: 'rgba(100,180,255,0.4)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Planet list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '16px', height: '1px', background: 'rgba(100,180,255,0.4)' }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(100,180,255,0.5)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            CORPO CELESTES
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.12)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {PLANETS.map((planet, index) => (
            <button
              key={planet.id}
              onClick={() => selectBody('planet', planet.id)}
              onMouseEnter={() => {
                setHoveredBody({ type: 'planet', id: planet.id })
                setTooltipBody({ type: 'planet', id: planet.id })
              }}
              onMouseLeave={() => {
                setHoveredBody(null)
                setTooltipBody(null)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="planet-row"
              onMouseOver={(e) => {
                const btn = e.currentTarget
                btn.style.background = `${planet.cor}0f`
                btn.style.border = `1px solid ${planet.cor}40`
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
                  color: 'rgba(100,180,255,0.25)',
                  letterSpacing: '0.06em',
                  width: '16px',
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Planet color dot with glow */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: planet.cor,
                  boxShadow: `0 0 8px ${planet.cor}80`,
                  flexShrink: 0,
                }}
              />

              {/* Name */}
              <span
                style={{
                  fontFamily: 'var(--font-ubuntu)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#ddeeff',
                  flex: 1,
                }}
              >
                {planet.nome}
              </span>

              {/* Alias */}
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '9px',
                  color: 'rgba(100,180,255,0.35)',
                  letterSpacing: '0.06em',
                  maxWidth: '90px',
                  textAlign: 'right',
                  lineHeight: 1.3,
                  display: 'none',
                }}
                className="planet-alias"
              >
                {planet.apelido}
              </span>

              {/* Arrow */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ color: 'rgba(100,180,255,0.3)', flexShrink: 0 }}
              >
                <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Hint card */}
      <div
        style={{
          padding: '14px 16px',
          background: 'rgba(245,166,35,0.06)',
          border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative corner */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderTop: '1px solid rgba(245,166,35,0.4)', borderRight: '1px solid rgba(245,166,35,0.4)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✦</span>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu)',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'rgba(245,200,80,0.8)',
              margin: 0,
            }}
          >
            Use o mouse para girar e o scroll para aproximar ou afastar a câmera
          </p>
        </div>
      </div>
    </div>
  )
}
