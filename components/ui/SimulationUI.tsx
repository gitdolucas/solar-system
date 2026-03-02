'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'
import { useSolarStore } from '@/lib/store/useSolarStore'

export function SimulationUI() {
  const splashDismissed = useSolarStore((s) => s.splashDismissed)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (splashDismissed) requestAnimationFrame(() => setEntered(true))
  }, [splashDismissed])

  if (!splashDismissed) return null

  return (
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
  )
}
