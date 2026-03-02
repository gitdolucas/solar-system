import type { MoonData } from '@/lib/types'

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

interface MoonCardProps {
  moon: MoonData
}

export function MoonCard({ moon }: MoonCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '16px', height: '1px', background: `${moon.cor}60` }} />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: `${moon.cor}80`,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            SATÉLITE NATURAL
          </span>
          <div style={{ flex: 1, height: '1px', background: `${moon.cor}20` }} />
          {/* Crescent moon icon */}
          <span style={{ fontSize: '14px', opacity: 0.7 }}>☽</span>
        </div>

        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: `${moon.cor}70`,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          {moon.apelido}
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-pacifico)',
            fontSize: '40px',
            lineHeight: 1,
            color: moon.cor,
            textShadow: `0 0 40px ${moon.cor}50, 0 0 80px ${moon.cor}20`,
            marginBottom: '0',
          }}
        >
          {moon.nome}
        </h1>

        <div
          style={{
            marginTop: '10px',
            height: '1px',
            background: `linear-gradient(90deg, ${moon.cor}60 0%, ${moon.cor}20 40%, transparent 100%)`,
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
            DADOS FÍSICOS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(100,180,255,0.1)' }} />
        </div>
        <StatRow icon="🌡️" label="Temperatura" value={moon.temperatura} accentColor={moon.cor} />
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
          {moon.curiosidades.map((c, i) => (
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
                  background: `${moon.cor}20`,
                  border: `1px solid ${moon.cor}40`,
                  marginTop: '1px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: moon.cor,
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
    </div>
  )
}
