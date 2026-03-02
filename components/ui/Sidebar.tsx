'use client'

import { useSolarStore } from '@/lib/store/useSolarStore'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { SUN } from '@/lib/data/sun'
import { attribution } from '@/public/audio/background-music-attribution'
import { SystemInfo } from './SystemInfo'
import { PlanetCard } from './PlanetCard'
import { SunCard } from './SunCard'
import { MoonCard } from './MoonCard'
import { BackButton } from './BackButton'

export function Sidebar() {
  const selectedBody = useSolarStore((s) => s.selectedBody)

  const hasSelection = selectedBody !== null

  function renderContent() {
    if (!selectedBody) return <SystemInfo />

    if (selectedBody.type === 'sun') {
      return <SunCard sun={SUN} />
    }

    if (selectedBody.type === 'planet') {
      const planet = PLANETS.find((p) => p.id === selectedBody.id)
      if (planet) return <PlanetCard planet={planet} />
    }

    if (selectedBody.type === 'moon') {
      const moon = MOONS.find((m) => m.id === selectedBody.id)
      if (moon) return <MoonCard moon={moon} />
    }

    return <SystemInfo />
  }

  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        width: '360px',
        minWidth: '360px',
        background: 'linear-gradient(180deg, #020510 0%, #030815 50%, #020510 100%)',
        borderRight: '1px solid rgba(100, 180, 255, 0.12)',
        position: 'relative',
      }}
    >
      {/* Scanline texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle left glow edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '1px',
          height: '100%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(100, 180, 255, 0.3) 30%, rgba(100, 180, 255, 0.3) 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 24px 18px',
          borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
          background: 'rgba(0, 10, 30, 0.6)',
        }}
      >
        {/* System label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Corner bracket decoration */}
            <div style={{ position: 'relative', width: '20px', height: '20px', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderTop: '1.5px solid rgba(100,200,255,0.7)', borderLeft: '1.5px solid rgba(100,200,255,0.7)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderBottom: '1.5px solid rgba(100,200,255,0.7)', borderRight: '1.5px solid rgba(100,200,255,0.7)' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-pacifico)',
                fontSize: '22px',
                color: '#e8f4ff',
                letterSpacing: '0.02em',
                textShadow: '0 0 20px rgba(100,180,255,0.4)',
              }}
            >
              Explorador
            </span>
          </div>

          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 8px #4ade80',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#4ade80',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              ONLINE
            </span>
          </div>
        </div>

        {/* Coordinate readout bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            background: 'rgba(100, 180, 255, 0.05)',
            border: '1px solid rgba(100, 180, 255, 0.1)',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(100,180,255,0.5)', letterSpacing: '0.08em' }}>
            SOL&nbsp;·&nbsp;MILKY WAY
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(100,180,255,0.35)', letterSpacing: '0.08em' }}>
            8 PLANETAS
          </span>
        </div>

        {hasSelection && (
          <div style={{ marginTop: '10px' }}>
            <BackButton />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '24px 24px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(100,180,255,0.2) transparent',
        }}
      >
        {renderContent()}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '10px 24px',
          borderTop: '1px solid rgba(100, 180, 255, 0.08)',
          background: 'rgba(0, 5, 15, 0.8)',
        }}
      >
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            color: 'rgba(100,180,255,0.25)',
            letterSpacing: '0.06em',
            lineHeight: 1.6,
          }}
        >
          {attribution.trim().replace(/\n/g, ' · ')}
        </p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #4ade80; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #4ade80; }
        }
      `}</style>
    </aside>
  )
}
