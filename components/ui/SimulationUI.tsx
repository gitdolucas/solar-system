'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'
import { useSolarStore } from '@/lib/store/useSolarStore'
import { PORTFOLIO_URL } from '@/lib/constants'

export function SimulationUI() {
  const splashDismissed = useSolarStore((s) => s.splashDismissed)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (splashDismissed) requestAnimationFrame(() => setEntered(true))
  }, [splashDismissed])

  if (!splashDismissed) return null

  return (
    <>
      <div style={{
        transform: entered ? 'translateX(0)' : 'translateX(-360px)',
        transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 2s',
        display: 'flex',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        <Sidebar />
      </div>
      {/* Portfolio CTA — bottom right, subtle */}
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          right: 14,
          bottom: 14,
          zIndex: 40,
          fontFamily: 'var(--font-ubuntu)',
          fontSize: '0.7rem',
          color: 'rgba(143,163,184,0.5)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontWeight: 400,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(245,166,35,0.75)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(143,163,184,0.5)'
        }}
      >
        Portfolio
      </a>
    </>
  )
}
