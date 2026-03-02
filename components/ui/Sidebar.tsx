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
        width: '340px',
        minWidth: '340px',
        background: 'rgba(5, 8, 20, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌌</span>
          <span
            className="text-xl"
            style={{ fontFamily: 'var(--font-pacifico)', color: '#f5a623' }}
          >
            Explorador
          </span>
        </div>
        {hasSelection && <BackButton />}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {renderContent()}
      </div>

      {/* Music attribution */}
      <div
        className="px-6 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}
      >
        <p
          className="text-[10px] leading-tight opacity-60"
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          {attribution.trim().replace(/\n/g, ' · ')}
        </p>
      </div>
    </aside>
  )
}
