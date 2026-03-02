'use client'

import { Sidebar } from '@/components/ui/Sidebar'
import { SubjectAudioPlayer } from '@/components/ui/SubjectAudioPlayer'
import { useSolarStore } from '@/lib/store/useSolarStore'

export function SimulationUI() {
  const splashDismissed = useSolarStore((s) => s.splashDismissed)
  if (!splashDismissed) return null
  return (
    <>
      <Sidebar />
      <SubjectAudioPlayer />
    </>
  )
}
