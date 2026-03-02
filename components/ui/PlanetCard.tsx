import type { PlanetData } from '@/lib/types'

interface StatRowProps {
  label: string
  value: string
  icon: string
  accentColor: string
}

function StatRow({ label, value, icon, accentColor }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 14px',
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

      <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            color: `${accentColor}80`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '3px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ubuntu)',
            fontSize: '15px',
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        {/* Section tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '16px', height: '1px', background: `${planet.cor}60` }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
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
            fontSize: '42px',
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
            DADOS ORBITAIS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
        </div>
        <StatRow icon="☀️" label="Distância do Sol" value={planet.distanciaDaSol} accentColor={planet.cor} />
        <StatRow icon="🌍" label="Tamanho relativo" value={planet.tamanhoRelativo} accentColor={planet.cor} />
        <StatRow icon="🌡️" label="Temperatura" value={planet.temperatura} accentColor={planet.cor} />
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

      {/* Moons callout */}
      {planet.moons.length > 0 && (
        <div
          style={{
            padding: '12px 14px',
            background: `${planet.cor}08`,
            border: `1px solid ${planet.cor}30`,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: `1.5px solid ${planet.cor}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '14px' }}>🌙</span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-ubuntu)',
              fontSize: '13px',
              color: `${planet.cor}cc`,
              margin: 0,
            }}
          >
            <strong style={{ color: planet.cor }}>{planet.moons.length} lua{planet.moons.length > 1 ? 's'  : ''}</strong>{' '}
            <span style={{ color: 'rgba(210,230,255,0.5)' }}>visíveis ao redor do planeta</span>
          </p>
        </div>
      )}
    </div>
  )
}
