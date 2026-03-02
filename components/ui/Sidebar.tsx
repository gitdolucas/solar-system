'use client'

import { useRef, useState, useCallback } from 'react'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { useIsMobile } from '@/lib/hooks/useIsMobile'
import { PLANETS } from '@/lib/data/planets'
import { MOONS } from '@/lib/data/moons'
import { SUN } from '@/lib/data/sun'
import { attribution } from '@/public/audio/background-music-attribution'
import { SystemInfo } from './SystemInfo'
import { PlanetCard } from './PlanetCard'
import { SunCard } from './SunCard'
import { MoonCard } from './MoonCard'
import { BackButton } from './BackButton'
import { SubjectAudioPlayer } from './SubjectAudioPlayer'
import { SidebarDenseProvider } from '@/lib/context/SidebarDenseContext'

const SCROLL_THRESHOLD = 60
const SCROLL_SHOW_THRESHOLD = 20

export function Sidebar() {
  const selectedBody = useSolarStore((s) => s.selectedBody)
  const dense = useIsMobile()
  const hasSelection = selectedBody !== null
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  // No effect needed: we use (headerCollapsed && hasSelection) for display, so when
  // hasSelection is false the header is always expanded.

  const handleContentScroll = useCallback(() => {
    if (!hasSelection) return
    const el = contentRef.current
    if (!el) return
    const st = el.scrollTop
    const scrollingDown = st > lastScrollTop.current
    lastScrollTop.current = st
    if (st <= SCROLL_SHOW_THRESHOLD) {
      setHeaderCollapsed(false)
      return
    }
    if (scrollingDown && st > SCROLL_THRESHOLD) setHeaderCollapsed(true)
    else if (!scrollingDown) setHeaderCollapsed(false)
  }, [hasSelection])

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
        minHeight: 0,
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

      {/* Header — collapses on scroll down, expands on scroll up; Back button always visible when has selection */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
          borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
          background: 'rgba(0, 10, 30, 0.6)',
          overflow: 'hidden',
          transition: 'padding 0.25s ease',
          padding: headerCollapsed ? (dense ? '8px 16px' : '12px 24px') : (dense ? '10px 16px 8px' : '20px 24px 18px'),
        }}
      >
        {/* Collapsible: title row + coordinate bar — hidden when scrolling down (only when a card is selected) */}
        <div
          style={{
            maxHeight: headerCollapsed && hasSelection ? 0 : 120,
            opacity: headerCollapsed && hasSelection ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.25s ease, opacity 0.2s ease',
          }}
        >
          {/* System label row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: dense ? '6px' : '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: dense ? '6px' : '10px' }}>
              <div style={{ position: 'relative', width: dense ? '14px' : '20px', height: dense ? '14px' : '20px', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: dense ? '6px' : '8px', height: dense ? '6px' : '8px', borderTop: '1.5px solid rgba(100,200,255,0.7)', borderLeft: '1.5px solid rgba(100,200,255,0.7)' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: dense ? '6px' : '8px', height: dense ? '6px' : '8px', borderBottom: '1.5px solid rgba(100,200,255,0.7)', borderRight: '1.5px solid rgba(100,200,255,0.7)' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-pacifico)',
                  fontSize: dense ? '16px' : '22px',
                  color: '#e8f4ff',
                  letterSpacing: '0.02em',
                  textShadow: '0 0 20px rgba(100,180,255,0.4)',
                }}
              >
                Sistema Solar
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: dense ? '5px' : '6px',
                  height: dense ? '5px' : '6px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 8px #4ade80',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: dense ? '8px' : '10px',
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
              padding: dense ? '4px 8px' : '6px 10px',
              background: 'rgba(100, 180, 255, 0.05)',
              border: '1px solid rgba(100, 180, 255, 0.1)',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: dense ? '8px' : '10px', color: 'rgba(100,180,255,0.5)', letterSpacing: '0.08em' }}>
              SOL&nbsp;·&nbsp;VIA LÁCTEA
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: dense ? '8px' : '10px', color: 'rgba(100,180,255,0.35)', letterSpacing: '0.08em' }}>
              8 PLANETAS
            </span>
          </div>
        </div>

        {hasSelection && (
          <div style={{ marginTop: headerCollapsed ? 0 : (dense ? '6px' : '10px'), transition: 'margin-top 0.25s ease' }}>
            <BackButton dense={dense} />
          </div>
        )}
      </div>

      {/* Content — scroll drives header collapse; minHeight: 0 required for flex child to scroll */}
      <div
        ref={contentRef}
        onScroll={handleContentScroll}
        className="flex-1 overflow-y-auto"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 0,
          padding: dense ? '12px 16px' : '24px 24px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(100,180,255,0.2) transparent',
        }}
      >
        <SidebarDenseProvider value={dense}>
          {renderContent()}
        </SidebarDenseProvider>
      </div>

      {/* Subject audio player — flexShrink: 0 so it stays visible */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0, padding: dense ? '0 16px 10px' : '0 24px 16px' }}>
        <SubjectAudioPlayer dense={dense} />
      </div>

      {/* Footer — flexShrink: 0 so it stays visible */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
          padding: dense ? '6px 16px' : '10px 24px',
          borderTop: '1px solid rgba(100, 180, 255, 0.08)',
          background: 'rgba(0, 5, 15, 0.8)',
        }}
      >
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: dense ? '8px' : '9px',
            color: 'rgba(100,180,255,0.25)',
            letterSpacing: '0.06em',
            lineHeight: 1.5,
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
